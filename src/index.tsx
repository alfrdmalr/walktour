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
  isShow: boolean;
  defaultStepNumber?: number;
  prevButtonTitle?: string;
  nextButtonTitle?: string;
}

interface Position {
  top: number;
  left: number;
  bottom?: number;
  right?: number;
}

export const Walktour = (props: WalktourProps) => {
  let { 
    isShow, 
    steps: rule, 
    defaultStepNumber, 
    prevButtonTitle, 
    nextButtonTitle } = {defaultStepNumber: 0, prevButtonTitle: 'prev', nextButtonTitle: 'next', ...props};
    
  const [isShowState, setShow] = useState<boolean>(isShow)
  const [transition, setTransition] = useState<string>(null)
  const [position, setPosition] = useState<Position>(undefined)
  const [currentStepNumber, setCurrentStepNumber] = useState<number>(defaultStepNumber || 0)
  const currentStepContent = getStep(currentStepNumber, rule)

  const wrapperStyle = {
    position: 'absolute',
    zIndex: 99,
    transition: transition,
    ...position, 
  }

  useEffect(() => {
    setPosition(getCoords(getStep(currentStepNumber, rule).elementId))
  }, [])

  function onStepButtonClick(stepNumber: number) {
    setCurrentStepNumber(stepNumber)
    setPosition(getCoords(getStep(stepNumber, rule).elementId))
    setTransition('all 100ms ease')
  }

  if (!isShowState || !position) {
    return null
  }
  console.log(
    '%c currentStepNumber ',
    'color: white; background-color: #2274A5',
    currentStepNumber,
  );

  const styles = defaultStyles;
  return (
    <div id="outermost-container" style={wrapperStyle}>
      <div id="container" style={styles.container}>
        {/* <button onClick={() => setShow(false)} style={styles.closeButton}>
                    X
                </button> */}
        <div id="info" style={styles.info}>
          {/* <div id="stepcount" style={styles.stepsCount}>
                        {currentStepNumber + 1} of {rule.length}
                    </div> */}
        </div>

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
          id="description"
        />

        <div id="footer" style={styles.footer}>
          <button id="skipbutton" onClick={() => setShow(false)} style={{ ...styles.button, backgroundColor: 'gray' }}>
            Skip
                    </button>
          {currentStepNumber !== 0 && (
            <button id="prevbutton"
              onClick={() => onStepButtonClick(currentStepNumber - 1)}
              style={styles.button}
            >
              {prevButtonTitle}
            </button>
          )}

          <button id="nextbutton"
            onClick={() => onStepButtonClick(currentStepNumber + 1)}
            disabled={currentStepNumber + 1 === rule.length}
            style={styles.button}
          >
            {nextButtonTitle}
          </button>
        </div>
      </div>
      <div style={styles.pin} id="pin" />
      <div style={styles.pinLine} id="pin-inline" />
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
