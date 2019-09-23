import * as React from 'react';
import { Coords, getTooltipPosition, CardinalOrientation, getNearestScrollAncestor, OrientationCoords, isElementInView, scrollToElement } from '../positioning'
import { Mask } from './Mask';
import { Tooltip } from './Tooltip';
import * as ReactDOM from 'react-dom';

export interface WalktourLogic {
  next: () => void;
  prev: () => void;
  close: () => void;
  goToStep: (stepNumber: number) => void;
  stepContent: Step;
  stepIndex: number;
  allSteps: Step[];
}

export interface WalktourOptions {
  disableMaskInteraction?: boolean;
  disableCloseOnClick?: boolean;
  orientationPreferences?: CardinalOrientation[];
  maskPadding?: number;
  tooltipSeparation?: number;
  tooltipWidth?: number;
  transition?: string;
  customTitleRenderer?: (title?: string, tourLogic?: WalktourLogic) => JSX.Element;
  customDescriptionRenderer?: (description: string, tourLogic?: WalktourLogic) => JSX.Element;
  customFooterRenderer?: (tourLogic?: WalktourLogic) => JSX.Element;
  customTooltipRenderer?: (tourLogic?: WalktourLogic) => JSX.Element;
  customNextFunc?: (tourLogic: WalktourLogic) => void;
  customPrevFunc?: (tourLogic: WalktourLogic) => void;
  prevLabel?: string;
  nextLabel?: string;
  closeLabel?: string;
  disableNext?: boolean;
  disablePrev?: boolean;
  disableClose?: boolean;
  disableAutoScroll?: boolean;
  positionCandidateReducer?: (acc: Coords, cur: OrientationCoords, ind: number, arr: OrientationCoords[]) => Coords;

}

export interface Step extends WalktourOptions {
  selector: string;
  title?: string;
  description: string;
}

export interface WalktourProps extends WalktourOptions {
  steps: Step[];
  initialStepIndex?: number;
  zIndex?: number;
  rootSelector?: string;
  identifier?: string;
}

const walktourDefaultProps: Partial<WalktourProps> = {
  tooltipWidth: 250,
  maskPadding: 5,
  tooltipSeparation: 10,
  transition: 'top 200ms ease, left 200ms ease',
  disableMaskInteraction: false,
  disableCloseOnClick: false,
  zIndex: 9999
}

const basePortalString: string = 'walktour-portal';
const baseTooltipContainerString: string = 'walktour-tooltip-container';

