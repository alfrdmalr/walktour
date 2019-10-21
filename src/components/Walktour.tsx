import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Mask } from './Mask';
import { Tooltip } from './Tooltip';
import { CardinalOrientation, OrientationCoords, getTargetPosition, getTooltipPosition } from '../utils/positioning';
import { Coords, getNearestScrollAncestor, dist, getValidPortalRoot, Dims, getElementDims } from '../utils/dom';
import { scrollToDestination } from '../utils/scroll';
import { centerViewportAroundElements } from '../utils/offset';
import { isElementInView } from '../utils/viewport';
import { debounce, getIdString, clearWatcher, shouldUpdate, removeListener, refreshListeners } from '../utils/tour';


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
  transition?: string;
  customTitleRenderer?: (title?: string, tourLogic?: WalktourLogic) => JSX.Element;
  customDescriptionRenderer?: (description: string, tourLogic?: WalktourLogic) => JSX.Element;
  customFooterRenderer?: (tourLogic?: WalktourLogic) => JSX.Element;
  customTooltipRenderer?: (tourLogic?: WalktourLogic) => JSX.Element;
  customNextFunc?: (tourLogic: WalktourLogic) => void;
  customPrevFunc?: (tourLogic: WalktourLogic) => void;
  customCloseFunc?: (tourLogic: WalktourLogic) => void;
  prevLabel?: string;
  nextLabel?: string;
  closeLabel?: string;
  disableNext?: boolean;
  disablePrev?: boolean;
  disableClose?: boolean;
  disableAutoScroll?: boolean;
  getPositionFromCandidates?: (candidates: OrientationCoords[]) => Coords;
  movingTarget?: boolean;
  updateInterval?: number;
  renderTolerance?: number;
  disableMask?: boolean;
  disableSmoothScrolling?: boolean;
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
  setUpdateListener?: (update: () => void) => void;
  removeUpdateListener?: (update: () => void) => void;
  disableListeners?: boolean;
}

const walktourDefaultProps: Partial<WalktourProps> = {
  maskPadding: 5,
  tooltipSeparation: 10,
  transition: 'top 300ms ease, left 300ms ease',
  disableMaskInteraction: false,
  disableCloseOnClick: false,
  zIndex: 9999,
  renderTolerance: 2,
  updateInterval: 500
}

const basePortalString: string = 'walktour-portal';
const baseMaskString: string = 'walktour-mask';
const baseTooltipContainerString: string = 'walktour-tooltip-container';

