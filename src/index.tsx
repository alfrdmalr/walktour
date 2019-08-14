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
  buttonStyles?: {
    primary?: React.CSSProperties;
    secondary?: React.CSSProperties;
    tertiary?: React.CSSProperties;
    disabled?: React.CSSProperties;
  }
}

interface Position {
  top: number;
  left: number;
  bottom?: number;
  right?: number;
}

export const Walktour = (props: WalktourProps) => {
  const styles = defaultStyles;

  let {
    isVisible,
    steps,
    defaultStepIndex,
    prevLabel,
    nextLabel,
    skipLabel,
    buttonStyles }: WalktourProps = { //pseudo-default props
    defaultStepIndex: 0,
    prevLabel: 'prev',
    nextLabel: 'next',
    skipLabel: 'skip',
    buttonStyles: {
      primary: styles.primaryButton,
      secondary: styles.secondaryButton,
      tertiary: styles.tertiaryButton,
      disabled: styles.disabledButton
    },
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
          <button onClick={() => setVisible(false)} style={buttonStyles.tertiary}>
            {skipLabel}
          </button>
          <button
            onClick={() => onStepButtonClick(currentStepIndex - 1)}
            disabled={currentStepIndex === 0}
            style={currentStepIndex !== 0 ? buttonStyles.secondary : buttonStyles.disabled}
          >
            {prevLabel}
          </button>
          <button
            onClick={() => onStepButtonClick(currentStepIndex + 1)}
            disabled={currentStepIndex + 1 === steps.length}
            style={currentStepIndex + 1 !== steps.length ? buttonStyles.primary : buttonStyles.disabled}
          >
            {nextLabel}
          </button>
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
