import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { Walktour, Step, WalktourLogic } from '../src/components/Walktour'
import { CardinalOrientation } from '../src/utils/positioning'

const steps: Step[] = [
  { selector: null, title: 'Guided Tour Component', description: 'Welcome to the tour!'},
  { selector: '#two', title: 'Keyboard Navigation', description: 'Use the arrow keys or tab to a specific button', orientationPreferences: [CardinalOrientation.EAST] },
  { selector: '.four', title: 'Full CSS Selector Support', description: 'Any valid query selector works for targeting elements', movingTarget: true,  updateInterval: 20 },
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
  { selector: '#six', title: null, description: null, customTooltipRenderer: (logic: WalktourLogic) => <CustomTooltip {...logic} {...logic.stepContent} /> },
  { selector: '#demo-container', title: "Encapsulated Tours", description: 'Not only can you have multiple tours on a page...' }
]

const stepsPartTwo: Step[] = [
  { selector: '#oneTwo', description: '...you can also have scoped tours'},
  { selector: "#twoTwo", description: 'The tour component will automatically find the nearest suitable ancestor to hold it', movingTarget: false},
  { selector: '#threeTwo', title: 'Smart Masking!', description: 'The overlay will be constrained by this ancestor container, and scrolling works within the component', 
  orientationPreferences: [CardinalOrientation.SOUTH]},
]

const containerStyle: React.CSSProperties = { position: 'absolute', left: 1800, top: 1800, height: 600, width: 600, overflow: 'auto', padding: '2rem' }
const oneStyle: React.CSSProperties = { background: 'grey', width: 200, height: 100, }
const twoStyle: React.CSSProperties = { background: 'cornflowerblue', width: 100, height: 200, left: 300, top: 300, position: 'absolute' }
const threeStyle: React.CSSProperties = { background: 'magenta', width: 600, height: 100, left: 900, top: 15, position: 'absolute' }
const fourStyle: React.CSSProperties = { background: 'orange', width: 200, height: 100, left: 1120, top: 580, position: 'absolute' }
const fiveStyle: React.CSSProperties = { position: 'absolute', top: '350px', left: '650px', cursor: "pointer" }
const sixStyle: React.CSSProperties = { background: 'aquamarine', width: 200, height: 100, left: 450, top: 450, position: 'absolute' }
const sevenStyle: React.CSSProperties = { background: 'linear-gradient(to right, red, white, blue)', width: 200, height: 100, left: 169, top: 1776, position: 'absolute', }
const eightStyle: React.CSSProperties = { background: 'transparent', width: 200, height: 100, left: 10, top: 650, position: 'absolute', border: '5px dotted black', borderRadius: '5px' }

const App = () => (
  <>
    <div id={'one'} style={oneStyle} />
    <div id={'two'} style={twoStyle} />
    <div id={'three'} style={threeStyle} />
    <div className={'four'} style={fourStyle} />
    <button
      style={fiveStyle} id="five"
      onClick={() => alert('Button has been clicked.')}
    >
      Try Clicking Me!
    </button>
    <div id='six' style={sixStyle} />
    <div id='seven' style={sevenStyle} />
    <div id='eight' style={eightStyle} />

    <div style={containerStyle} id="demo-container">
      <div id='oneTwo' style={oneStyle} />
      <div id='twoTwo' style={{...twoStyle}} />
      <div id='threeTwo' style={threeStyle} />

      <Walktour steps={stepsPartTwo} identifier={"2"} />
    </div>

    <Walktour disableCloseOnClick steps={steps} identifier={"1"} />
  </>
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
    padding: 10,
    minWidth: 320
  }
  return <div style={style}>
    <p>You can also render your own custom components instead of the default tooltip.</p>

    <p>They'll have access to the same control functions as the normal tooltip.</p>

    <p>More info about customizability and usage <a style={{ color: 'cyan' }} href="http://www.github.com/alfrdmalr/walktour">on Github.</a></p>
    <button onClick={props.close}>close</button>
  </div>

}
