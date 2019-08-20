import * as React from 'react';
import { defaultStyles } from './defaultstyles';

export interface Step {
  querySelector: string,
  title: string,
  description: string //TODO change to allow custom html content?
  disableMaskInteraction?: boolean;
}

interface TooltipPositionCandidates {
  east: Coords;
  south: Coords;
  west: Coords;
  north: Coords;
  center: Coords;
}

interface Coords {
  x: number;
  y: number;
}

export interface WalktourProps {
  steps: Step[];
  isVisible: boolean;
  initialStepIndex?: number;
  prevLabel?: string;
  nextLabel?: string;
  skipLabel?: string;
  buttonStyles?: {
    primary?: React.CSSProperties;
    secondary?: React.CSSProperties;
    tertiary?: React.CSSProperties;
    disabled?: React.CSSProperties;
  }
  maskPadding?: number;
  disableMaskInteraction?: boolean;
}

const styles = defaultStyles;

export const Walktour = (props: WalktourProps) => {

  let {
    isVisible,
    steps,
    initialStepIndex,
    prevLabel,
    nextLabel,
    skipLabel,
    buttonStyles,
    maskPadding,
    disableMaskInteraction }: WalktourProps = {
    initialStepIndex: 0,
    prevLabel: 'prev',
    nextLabel: 'next',
    skipLabel: 'skip',
    buttonStyles: {
      primary: styles.primaryButton,
      secondary: styles.secondaryButton,
      tertiary: styles.tertiaryButton,
      disabled: styles.disabledButton
    },
    maskPadding: 5,
    ...props
  };

  const [isVisibleState, setVisible] = React.useState<boolean>(isVisible);
  const [tooltipPosition, setTooltipPosition] = React.useState<Coords>(undefined);
  const [targetData, setTargetData] = React.useState<ClientRect>(undefined);
  const [currentStepIndex, setCurrentStepIndex] = React.useState<number>(initialStepIndex);
  const currentStepContent = getStep(currentStepIndex, steps);


  React.useEffect(() => {
    goToStep(currentStepIndex)
  }, []);

  React.useEffect(() => {
    const container: HTMLElement = document.getElementById('walktour-tooltip-container');
    container && isVisibleState && container.focus();
  })

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= steps.length || stepIndex < 0) {
      return;
    }
    const data = getTargetData(getStep(stepIndex, steps).querySelector);
    setTargetData(data);
    setTooltipPosition(getTooltipPosition(data, maskPadding, 10));
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
  };


  if (!isVisibleState || !tooltipPosition) {
    return null
  };

  return (<>
    {TourMask(targetData, (disableMaskInteraction || currentStepContent.disableMaskInteraction), maskPadding)}
    <div style={wrapperStyle}>
      <div id="walktour-tooltip-container" style={styles.container} onKeyDown={keyPressHandler} tabIndex={0}>

        <div style={styles.title}>
          {currentStepContent.title}
        </div>

        <div style={styles.description}>
          {currentStepContent.description}
        </div>

        <div style={styles.footer}>
          <button onClick={skip} style={buttonStyles.tertiary}>
            {skipLabel}
          </button>
          <button
            onClick={prev}
            disabled={currentStepIndex === 0}
            style={currentStepIndex !== 0 ? buttonStyles.secondary : buttonStyles.disabled}
          >
            {prevLabel}
          </button>
          <button
            onClick={next}
            disabled={currentStepIndex + 1 === steps.length}
            style={currentStepIndex + 1 !== steps.length ? buttonStyles.primary : buttonStyles.disabled}
          >
            {nextLabel}
          </button>
        </div>

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

function getElementCoords(element: ClientRect, adjustForScroll: boolean = true): Coords {
  if (!adjustForScroll) {
    return {
      x: element.left,
      y: element.top
    }
  }

  return {
    x: element.left + (document.documentElement.scrollLeft || window.pageXOffset),
    y: element.top + (document.documentElement.scrollTop || window.pageYOffset)
  }
}

function getCenterPosition(): Coords {
  return {
    x: Math.max(document.documentElement.clientWidth, window.innerWidth),
    y: Math.max(document.documentElement.clientHeight, window.innerWidth)
  }
}

function getTooltipPosition(target: ClientRect, padding: number = 0, buffer: number = 0): Coords {
  if (target) {
    return (getBestTooltipPosition(getTooltipPositionCandidates(target, padding, buffer)));
  } else {
    return getCenterPosition();
  }
}

function getTooltipPositionCandidates(target: ClientRect, padding: number, buffer: number): TooltipPositionCandidates {
  const coords: Coords = getElementCoords(target);

  const east: Coords = {
    x: coords.x + target.width + padding + buffer,
    y: coords.y - padding
  }

  const south: Coords = {
    x: coords.x - padding,
    y: coords.y + target.height + padding + buffer
  }

  const west: Coords = {
    x: coords.x - padding - buffer, //need to subtract tooltip width
    y: coords.y - padding
  };

  const north: Coords = {
    x: coords.x - padding,
    y: coords.y + padding + buffer //need to add tooltip height
  };
  const center: Coords = getCenterPosition();

  return {
    east,
    south,
    west,
    north,
    center
  }
}

function getBestTooltipPosition(candidates: TooltipPositionCandidates): Coords {
  //temporarily return east to mimick older behavior
  return candidates.east;
}

function TourMask(target: ClientRect, disableMaskInteraction: boolean, padding: number = 0, roundedCutout: boolean = true): JSX.Element {
  if (!target) {
    return null;
  }
  const coords: Coords = getElementCoords(target);
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


