import React from 'react'
import ReactDOM from 'react-dom'

import Wizard from '../Wizard/index'

const rule = [
    { elementId: 'one', title: 'Title one', description: 'Description one' },
    { elementId: 'two', title: 'Title two', description: 'Description two' },
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
    position: 'absolute',
    left: 300,
    top: 300,
}

const App = () => (
    <div>
        <div id={rule[0].elementId} style={styleElementOne} />
        <div id={rule[1].elementId} style={styleElementTwo} />
        <Wizard rule={rule} isShow />
    </div>
)

ReactDOM.render(<App />, document.getElementById('app'))
