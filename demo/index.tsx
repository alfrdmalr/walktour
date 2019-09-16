import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { Walktour, Step, WalktourLogic } from '../src/components/Walktour'
import { CardinalOrientation } from '../src/positioning';

const steps: Step[] = [
  { selector: '#one', title: 'Guided Tour Component', description: 'Welcome to the tour!'},
  { selector: '#two', title: 'Keyboard Navigation', description: 'Use the arrow keys or tab to a specific button', orientationPreferences: [CardinalOrientation.EAST] },
  { selector: '.four', title: 'Full CSS Selector Support', description: 'Any valid query selector works for targeting elements' },
  { selector: '#five', title: 'Interact with the highlighted element', description: 'click the button to see for yourself!' },
  { selector: '#eight', title: 'Supply Custom HTML Content', description: null, customDescriptionRenderer: () => <><h1>H1 Element</h1><p>Paragraph Element</p><input type='text' placeholder={'text input element'} /></> },
  {
    selector: '#eight', title: 'Access the Tour API...', description: "return the to first step", customDescriptionRenderer: (description: string, logic: WalktourLogic) =>
      <div>...from inside your custom content<button onClick={() => logic.goToStep(0)}>{description}</button></div>
  },
  { selector: '#three', title: 'Smart Positioning', description: 'The tooltip is automatically positioned within view' },
  { selector: '#six', title: "Explicit Positioning", description: 'East!', orientationPreferences: [CardinalOrientation.EAST] },
  { selector: '#six', title: "Explicit Positioning", description: 'South!', orientationPreferences: [CardinalOrientation.SOUTH] },
  { selector: '#six', title: "Get More Specific!", description: 'North with West alignment!!', orientationPreferences: [CardinalOrientation.NORTHWEST] },
  { selector: '#six', title: "Get More Specific!", description: 'West with North alignment!', orientationPreferences: [CardinalOrientation.WESTNORTH] },
  { selector: '#seven', title: 'Scrolling', description: 'Offscreen elements can be automatically scrolled into view', orientationPreferences: [CardinalOrientation.NORTHWEST] },
  { selector: '#six', title: null, description: null, customTooltipRenderer: (logic: WalktourLogic) => <CustomTooltip {...logic} {...logic.stepContent} />, orientationPreferences: [CardinalOrientation.EASTSOUTH] }
]

const containerStyle: React.CSSProperties = {
  position: 'absolute',
  left: 50,
  top: 50,
  height: 600,
  width: 600,
  overflow: 'scroll',
  padding: '2rem'
}

const styleElementOne: React.CSSProperties = {
  background: 'grey',
  width: 200,
  height: 100,
}

const styleElementTwo: React.CSSProperties = {
  background: 'cornflowerblue',
  width: 100,
  height: 200,
  left: 300,
  top: 300,
  position: 'absolute'
}

const styleElementThree: React.CSSProperties = {
  background: 'magenta',
  width: 600,
  height: 100,
  left: 900,
  top: 15,
  position: 'absolute'
}

const styleElementFour: React.CSSProperties = {
  background: 'orange',
  width: 200,
  height: 100,
  left: 1120,
  top: 580,
  position: 'absolute'
}

const styleElementFive: React.CSSProperties = {
  position: 'absolute',
  top: '350px',
  left: '650px',
  cursor: "pointer"
}

const styleElementSix: React.CSSProperties = {
  background: 'aquamarine',
  width: 200,
  height: 100,
  left: 450,
  top: 450,
  position: 'absolute'
}

const styleElementSeven: React.CSSProperties = {
  background: 'linear-gradient(to right, red, white, blue)',
  width: 200,
  height: 100,
  left: 169,
  top: 1776,
  position: 'absolute',
}

const styleElementEight: React.CSSProperties = {
  background: 'transparent',
  width: 200,
  height: 100,
  left: 10,
  top: 650,
  position: 'absolute',
  border: '5px dotted black',
  borderRadius: '5px'
}


const App = () => (
  <div style={containerStyle} id="demo-container">
    <div id={'one'} style={styleElementOne} />
    <div id={'two'} style={styleElementTwo} />
    <div id={'three'} style={styleElementThree} />
    <div className={'four'} style={styleElementFour} />
    <button
      style={styleElementFive} id="five"
      onClick={() => alert('Button has been clicked.')}
    >
      Try Clicking Me!
    </button>
    <div id='six' style={styleElementSix} />
    <div id='seven' style={styleElementSeven} />
    <div id='eight' style={styleElementEight} />


    <Walktour steps={steps} />
  </div>
)

ReactDOM.render(<App />, document.getElementById('app'))

interface CustomTooltipProps {
  close: () => void;
  description: string;
}

function CustomTooltip(props: CustomTooltipProps) {
  const style: React.CSSProperties = {
    backgroundColor: 'darkslategrey',
    color: 'cornsilk',
    fontFamily: 'Consolas, serif',
    border: '1px solid cornsilk',
    maxWidth: 300,
    padding: 10
  }
  return <div style={style}>
    <p>You can also render your own custom components instead of the default tooltip.</p>

    <p>They'll have access to the same control functions as the normal tooltip.</p>

    <p>More info about customizability and usage <a style={{ color: 'cyan' }} href="http://www.github.com/alfrdmalr/walktour">on Github.</a></p>
    <button onClick={props.close}>close</button>
  </div>

}
