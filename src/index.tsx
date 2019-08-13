import * as React from 'react';
import { useState, useEffect } from 'react';
import { defaultStyles } from './defaultstyles';


interface Step {
  elementId: string,
  title: string,
  description: string //TODO change to allow custom html content?
}

interface WalktourProps {
  steps: Step[];
  isVisible: boolean;
  defaultStepNumber?: number;
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
    defaultStepNumber,
    prevLabel,
    nextLabel,
    skipLabel }: WalktourProps = {
    defaultStepNumber: 0,
    prevLabel: 'prev',
    nextLabel: 'next',
    skipLabel: 'skip',
    ...props
  };

  const [isVisibleState, setShow] = useState<boolean>(isVisible)
  const [transition, setTransition] = useState<string>(null)
  const [position, setPosition] = useState<Position>(undefined)
  const [currentStepNumber, setCurrentStepNumber] = useState<number>(defaultStepNumber || 0)
  const currentStepContent = getStep(currentStepNumber, steps)

  const wrapperStyle = {
    position: 'absolute',
    zIndex: 99,
    transition: transition,
    ...position,
  }

  useEffect(() => {
    setPosition(getCoords(getStep(currentStepNumber, steps).elementId))
  }, [])

  function onStepButtonClick(stepNumber: number) {
    setCurrentStepNumber(stepNumber)
    setPosition(getCoords(getStep(stepNumber, steps).elementId))
    setTransition('all 100ms ease')
  }

  if (!isVisibleState || !position) {
    return null
  }

  const styles = defaultStyles;
  return (
    <div id="outermost-container" style={wrapperStyle}>
      <div id="container" style={styles.container}>

        <div
          dangerouslySetInnerHTML={{ __html: currentStepContent.title }}
          style={styles.title}
          id="title"
        />

        <div
          dangerouslySetInnerHTML={{
            __html: currentStepContent.description,
          }}
          style={styles.description}
        />

        <div style={styles.footer}>
          <button onClick={() => setShow(false)} style={{ ...styles.button, backgroundColor: 'gray' }}>
            {skipLabel}
          </button>

          {currentStepNumber !== 0 && (
            <button
              onClick={() => onStepButtonClick(currentStepNumber - 1)}
              style={styles.button}
            >
              {prevLabel}
            </button>
          )}

          <button
            onClick={() => onStepButtonClick(currentStepNumber + 1)}
            disabled={currentStepNumber + 1 === steps.length}
            style={styles.button}
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

function getStep(stepNumber: number, steps: Step[]) {
  return steps[stepNumber]
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
    return null;
  }
}
