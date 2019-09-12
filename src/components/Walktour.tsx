import * as React from 'react';
import { defaultStyles, WalktourStyles } from '../defaultstyles';
import { Coords, getTooltipPosition, CardinalOrientation } from '../positioning'
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
  orientationPreferences?: CardinalOrientation[];
  maskPadding?: number;
  tooltipSeparation?: number;
  tooltipWidth?: number;
  transition?: string;
  customTooltipRenderer?: (tourLogic?: WalktourLogic) => JSX.Element;
  prevLabel?: string;
  nextLabel?: string;
  skipLabel?: string;
  styles?: WalktourStyles;
}

export interface Step extends WalktourOptions {
  querySelector: string;
  title?: string;
  description: string;
  customTitleRenderer?: (title?: string, tourLogic?: WalktourLogic) => JSX.Element;
  customDescriptionRenderer?: (description: string, tourLogic?: WalktourLogic) => JSX.Element;
  customFooterRenderer?: (tourLogic?: WalktourLogic) => JSX.Element;
}

export interface WalktourProps extends WalktourOptions {
  steps: Step[];
  isVisible: boolean;
  initialStepIndex?: number;
  zIndex?: number;
}

const walktourDefaultProps: Partial<WalktourProps> = {
  prevLabel: 'prev',
  nextLabel: 'next',
  skipLabel: 'skip',
  styles: defaultStyles,
  tooltipWidth: 250,
  maskPadding: 5,
  tooltipSeparation: 10,
  transition: 'top 200ms ease, left 200ms ease',
  disableMaskInteraction: false,
  zIndex: 9999
}

export const Walktour = (props: WalktourProps) => {

  const {
    isVisible,
    steps,
    initialStepIndex
  } = props;

  const [isVisibleState, setVisible] = React.useState<boolean>(isVisible);
  const [tooltipPosition, setTooltipPosition] = React.useState<Coords>(undefined);
  const [target, setTarget] = React.useState<HTMLElement>(undefined);
  const [tourRoot, setTourRoot] = React.useState<Element>(document.body)
  const [currentStepIndex, setCurrentStepIndex] = React.useState<number>(initialStepIndex || 0);
  const currentStepContent: Step = steps[currentStepIndex];

  const {
    prevLabel,
    nextLabel,
    skipLabel,
    styles,
    maskPadding,
    disableMaskInteraction,
    tooltipSeparation,
    tooltipWidth,
    transition,
    orientationPreferences,
    customTooltipRenderer,
    zIndex
  } = {
    ...walktourDefaultProps,
    ...props,
    ...currentStepContent
  };

  React.useEffect(() => {
    goToStep(currentStepIndex)

    //TODO from props
    //zowe flag? ref?
    const tourRoot: Element = document.getElementById('demo-container');
    // tourRoot && setTourRoot(tourRoot);
  }, []);

  React.useEffect(() => {
    if (isVisibleState === false) {
      return;
    }

    const target: HTMLElement = document.querySelector(steps[currentStepIndex].querySelector);
    const tooltip: HTMLElement = document.getElementById('walktour-tooltip-container');

    setTarget(target);
    setTooltipPosition(
      getTooltipPosition({
        target,
        tooltip: tooltip.firstElementChild as HTMLElement || tooltip,
        padding: maskPadding,
        tooltipSeparation,
        orientationPreferences,
        rootElement: tourRoot
      })
    );

    tooltip && tooltip.focus();
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

  const skip = () => {
    goToStep(0);
    setVisible(false);
  }

  const keyPressHandler = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "Escape":
        skip();
        event.preventDefault();
        break;
      case "ArrowRight":
        next();
        event.preventDefault();
        break;
      case "ArrowLeft":
        prev();
        event.preventDefault();
        break;
    }
  }

  if (!isVisibleState || !currentStepContent) {
    return null
  };

  const tourLogic: WalktourLogic = {
    next: next,
    prev: prev,
    close: skip,
    goToStep: goToStep,
    stepContent: currentStepContent,
    stepIndex: currentStepIndex,
    allSteps: steps
  };

  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    top: tooltipPosition && tooltipPosition.y,
    left: tooltipPosition && tooltipPosition.x,
    transition: transition,
    visibility: tooltipPosition ? 'visible' : 'hidden',
    zIndex: zIndex
  }

  return ReactDOM.createPortal(<div id="walktour-portal" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
    {/* <Mask
      target={target}
      disableMaskInteraction={disableMaskInteraction}
      padding={maskPadding}
      offsetParent={tourRoot}
      zIndex={zIndex}
    /> */}

    <div id="walktour-tooltip-container" style={containerStyle} onKeyDown={keyPressHandler} tabIndex={0}>
      {customTooltipRenderer
        ? customTooltipRenderer(tourLogic)
        : <Tooltip
          {...tourLogic}
          nextLabel={nextLabel}
          prevLabel={prevLabel}
          skipLabel={skipLabel}
          styles={styles}
          width={tooltipWidth}
        />
      }
    </div>
  </div>, tourRoot)
}