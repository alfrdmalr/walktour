import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { Walktour, Step } from '../src/index'
import { CardinalOrientation } from '../src/positioning';

const steps: Step[] = [
  { querySelector: '#one', title: 'Title one', description: 'Description one' },
  { querySelector: '#two', title: 'Title two', description: 'Description two' },
  { querySelector: '#one', title: 'Back to the first element we selected: testing long values for the title and such', description: 'description two here I am testing long values for the body as well just to see how it natively handles this type of thing' },
  { querySelector: '#three', title: 'Three', description: 'another description' },
  { querySelector: '.four', title: 'CSS Selectors', description: 'now with query selectors for even better element selection!' },
  { querySelector: '#five', title: 'Interact through the mask cutout', description: 'click the button to see for yourself!' },
  {querySelector: '#six', title: "Cardinal Direction Positioning", description: 'East!', orientation: [CardinalOrientation.EAST]},
  {querySelector: '#six', title: "Cardinal Direction Positioning", description: 'South!', orientation: [CardinalOrientation.SOUTH]},
  {querySelector: '#six', title: "Get More Specific!", description: 'North with West alignment!!', orientation: [CardinalOrientation.NORTHWEST]},
  {querySelector: '#six', title: "Get More Specific!", description: 'West with North alignment!', orientation: [CardinalOrientation.WESTNORTH]},
  {querySelector: '#seven', title: 'Scrolling', description: 'offscreen elements are automatically scrolled into view'}
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
    <h1>Welcome to the Tour Playground</h1>
    <div id={'one'} style={styleElementOne} />
    <div id={'two'} style={styleElementTwo} />
    <div id={'three'} style={styleElementThree} />
    <div className={'four'} style={styleElementFour} />
    <div id='six' style={styleElementSix} />
    <div id='seven' style={styleElementSeven} />
    <button
      style={{ position: 'absolute', top: '350px', left: '650px', cursor: "pointer" }} id="five"
      onClick={() => alert('you did it!')}
    >
      Interact with me!
    </button>
    <Walktour steps={steps} isVisible />
  </div>
)

ReactDOM.render(<App />, document.getElementById('app'))
