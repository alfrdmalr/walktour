import * as React from 'react';
import { defaultStyles } from './defaultstyles';


interface Step {
  elementId: string,
  title: string,
  description: string //TODO change to allow custom html content?
}

interface WalktourProps {
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
    setPosition(getCoords(getStep(currentStepIndex, steps).elementId))
  }, []);

  const onStepButtonClick = (stepIndex: number) => {
    setCurrentStepIndex(stepIndex)
    setPosition(getCoords(getStep(stepIndex, steps).elementId))
  };

 

  const styles = defaultStyles;
  const wrapperStyle = {
    ...styles.wrapper,
    ...position,
  };
  
  if (!isVisibleState || !position) {
    return null
  };

  return (
    <div style={wrapperStyle}>
      <div style={styles.container}>

        <div style={styles.title}>
          {currentStepContent.title}
        </div>

        <div style={styles.description}>
          {currentStepContent.description}
        </div>

        <div style={styles.footer}>
          <button onClick={() => setVisible(false)} style={{ ...styles.button, backgroundColor: 'gray' }}>
            {skipLabel}
          </button>
          {currentStepIndex !== 0 && (
            <button
              onClick={() => onStepButtonClick(currentStepIndex - 1)}
              style={styles.button}
            >
              {prevLabel}
            </button>
          )}
          {currentStepIndex + 1 !== steps.length && (
            <button
              onClick={() => onStepButtonClick(currentStepIndex + 1)}
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

function getCoords(elementId: string): Position {
  const element = document.getElementById(elementId)
  const coordinates = element && element.getBoundingClientRect()

  if (coordinates) {
    return {
      top: coordinates.top + coordinates.height / 2,
      left: coordinates.left + coordinates.width,
    }
  } else {
    console.log(`element ${elementId} could not be found`)
    return null;
  }
}
