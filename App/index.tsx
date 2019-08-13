import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { Walktour } from '../src/index'

const rule = [
    { elementId: 'one', title: 'Title one', description: 'Description one' },
    { elementId: 'two', title: 'Title two', description: 'Description two' },
    { elementId: 'one', title: 'Title Three: testing long values for the title and such', description: 'description two here I am testing long values for the body as well just to see how it natively handles this type of thing'}
]

const styleElementOne = {
    background: 'grey',
    width: 200,
    height: 100,
}

const styleElementTwo = {
    background: 'cornflowerblue',
    width: 200,
    height: 100,
    left: 300,
    top: 300,
    position: 'absolute' as 'absolute'
}

const App = () => (
    <div>
      <h1>Welcome to the Tour Playground</h1>
        <div id={rule[0].elementId} style={styleElementOne} />
        <div id={rule[1].elementId} style={styleElementTwo} />
        <Walktour steps={rule} isShow />
    </div>
)

ReactDOM.render(<App />, document.getElementById('app'))
