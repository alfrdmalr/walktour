# walktour
 
Guided tour/walkthrough component for react projects.

[npm](https://www.npmjs.com/package/walktour) |
[GitHub](https://github.com/alfrdmalr/walktour)

### Demo
![](https://user-images.githubusercontent.com/5953765/50577446-28168500-0e39-11e9-9dfd-0a44a42d3268.gif)

### Installation
* `npm install --save walktour`
* `yarn add walktour`

### How To Use

Import the Walktour component:

`import { Walktour } from 'walktour'`

And then include it somewhere in your render function:

`<Walktour 
   isVisible
   steps={mySteps}
/>`

### Props

 | **Attribute** | **Type** | **Description** |
 | ------------- | -------- | --------------- |
 | steps | Array<`Step`> | All the `Step` objects defining stops along the tour. |
 | isVisible | boolean | Determines whether the tour is shown. |
 | _initialStepIndex_ | number | Start the tour on a particular step when opened. Default is 0. |
 | ... | [`WalktourOptions`](#options) | Any of the optional [`WalktourOptions`](#options) attributes can be included as props. | 

### Step Shape
Each step of the tour is defined by a `Step` object.

| **Attribute** | **Type** | **Description** |
| ------------- | -------- | --------------- |
| querySelector | string | CSS selector string used to identify a particular element on the page. |
| title | string | Tooltip heading text. |
| description | string | Tooltip body text. |
| _customTitleRenderer_ | (_title_: string, _tourLogic_: `WalktourLogic`) => JSX.Element | Optional callback to generate custom title content. The function is passed the specified title string, as well as some [exposed tour logic](#walktourlogic). |
| _customDescriptionRenderer_ | (_description_: string, _tourLogic_: `WalktourLogic`) => JSX.Element | Optional callback to generate custom description content. The function is passed the specified description string, as well as some [exposed tour logic](#walktourlogic). |
| _customFooterRenderer_ | (_tourLogic_: `WalktourLogic`) => JSX.Element | Optional callback to generate custom footer content. The function is passed some [exposed tour logic](#walktourlogic) to allow for navigation control.|
| ... | [`WalktourOptions`](#options) | Any of the optional [`WalktourOptions`](#options) attributes can be included as props. | 

### Options
These options can be provided at a tour level or applied to a single step along the tour. 

Step-level options will take precedence over global options, so take care when using both in the same tour.

| **Attribute** | **Type** | **Description** |
| ------------- | -------- | --------------- |
| _disableMaskInteraction_ | boolean | Controls whether or not the user can use the mouse to interact with elements behind the mask. Default is false. |
| _orientationPreferences_ | Array<`CardinalOrientation`> | A subset of all tooltip alignments from which to automatically select the tooltip position. Manual positioning can be achieved by providing an array with only a single orientation. |
| _maskPadding_ | number | Distance between the targeted element and the mask (determines the size of the cutout). |
| _tooltipSeparation_ | number | Distance between the targeted element and the tooltip. |
| _tooltipWidth_ | number | Width, in pixels, of the tooltip. |
| _transition_ | string | String representing the value of CSS transition shorthand property. |
| _nextLabel_ | string | Text to be injected into the 'next' button in the tooltip footer. Default is 'next'. |
| _prevLabel_ | string | Text to be injected into the 'back' button in the tooltip footer. Default is 'prev'. |
| _skipLabel_ | string | Text to be injected into the 'close' button in the tooltip footer. Default is 'skip'. |
| _customTooltipRenderer_ | (_tourLogic_: `WalktourLogic`) => JSX.Element | Callback function to generate an entirely custom tooltip component. Some [exposed tour logic](#walktourlogic) is provided as an argument to the callback to allow such a tooltip to fully control navigation, rendering, and other functions provided by the default tooltip. |

### WalktourLogic
The `WalktourLogic` object aims to provide custom renderers with as much functionality as possible by exposing basic functions and data that the tour uses to operate.
 
| **Attribute** | **Type** | **Description** |
| ------------- | -------- | --------------- |
| goToStep | (stepNumber: number) => void | Tells the tour to jump to the specified step index. |
| next | () => void | Advances the tour by a single step. |
| prev | () => void | Returns the tour to the previous step. |
| close | () => void | Closes the tour. |
| stepContent | `Step`` | `Step` object associated with the current step index. |
| stepIndex | number | Current step index. |
| allSteps | Array<`Step`> | Collection of every `Step` in the tour. |

### Orientation And Alignment
The tooltip can be positioned at various locations around the targeted element. There are five simple positions:

| **Simple** |
| ---------- |
| East |
| South |
| West |
| North |
| _Center_ |

and 8 more specific positions, which are just combinations of the simple ones:

| **Specific** |
| ------------ |
| EastNorth |
| EastSouth |
| SouthEast |
| SouthWest |
| WestSouth |
| WestNorth |
| NorthWest |
| NorthEast |

The general format is [_Position_][_Alignment_], so a WestNorth-positioned tooltip is located on the left side of the target element, with their top edges aligned.

Each of these positions exists in the  `CardinalOrientation` enum, and can be specified with the optional `orientationPreferences` like so:

Tour Level:

```
<Walktour 
  ...
  orientationPreferences={[CardinalOrientation.NORTH, CardinalOrientation.WESTNORTH]}
  ... 
/>
``` 

Step Level:

`{ ... title: "Manual Positioning", orientationPreferences: [CardinalOrientation.EAST], ...}`



### Examples

#### Minimal 
```
import * as React from 'react';
import { Walktour } from 'walktour';

class App extends Component<> {
  render() {
    return (
      <div>
        <Walktour
          isVisible
          steps={[
            {querySelector: "#step-one", title: "First Steps", description: "One foot in front of the other"}
          ]}
        />
      </div>)
  }
}
```

#### Advanced
```
import * as React from 'react';
import { Walktour } from 'walktour';

class App extends Component<any, {showTour: boolean}> {
  constructor(props: any) {
    super(props);

    this.state = {
      showTour: false
    }
  }

  toggleTour = () => {
    this.setState({
      showTour: !this.state.showTour
    })
  }

  steps = [
    {querySelector: "#step-one", title: "First Steps", description: "One foot in front of the other", 
      orientationPreferences: [CardinalOrientation: NORTH, CardinalOrientation: EAST]},
    {querySelector: ".step-two", title: "Second Step", description: "doing great", 
    customDescriptionRenderer: (desc) => <span>wow, you're {desc}!</span>}
  ];

  render() {
    return (
      <div>
        <Walktour
           isVisible={this.state.showTour}
           steps={steps}
        />
        <button onClick={this.toggleTour}>Toggle Tour</button>
        
        <div id="step-one">First Step.</div>
        <div className="step-two">Second Step! </div>
      </div>)
  }
}

#### Custom
```

```