export const Walktour = (props: WalktourProps) => {

  const {
    steps,
    initialStepIndex
  } = props;

  const [isVisibleState, setVisible] = React.useState<boolean>(true);
  const [target, setTarget] = React.useState<HTMLElement>(undefined);
  const [tooltip, setTooltip] = React.useState<HTMLElement>(undefined);
  const [tooltipPosition, setTooltipPosition] = React.useState<Coords>(undefined);
  const [tourRoot, setTourRoot] = React.useState<Element>(undefined)
  const [currentStepIndex, setCurrentStepIndex] = React.useState<number>(initialStepIndex || 0);
  const currentStepContent: Step = steps[currentStepIndex];

  const {
    maskPadding,
    disableMaskInteraction,
    disableCloseOnClick,
    tooltipSeparation,
    tooltipWidth,
    transition,
    orientationPreferences,
    customTooltipRenderer,
    zIndex,
    rootSelector,
    customNextFunc,
    customPrevFunc,
    disableClose,
    disableNext,
    disablePrev,
    disableAutoScroll,
    identifier,
    positionCandidateReducer
  } = {
    ...walktourDefaultProps,
    ...props,
    ...currentStepContent
  };

  // after first render, set the tour root and initial position of target/tooltip
  React.useEffect(() => {
    let root: Element;
    if (rootSelector) {
      root = document.querySelector(rootSelector);
    }

    if (!root) {
      root = getNearestScrollAncestor(document.getElementById(getIdString(basePortalString, identifier)));
    }

    setTourRoot(root);
    updateTour(root);
  }, []);

  //update tour when step changes
  React.useEffect(() => {
    tourRoot && updateTour(tourRoot);
  }, [currentStepIndex])

  // update tooltip and target position in state
  const updateTour = (root: Element) => {
    const tooltip: HTMLElement = document.getElementById(getIdString(baseTooltipContainerString, identifier));
    const target: HTMLElement = document.querySelector(currentStepContent.selector);

    if (!tooltip) {
      setTarget(null);
      setTooltip(null);
      setTooltipPosition(null);
      return;
    }

    // If the tooltip is custom and absolutely positioned/floated, the container will not adopt those dimensions.
    // So we use the first child of the container (the tooltip itself) and fall back to the container if something goes wrong.
    const tangibleTooltip = tooltip.firstElementChild as HTMLElement || tooltip;
    const tooltipPosition: Coords = getTooltipPosition({
      target,
      tooltip: tangibleTooltip,
      padding: maskPadding,
      tooltipSeparation,
      orientationPreferences,
      tourRoot: root,
      positionCandidateReducer
    });
    
    setTarget(target);
    setTooltip(tooltip);
    setTooltipPosition(tooltipPosition);

    if (!disableAutoScroll && (!isElementInView(root, target) || !isElementInView(root, tooltip, tooltipPosition))) {
      scrollToElement(root, target);
    }

    tooltip.focus();
  }


  const goToStep = (stepIndex: number) => {
    if (stepIndex >= steps.length || stepIndex < 0) {
      return;
    }
    setCurrentStepIndex(stepIndex);
  }

  const next = () => {
    goToStep(currentStepIndex + 1);
  }

  const prev = () => {
    goToStep(currentStepIndex - 1);
  }

  const close = () => {
    goToStep(0);
    setVisible(false);
  }

  const baseLogic: WalktourLogic = {
    next: next,
    prev: prev,
    close: close,
    goToStep: goToStep,
    stepContent: currentStepContent,
    stepIndex: currentStepIndex,
    allSteps: steps
  };

  const tourLogic: WalktourLogic = {
    ...baseLogic,
    ...customNextFunc && { next: () => customNextFunc(baseLogic) },
    ...customPrevFunc && { prev: () => customPrevFunc(baseLogic) }
  };

  const keyPressHandler = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "Escape":
        event.preventDefault();
        if (!disableClose) {
          close();
        }
        break;
      case "ArrowRight":
        event.preventDefault();
        if (!disableNext) {
          if (customNextFunc) {
            customNextFunc(baseLogic);
          } else {
            next();
          }
        }
        break;
      case "ArrowLeft":
        event.preventDefault();
        if (!disablePrev) {
          if (customPrevFunc) {
            customPrevFunc(baseLogic);
          } else {
            prev();
          }
        }
        break;
    }
  }

  //don't render if the tour is closed or if there's no step data
  if (!isVisibleState || !currentStepContent) {
    return null
  };

  
  const portalStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: zIndex,
    visibility: tooltipPosition ? 'visible' : 'hidden'
  }

  const tooltipContainerStyle: React.CSSProperties = {
    position: 'absolute',
    top: tooltipPosition && tooltipPosition.y,
    left: tooltipPosition && tooltipPosition.x,
    transition: transition,
    width: tooltipWidth
  }

  // render mask, tooltip, and their shared "portal" container
  const render = () => (
    <div
      id={getIdString(basePortalString, identifier)}
      style={portalStyle}
    >
      <Mask
        target={target}
        disableMaskInteraction={disableMaskInteraction}
        disableCloseOnClick={disableCloseOnClick}
        padding={maskPadding}
        tourRoot={tourRoot}
        close={tourLogic.close}
      />

      <div
        id={getIdString(baseTooltipContainerString, identifier)}
        style={tooltipContainerStyle}
        onKeyDown={keyPressHandler}
        tabIndex={0}>
        {customTooltipRenderer
          ? customTooltipRenderer(tourLogic)
          : <Tooltip
            {...tourLogic}
          />
        }
      </div>
    </div>);

  // on first render, put everything in it's normal context.
  // after first render (once we've determined the tour root) spawn a portal there for rendering.
  if (tourRoot) {
    return ReactDOM.createPortal(render(), tourRoot);
  } else {
    return render();
  }
}


function getIdString(base: string, identifier?: string): string {
  return `${base}${identifier ? `-${identifier}` : ``}`
}