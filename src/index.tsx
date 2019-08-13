import * as React from 'react';
import { useState, useEffect } from 'react';

const styles = {
  container: {
    width: 226,
    minHeight: 100,
    backgroundColor: 'white',
    padding: 10,
    transform: 'translate(22px, -50px)',
    zIndex: 2,
    position: 'relative',
    borderRadius: '5px',
    fontFamily: 'Roboto, sans-serif',
    boxShadow: '0 3px 8px 0 rgba(0,0,0,.25)',
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 10,
    padding: 0,
    cursor: 'pointer',
    color: 'grey',
    border: 0,
    outline: 'none',
    background: 'transparent',
  },
  footer: {
    padding: '10px 0 0',
    textAlign: 'right',
  },
  title: {
    marginBottom: 8,
    letterSpacing: 'normal',
    color: '#000000',
    fontSize: 24,
    fontStyle: 'normal',
  },
  description: {
    marginBottom: 15,
    color: '#4d4d4d',
    fontSize: 12,
    lineHeight: 1.25,
  },
  info: {
    display: 'flex',
    fontSize: 18,
    width: '87%',
    marginBottom: 10,
    alignItems: 'center',

  },
  stepsCount: {
    width: '35%',
    fontSize: 12,
  },
  pin: {
    position: 'absolute',
    zIndex: 2,
    width: 15,
    height: 15,
    borderRadius: 50,
    background: '#1787fc',
    boxShadow: '0 0 0 2px white',
    top: '-7px',
    left: '-7px',
  },
  pinLine: {
    height: 1,
    width: 25,
    top: 1,
    position: 'absolute',
    zIndex: 1,
    background: '#1787fc',
  },
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 300,
    cursor: 'pointer',
    height: 32,
    lineHeight: '32px',
    padding: '0 16px',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    border: 0,
    borderRadius: 3,
    outline: 'none',
    backgroundColor: '#0084ff',
    color: '#fff',
    fontSize: 14,
    marginLeft: 10,
  },
}

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

  function onStepButtonClick(stepNumber) {
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
  )
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

function getStep(stepNumber, rules) {
  return rules[stepNumber]
}

function getCoords(elementId): Position {
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
