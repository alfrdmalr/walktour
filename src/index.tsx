import * as React from 'react';
import { defaultStyles, DefaultStyles } from './defaultstyles';
import { Coords, getElementCoords, getTooltipPosition, CardinalOrientation } from './positioning'


export interface WalktourLogic {
  next: () => void;
  prev: () => void;
  close: () => void;
  goToStep: (stepNumber: number) => void;
  stepContent: Step;
}

export interface WalktourOptions {
  disableMaskInteraction?: boolean;
  orientationPreferences?: CardinalOrientation[];
  maskPadding?: number;
  tooltipSeparation?: number;
  customTooltipRender?: (tourLogic?: WalktourLogic) => JSX.Element;

  //temp?
  prevLabel?: string;
  nextLabel?: string;
  skipLabel?: string;
  defaultStyles?: DefaultStyles;
}

export interface Step extends WalktourOptions {
  querySelector: string;
  title: string;
  description: string;
  customTitleRender?: (title?: string, tourLogic?: WalktourLogic) => JSX.Element;
  customDescriptionRender?: (description: string, tourLogic?: WalktourLogic) => JSX.Element;
  customFooterRender?: (tourLogic?: WalktourLogic) => JSX.Element;
}

export interface WalktourProps extends WalktourOptions {
  steps: Step[];
  isVisible: boolean;
  initialStepIndex?: number;
}

const styles: DefaultStyles = defaultStyles;

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
    defaultStyles,
    maskPadding,
    disableMaskInteraction,
    tooltipSeparation,
    orientationPreferences,
    customTooltipRender,
    customTitleRender, 
    customDescriptionRender,
    customFooterRender,
  } = {
    prevLabel: 'prev',
    nextLabel: 'next',
    skipLabel: 'skip',
    defaultStyles: styles,
    maskPadding: 5,
    tooltipSeparation: 10,
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
    const tooltip: HTMLElement = document.getElementById('walktour-tooltip');
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

  const wrapperStyle = {
    ...styles.wrapper,
    top: tooltipPosition && tooltipPosition.y,
    left: tooltipPosition && tooltipPosition.x,
    visibility: (!tooltipPosition) ? 'hidden' : 'visible'
  };


  if (!isVisibleState) {
    return null
  };

  const tourLogic: WalktourLogic = {
    next: next,
    prev: prev,
    close: skip,
    goToStep: goToStep,
    stepContent: currentStepContent
  };

  return (<>
    {TourMask(targetData, disableMaskInteraction, maskPadding)}
    <div style={wrapperStyle}>
      <div id="walktour-tooltip" style={customTooltipRender ? null : styles.container} onKeyDown={keyPressHandler} tabIndex={0}>
        {customTooltipRender && customTooltipRender(tourLogic)}
        {!customTooltipRender &&
          <>
            {customTitleRender
              ? customTitleRender(currentStepContent.title, tourLogic)
              : (
                <div style={styles.title}>
                  {currentStepContent.title}
                </div>
              )
            }

            {customDescriptionRender
              ? customDescriptionRender(currentStepContent.description, tourLogic)
              : (
                <div style={styles.description}>
                  {currentStepContent.description}
                </div>
              )
            }

            {customFooterRender
              ? currentStepContent.customFooterRender(tourLogic)
              : (
                <div style={styles.footer}>
                  <button onClick={skip} style={styles.tertiaryButton}>
                    {skipLabel}
                  </button>
                  <button
                    onClick={prev}
                    disabled={currentStepIndex === 0}
                    style={currentStepIndex !== 0 ? styles.secondaryButton : styles.disabledButton}
                  >
                    {prevLabel}
                  </button>
                  <button
                    onClick={next}
                    disabled={currentStepIndex + 1 === steps.length}
                    style={currentStepIndex + 1 !== steps.length ? styles.primaryButton : styles.disabledButton}
                  >
                    {nextLabel}
                  </button>
                </div>
              )}
          </>
        }
      </div>
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

function TourMask(target: ClientRect, disableMaskInteraction: boolean, padding: number = 0, roundedCutout: boolean = true): JSX.Element {
  if (!target) {
    return null;
  }
  const coords: Coords = getElementCoords(target, true);
  return (
    <div
      style={{
        position: 'absolute',
        top: coords.y - padding,
        left: coords.x - padding,
        height: target.height + (padding * 2),
        width: target.width + (padding * 2),
        boxShadow: '0 0 0 9999px rgb(0,0,0,0.6)',
        borderRadius: roundedCutout ? '5px' : 0,
        pointerEvents: disableMaskInteraction ? 'auto' : 'none'
      }}
    >
    </div>
  );
}


