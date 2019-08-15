import * as React from 'react';
import { defaultStyles } from './defaultstyles';


export interface Step {
  querySelector: string,
  title: string,
  description: string //TODO change to allow custom html content?
}

export interface WalktourProps {
  steps: Step[];
  isVisible: boolean;
  defaultStepIndex?: number;
  prevLabel?: string;
  nextLabel?: string;
  skipLabel?: string;
}

interface Position {
  top: number;
  left: number;
  bottom?: number;
  right?: number;
}

export const Walktour = (props: WalktourProps) => {
  let {
    isVisible,
    steps,
    defaultStepIndex,
    prevLabel,
    nextLabel,
    skipLabel }: WalktourProps = {
    defaultStepIndex: 0,
    prevLabel: 'prev',
    nextLabel: 'next',
    skipLabel: 'skip',
    ...props
  };

  const [isVisibleState, setVisible] = React.useState<boolean>(isVisible);
  const [position, setPosition] = React.useState<Position>(undefined);
  const [currentStepIndex, setCurrentStepIndex] = React.useState<number>(defaultStepIndex);

  const currentStepContent = getStep(currentStepIndex, steps);

  React.useEffect(() => {
    setPosition(getCoords(getStep(currentStepIndex, steps).querySelector))
  }, []);

  React.useEffect(() => {
    const container: HTMLElement = document.getElementById('walktour-keyboard-nav');
    container && isVisibleState && container.focus();
  })

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= steps.length || stepIndex < 0) {
      return;
    }
    setCurrentStepIndex(stepIndex);
    setPosition(getCoords(getStep(stepIndex, steps).querySelector));
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
      case "Enter":
      case " ":
      case "ArrowRight":
        next();
        event.preventDefault();
        break;
      case "ArrowLeft":
        prev();
        event.preventDefault();
        break;
      case "Backspace":
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
  const navStyle = {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    pointerEvents: 'none'
  };

  if (!isVisibleState || !position) {
    return null
  };

  return (
    <div style={wrapperStyle}>
      <div style={styles.container}>
        <div id="walktour-keyboard-nav" tabIndex={0} style={navStyle} onKeyDown={keyPressHandler}>
          {/*at the moment this div exists to grab focus during the tour and handle the keyboard navigation logic
          it's its own div and not the container so that keyboard events on the rest of the content (individual buttons, custom html, etc) 
          doesn't bubble up
          */}
        </div>
        <div style={styles.title}>
          {currentStepContent.title}
        </div>

        <div style={styles.description}>
          {currentStepContent.description}
        </div>

        <div style={styles.footer}>
          <button onClick={skip} style={{ ...styles.button, backgroundColor: 'gray' }}>
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
  )
}

function getStep(stepIndex: number, steps: Step[]) {
  return steps[stepIndex]
}

function getCoords(selector: string): Position {
  const element = document.querySelector(selector)
  const coordinates = element && element.getBoundingClientRect()

  if (coordinates) {
    return {
      top: coordinates.top + coordinates.height / 2,
      left: coordinates.left + coordinates.width,
    }
  } else {
    console.log(`element specified by  "${selector}" could not be found`)
    return null;
  }
}