export const Walktour = (props: WalktourProps) => {

  const {
    steps,
    initialStepIndex
  } = props;

  const [isVisible, setVisible] = React.useState<boolean>(true);
  const [target, setTarget] = React.useState<HTMLElement>(undefined);
  const [tooltipPosition, setTooltipPosition] = React.useState<Coords>(undefined);
  const [currentStepIndex, setCurrentStepIndex] = React.useState<number>(initialStepIndex || 0);

  const tourRoot = React.useRef<Element>(undefined);
  const targetPosition = React.useRef<Coords>(undefined);
  const targetSize = React.useRef<Dims>(undefined);
  const watcherId = React.useRef<number>(undefined);
  // we use this ref to store a particular (debounced) version of the updateTour function, so that 
  // we can remove it using removeEventListener even when called from a different step 
  const updateRef = React.useRef<() => void>(undefined);

  const currentStepContent: Step = steps[currentStepIndex];

  const options: WalktourOptions & WalktourProps & Step = {
    ...walktourDefaultProps,
    ...props,
    ...currentStepContent
  }

  const {
    maskPadding,
    disableMaskInteraction,
    disableCloseOnClick,
    tooltipSeparation,
    transition,
    orientationPreferences,
    customTooltipRenderer,
    zIndex,
    rootSelector,
    customNextFunc,
    customPrevFunc,
    customCloseFunc,
    disableClose,
    disableNext,
    disablePrev,
    disableAutoScroll,
    identifier,
    getPositionFromCandidates,
    movingTarget,
    renderTolerance,
    updateInterval,
    disableMask,
    setUpdateListener,
    removeUpdateListener,
    disableListeners,
    disableSmoothScrolling,
  } = {
    ...walktourDefaultProps,
    ...props,
    ...currentStepContent
  };

  React.useEffect(() => {
    return cleanup;
  }, []);

  // set/reset the tour root 
  React.useEffect(() => {
    let root: Element;
    if (rootSelector) {
      root = document.querySelector(rootSelector);
    }
    if (!root) {
      root = getNearestScrollAncestor(document.getElementById(getIdString(basePortalString, identifier)));
    }

    tourRoot.current = root;
  }, [rootSelector, identifier])


  // update tour when step changes
  React.useEffect(() => {
    updateTour();
  }, [currentStepIndex, currentStepContent])

  // update tooltip and target position in state
  const updateTour = () => {
    const root: Element = tourRoot.current;
    const tooltipContainer: HTMLElement = document.getElementById(getIdString(baseTooltipContainerString, identifier));

    clearWatcher(watcherId);

    if (!root || !tooltipContainer) {
      setTarget(null);
      setTooltipPosition(null);
      targetPosition.current = null;
      targetSize.current = null;
      return;
    }

    const getTarget = (): HTMLElement => document.querySelector(currentStepContent.selector);
    const target: HTMLElement = getTarget();
    const currentTargetPosition: Coords = getTargetPosition(root, target);
    const currentTargetDims: Dims = getElementDims(target);
    const tooltipPosition: Coords = getTooltipPosition({
      target,
      tooltip: tooltipContainer,
      padding: maskPadding,
      tooltipSeparation,
      orientationPreferences,
      tourRoot: root,
      getPositionFromCandidates,
      scrollDisabled: disableAutoScroll
    });

    setTarget(target);
    setTooltipPosition(tooltipPosition);
    targetPosition.current = currentTargetPosition;
    targetSize.current = currentTargetDims;

    tooltipContainer.focus();

    // if scroll is not disabled, scroll to target if it's out of view or if the tooltip would be placed out of the viewport
    if (!disableAutoScroll && target && (!isElementInView(root, target) || !isElementInView(root, tooltipContainer, tooltipPosition))) {
      scrollToDestination(root, centerViewportAroundElements(root, tooltipContainer, target, tooltipPosition, currentTargetPosition), disableSmoothScrolling)
    }

    const debouncedUpdate = debounce(() => {
      const currentTarget = getTarget();
      if (shouldUpdate(root, tooltipContainer, currentTarget, targetPosition.current, targetSize.current, renderTolerance)) {
        updateTour();
      }
    })

    // if the user requests a watcher and there's supposed to be a target
    if (movingTarget && (target || currentStepContent.selector)) {
      watcherId.current = window.setInterval(debouncedUpdate, updateInterval)
    }

    !disableListeners && refreshListeners(debouncedUpdate, updateRef, setUpdateListener, removeUpdateListener);
  }

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= steps.length || stepIndex < 0) {
      return;
    }
    setCurrentStepIndex(stepIndex);
  }

  const cleanup = () => {
    goToStep(0);
    setVisible(false);
    clearWatcher(watcherId);
    removeListener(updateRef.current, removeUpdateListener);
  }

  const baseLogic: WalktourLogic = {
    next: () => goToStep(currentStepIndex + 1),
    prev: () => goToStep(currentStepIndex - 1),
    close: () => cleanup(),
    goToStep: goToStep,
    stepContent: { ...options }, //pass options in as well to expose any defaults that aren't specified
    stepIndex: currentStepIndex,
    allSteps: steps
  };

  const tourLogic: WalktourLogic = {
    ...baseLogic,
    ...customNextFunc && { next: () => customNextFunc(baseLogic) },
    ...customPrevFunc && { prev: () => customPrevFunc(baseLogic) },
    ...customCloseFunc && { close: () => customCloseFunc(baseLogic) }
  };

  const keyPressHandler = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "Escape":
        event.preventDefault();
        if (!disableClose) {
          tourLogic.close();
        }
        break;
      case "ArrowRight":
        event.preventDefault();
        if (!disableNext) {
          tourLogic.next()
        }
        break;
      case "ArrowLeft":
        event.preventDefault();
        if (!disablePrev) {
          tourLogic.prev();
        }
        break;
    }
  }

  //don't render if the tour is hidden or if there's no step data
  if (!isVisible || !currentStepContent) {
    return null;
  };

  const portalStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: zIndex,
    visibility: tooltipPosition ? 'visible' : 'hidden',
    pointerEvents: "none"
  }

  const tooltipContainerStyle: React.CSSProperties = {
    position: 'absolute',
    top: tooltipPosition && tooltipPosition.y,
    left: tooltipPosition && tooltipPosition.x,
    transition: transition,
    pointerEvents: 'auto'
  }

  // render mask, tooltip, and their shared "portal" container
  const render = () => (
    <div
      id={getIdString(basePortalString, identifier)}
      style={portalStyle}
    >
      {tourRoot.current &&
        <Mask
          maskId={getIdString(baseMaskString, identifier)}
          target={target}
          disableMaskInteraction={disableMaskInteraction}
          disableCloseOnClick={disableCloseOnClick}
          disableMask={disableMask}
          padding={maskPadding}
          tourRoot={tourRoot.current}
          close={tourLogic.close}
        />}

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

  // on first render, put everything in its normal context.
  // after first render (once we've determined the tour root) spawn a portal there for rendering.
  if (tourRoot.current) {
    return ReactDOM.createPortal(render(), getValidPortalRoot(tourRoot.current));
  } else {
    return render();
  }
}

