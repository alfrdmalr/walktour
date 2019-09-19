import * as React from 'react';
import { Coords, getTooltipPosition, CardinalOrientation, getNearestScrollAncestor } from '../positioning'
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
  const [tourRoot, setTourRoot] = React.useState<Element>(undefined)
  const [currentStepIndex, setCurrentStepIndex] = React.useState<number>(initialStepIndex || 0);
  const currentStepContent: Step = steps[currentStepIndex];

  const {
    prevLabel,
    nextLabel,
    closeLabel,
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
    disablePrev
  } = {
    ...walktourDefaultProps,
    ...props,
    ...currentStepContent
  };

  React.useEffect(() => {
    goToStep(currentStepIndex);

    let root: Element;
    if (rootSelector) {
      root = document.querySelector(rootSelector);
    }

    if (!root) {
      root = getNearestScrollAncestor(document.getElementById(basePortalString));
    }

    setTourRoot(root);
  }, []);

  React.useEffect(() => {
    if (isVisibleState === false) {
      return;
    }

    const target: HTMLElement = document.querySelector(steps[currentStepIndex].selector);
    const tooltipContainer: HTMLElement = document.getElementById(baseTooltipContainerString);

    setTarget(target);

    if (!tooltipContainer) {
      return;
    }

    setTooltip(tooltipContainer.firstElementChild as HTMLElement || tooltip);
    tooltipContainer.focus();
  }, [currentStepIndex, tourRoot])

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

  if (!isVisibleState || !currentStepContent) {
    return null
  };

  const tourLogic: WalktourLogic = {
    ...baseLogic,
    ...customNextFunc && { next: () => customNextFunc(baseLogic) },
    ...customPrevFunc && { prev: () => customPrevFunc(baseLogic) }
  };

  const tooltipPosition: Coords = getTooltipPosition({
    target,
    tooltip,
    padding: maskPadding,
    tooltipSeparation,
    orientationPreferences,
    tourRoot
  });

  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    top: tooltipPosition && tooltipPosition.y,
    left: tooltipPosition && tooltipPosition.x,
    transition: transition,
    visibility: tooltipPosition ? 'visible' : 'hidden',
    width: tooltipWidth
  }

  const render = () => (<div id={`${basePortalString}`} style={{ position: 'absolute', top: 0, left: 0, zIndex: zIndex }}>
    <Mask
      target={target}
      disableMaskInteraction={disableMaskInteraction}
      disableCloseOnClick={disableCloseOnClick}
      padding={maskPadding}
      tourRoot={tourRoot}
      close={tourLogic.close}
    />

    <div id={`${baseTooltipContainerString}`} style={containerStyle} onKeyDown={keyPressHandler} tabIndex={0}>
      {customTooltipRenderer
        ? customTooltipRenderer(tourLogic)
        : <Tooltip
          {...tourLogic}
        />
      }
    </div>
  </div>);

  if (tourRoot) {
    return ReactDOM.createPortal(render(), tourRoot);
  } else {
    return render();
  }
}