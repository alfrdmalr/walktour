import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { Walktour, Step } from '../src/index'

const steps: Step[] = [
  { querySelector: '#one', title: 'Title one', description: 'Description one' },
  { querySelector: '#two', title: 'Title two', description: 'Description two' },
  { querySelector: '#one', title: 'Back to the first element we selected: testing long values for the title and such', description: 'description two here I am testing long values for the body as well just to see how it natively handles this type of thing' },
  { querySelector: '#three', title: 'Three', description: 'another description' },
  { querySelector: '.four', title: 'CSS Selectors', description: 'now with query selectors for even better element selection!' },
  { querySelector: '#five', title: 'Interact through the mask cutout', description: 'click the button to see for yourself!' }
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
  left: 600,
  top: 1800,
  position: 'absolute'
}


const App = () => (
  <div>
    <h1>Welcome to the Tour Playground</h1>
    <div id={'one'} style={styleElementOne} />
    <div id={'two'} style={styleElementTwo} />
    <div id={'three'} style={styleElementThree} />
    <div className={'four'} style={styleElementFour} />
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
