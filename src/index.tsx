import * as React from 'react';
import { defaultStyles } from './defaultstyles';


export interface Step {
  querySelector: string,
  title: string,
  description: string //TODO change to allow custom html content?
  disableMaskInteraction?: boolean;
}

export interface WalktourProps {
  steps: Step[];
  isVisible: boolean;
  initialStepIndex?: number;
  prevLabel?: string;
  nextLabel?: string;
  skipLabel?: string;
  maskPadding?: number;
  disableMaskInteraction?: boolean;
}

interface Position {
  top: number;
  left: number;
}

export const Walktour = (props: WalktourProps) => {
  let {
    isVisible,
    steps,
    initialStepIndex,
    prevLabel,
    nextLabel,
    skipLabel,
    maskPadding,
    disableMaskInteraction }: WalktourProps = {
    initialStepIndex: 0,
    prevLabel: 'prev',
    nextLabel: 'next',
    skipLabel: 'skip',
    ...props
  };

  const [isVisibleState, setVisible] = React.useState<boolean>(isVisible);
  const [position, setPosition] = React.useState<Position>(undefined);
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
    setPosition(getTooltipPosition(data));
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
    console.log('keyevent fired')
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

  const styles = defaultStyles;
  const wrapperStyle = {
    ...styles.wrapper,
    ...position,
  };

  if (!isVisibleState || !position) {
    return null
  };


  return (<>
    {TourMask(targetData, (disableMaskInteraction || currentStepContent.disableMaskInteraction), maskPadding)}
    <div style={wrapperStyle}>
      <div id="walktour-tooltip-container" style={styles.container} onKeyDown={keyPressHandler} tabIndex={-1}>

        <div style={styles.title}>
          {currentStepContent.title}
        </div>

        <div style={styles.description}>
          {currentStepContent.description}
        </div>

        <div style={styles.footer}>
          <button onClick={skip} 
          style={{ ...styles.button, backgroundColor: 'gray' }} 
          >
            {skipLabel}
          </button>

          {currentStepIndex !== 0 && (
            <button
              onClick={prev}
              style={styles.button}
            >
              {prevLabel}
            </button>
          )}

          {currentStepIndex + 1 !== steps.length && (
            <button
              onClick={next}
              // disabled={currentStepIndex + 1 === steps.length}
              style={styles.button}
            >
              {nextLabel}
            </button>
          )}

        </div>

      </div>
      <div style={styles.pin} />
      <div style={styles.pinLine} />
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

//at the moment, the tooltip is always positioned to the right, halfway down the height of the target element
function getTooltipPosition(target: ClientRect): Position {
  if (target) {
    const pos: Position = getElementPosition(target);
    return {
      top: pos.top + target.height / 2,
      left: pos.left + target.width
    }
  }
}

function getElementPosition(element: ClientRect, adjustForScroll: boolean = true): Position {
  if (!adjustForScroll) {
    return {
      top: element.top, 
      left: element.left
     }
  }

  return {
    top: element.top + (document.documentElement.scrollTop || window.pageYOffset),
    left: element.left + (document.documentElement.scrollLeft || window.pageXOffset)
  }
}

function TourMask(target: ClientRect, disableMaskInteraction: boolean, padding: number = 5, roundedCutout: boolean = true ): JSX.Element {
  const pos: Position = getElementPosition(target);
  return (
    <div
      style={{
        position: 'absolute',
        top: pos.top - padding,
        left: pos.left - padding,
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


