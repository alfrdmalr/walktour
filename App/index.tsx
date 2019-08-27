import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { Walktour, Step } from '../src/index'
import { CardinalOrientation } from '../src/positioning';

const steps: Step[] = [
  { querySelector: '#one', title: 'Guided Tour Component', description: 'Welcome to the tour!' },
  { querySelector: '#two', title: 'Keyboard Navigation', description: 'Use the arrow keys or tab to a specific button' },
  { querySelector: '#three', title: 'Step Three', description: 'The tooltip is automatically positioned within view' },
  { querySelector: '.four', title: 'CSS Selectors', description: 'Any valid query selector works for targeting elements' },
  { querySelector: '#five', title: 'Interact with the highlighted element', description: 'click the button to see for yourself!' },
  {querySelector: '#six', title: "Explicit Positioning", description: 'East!', orientation: [CardinalOrientation.EAST]},
  {querySelector: '#six', title: "Explicit Positioning", description: 'South!', orientation: [CardinalOrientation.SOUTH]},
  {querySelector: '#six', title: "Get More Specific!", description: 'North with West alignment!!', orientation: [CardinalOrientation.NORTHWEST]},
  {querySelector: '#six', title: "Get More Specific!", description: 'West with North alignment!', orientation: [CardinalOrientation.WESTNORTH]},
  {querySelector: '#seven', title: 'Scrolling', description: 'Offscreen elements can be automatically scrolled into view', orientation: [CardinalOrientation.NORTHWEST]}
]

const styleElementOne: React.CSSProperties = {
  background: 'grey',
  width: 200,
  height: 100,
}

const styleElementTwo: React.CSSProperties = {
  background: 'cornflowerblue',
  width: 200,
  height: 100,
  left: 300,
  top: 300,
  position: 'absolute'
}

const styleElementThree: React.CSSProperties = {
  background: 'magenta',
  width: 200,
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


const App = () => (
  <div>
    <div id={'one'} style={styleElementOne} />
    <div id={'two'} style={styleElementTwo} />
    <div id={'three'} style={styleElementThree} />
    <div className={'four'} style={styleElementFour} />
    <div id='six' style={styleElementSix} />
    <div id='seven' style={styleElementSeven} />
    <button
      style={{ position: 'absolute', top: '350px', left: '650px', cursor: "pointer" }} id="five"
      onClick={() => alert('Button has been clicked.')}
    >
      Interact with me!
    </button>
    <Walktour steps={steps} isVisible />
  </div>
)

ReactDOM.render(<App />, document.getElementById('app'))
