import * as React from 'react';
import { defaultStyles, WalktourStyles } from './defaultstyles';
import { Coords, getElementCoords, getTooltipPosition, CardinalOrientation } from './positioning'
import { Mask } from './Mask';
import { Tooltip } from './Tooltip';

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
  title: string;
  description: string;
  customTitleRenderer?: (title?: string, tourLogic?: WalktourLogic) => JSX.Element;
  customDescriptionRenderer?: (description: string, tourLogic?: WalktourLogic) => JSX.Element;
  customFooterRenderer?: (tourLogic?: WalktourLogic) => JSX.Element;
}

export interface WalktourProps extends WalktourOptions {
  steps: Step[];
  isVisible: boolean;
  initialStepIndex?: number;
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
  disableMaskInteraction: false
}

export const Walktour = (props: WalktourProps) => {

  const {
    isVisible,
    steps,
    initialStepIndex
  } = props;

  const [isVisibleState, setVisible] = React.useState<boolean>(isVisible);
  const [tooltipPosition, setTooltipPosition] = React.useState<Coords>(undefined);
  const [targetData, setTargetData] = React.useState<ClientRect>(undefined);
  const [currentStepIndex, setCurrentStepIndex] = React.useState<number>(initialStepIndex || 0);
  const currentStepContent = getStep(currentStepIndex, steps);

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
    customTitleRenderer,
    customDescriptionRenderer,
    customFooterRenderer,
  } = {
    ...walktourDefaultProps,
    ...props,
    ...currentStepContent
  };

  React.useEffect(() => {
    goToStep(currentStepIndex)
  }, []);

  React.useEffect(() => {
    if (isVisibleState === false) {
      return;
    }
    const tooltip: HTMLElement = document.getElementById('walktour-tooltip-container');
    const tooltipData: ClientRect = tooltip && tooltip.getBoundingClientRect();
    const targetData = getTargetData(getStep(currentStepIndex, steps).querySelector);

    setTargetData(targetData);
    setTooltipPosition(getTooltipPosition({
      target: targetData,
      tooltip: tooltipData,
      padding: maskPadding,
      tooltipSeparation: tooltipSeparation,
      orientationPreferences: orientationPreferences
    }));

    tooltip && tooltip.focus();

  }, [currentStepIndex])

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

  if (!isVisibleState) {
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
    visibility: tooltipPosition ? 'visible' : 'hidden'
  }

  return (<>
    <Mask
      target={targetData}
      disableMaskInteraction={disableMaskInteraction}
      padding={maskPadding}
    />

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
  </>)
}

function getStep(stepIndex: number, steps: Step[]) {
  return steps[stepIndex]
}

function getTargetData(selector: string): ClientRect {
  const element = document.querySelector(selector)
  const targetData = element && element.getBoundingClientRect();

  if (targetData) {
    return targetData
  } else {
    throw new Error(`element specified by  "${selector}" could not be found`);
  }
}