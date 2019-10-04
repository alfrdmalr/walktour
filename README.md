# walktour
 
Guided tour/walkthrough component for react projects.

[npm](https://www.npmjs.com/package/walktour) |
[GitHub](https://github.com/alfrdmalr/walktour)

[See the demo](https://alfrdmalr.github.io/walktour-demo)

### Installation
* `yarn add walktour`

### How To Use

Import the Walktour component:

`import { Walktour } from 'walktour'`

And then include it somewhere in your render function:

`<Walktour 
   steps={mySteps}
/>`

### Props

 | **Attribute** | **Type** | **Description** |
 | ------------- | -------- | --------------- |
 | steps | Array<`Step`> | All the `Step` objects defining stops along the tour. |
 | _initialStepIndex_ | number | Start the tour on a particular step when opened. Default is 0. |
 | _zIndex_ | number | z-index value to give the tour components. |
 | _rootSelector_ | string | CSS selector string specifying the container element that the tour should be injected into. Only necessary if trying to constrain the scope of the tour and it's masking/scrolling to a particular element which is distinct from where the tour is instantiated. |
 | _identifier_ | string | An id string to be suffixed to the default Walktour IDs. Only necessary if multiple tours are running on the same page. More commonly, this means different tours in different components who are active on the same page. |
 | ... | [`WalktourOptions`](#options) | Any of the optional [`WalktourOptions`](#options) attributes can be included as props. | 
 

### Step Shape
Each step of the tour is defined by a `Step` object.

| **Attribute** | **Type** | **Description** |
| ------------- | -------- | --------------- |
| selector | string | CSS selector string used to identify a particular element on the page. |
| description | string | Tooltip body text. |
| _title_ | string | Tooltip heading text. |
| ... | [`WalktourOptions`](#options) | Any of the optional [`WalktourOptions`](#options) attributes can be included as part of a `Step` object. | 

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
| _nextLabel_ | string | Text to be injected into the `next` button in the tooltip footer. Default is "next". |
| _prevLabel_ | string | Text to be injected into the `back` button in the tooltip footer. Default is "prev". |
| _closeLabel_ | string | Text to be injected into the `close` button in the tooltip footer. Default is "skip". |
| _disableNext_ | boolean | Determines whether the `next()` operation is allowed. |
| _disablePrev_ | boolean | Determines whether the `prev()` operation is allowed. |
| _disableClose_ | boolean | Determines whether the `close()` operation is allowed. |
| _customTooltipRenderer_ | (_tourLogic_: `WalktourLogic`) => JSX.Element | Callback function to generate an entirely custom tooltip component. Some [exposed tour logic](#walktourlogic) is provided as an argument to the callback to allow such a tooltip to fully control navigation, rendering, and other functions provided by the default tooltip. WARNING: Using `position: absolute` or `fixed` may break positioning of the tooltip and is not recommended. |
| _customTitleRenderer_ | (_title_: string, _tourLogic_: `WalktourLogic`) => JSX.Element | Optional callback to generate custom title content. The function is passed the specified title string, as well as some [exposed tour logic](#walktourlogic). |
| _customDescriptionRenderer_ | (_description_: string, _tourLogic_: `WalktourLogic`) => JSX.Element | Optional callback to generate custom description content. The function is passed the specified description string, as well as some [exposed tour logic](#walktourlogic). |
| _customFooterRenderer_ | (_tourLogic_: `WalktourLogic`) => JSX.Element | Optional callback to generate custom footer content. The function is passed some [exposed tour logic](#walktourlogic) to allow for navigation control.|
| _customNextFunc_ | (_tourLogic_: `WalktourLogic`) => void | Callback function to replace the default 'next' function. This is called each time that `next()` would normally be called. |
| _customPrevFunc_ | (_tourLogic_: `WalktourLogic`) => void | Callback function to replace the default 'prev' function. This is called each time that `prev()` would normally be called. |
| _customCloseFunc_ | (_tourLogic_: `WalktourLogic`) => void | Callback function to replace the default 'close' function. This is called each time that `close()` would normally be called. |
| _disableAutoScroll_ | boolean | Disable automatically scrolling elements into view. |
| _getPositionFromCandidates_ | (candidates: `OrientationCoords[]`) => Coords | Optional callback to specify how the tooltip position is chosen. Only use if positioning is more complex than can be achieved with `orientationPreferences`; for instance, the tooltip position could be based on proximity to the cursor position or some other factor that's not known ahead of time. |
| _movingTarget_ | boolean | If true, the tour will watch the target element for position changes. If the position is sufficiently different (as specified by `renderTolerance`) from its initial position, the tooltip and mask will adjust themselves accordingly. This can also be used if a particular target element is hidden or does not yet exist at the time the tour arrives to it. |
| _renderTolerance_ | number | Distance, in pixels, for the target element to have moved before triggering an update. Default is 2. |
| _updateInterval_ | number | Duration, in milliseconds, between polling for changes to a target's positioning. Default is 500. |


### WalktourLogic
The `WalktourLogic` object aims to provide custom renderers with as much functionality as possible by exposing basic functions and data that the tour uses to operate.
All custom renderers are responsible for implementing the various `WalktourOptions` to their desired degree. For instance, a customFooterRenderer might choose to ignore the _disableClose_ option, or to always display "back" instead of the specified _prevLabel_.
 
| **Attribute** | **Type** | **Description** |
| ------------- | -------- | --------------- |
| goToStep | (stepNumber: number) => void | Tells the tour to jump to the specified step index. |
| next* | () => void | Advances the tour by a single step. |
| prev* | () => void | Returns the tour to the previous step. |
| close* | () => void | Closes the tour. |
| stepContent** | `Step` | `Step` object associated with the current step index. |
| stepIndex | number | Current step index. |
| allSteps | Array<`Step`> | Collection of every `Step` in the tour. |

*If any _customFunc_ is specified, that custom function will replace the respective function in the `WalktourLogic` object, with the default logic passed as arguments to the custom functions. This means that a _customNextFunc_ could look like this:
```
function myCustomNext(logic: WalktourLogic): void {
  loadNextStepPromise().then(val => {
    console.log(val);
    //advance tour on promise fulfillment
    logic.next();
  }, rej => {
    console.log(rej);
    //don't advance tour
  });
}
```
It's especially important to call `close()` if providing _customCloseFunc_, since there are cleanup events which are handled by the default `close()` call.

**All options available for a `Step` object will be provided in the `WalktourLogic` object, even if those options haven't been specified for a particular step. For instance, if the `tooltipWidth` option is passed to `Walktour` itself, but not to any individual step, each step's `WalktourObject` will still have the most relevant value for `tooltipWidth` as part of its `stepContent`.

### Orientation And Alignment
The tooltip can be positioned at various locations around the targeted element. There are five simple positions:

| **Enum** | **String** |
| -------- | ---------- |
| East | "east" |
| South | "south" |
| West | "west" |
| North | "north" |
| _Center*_ | "center" |

and 8 more specific positions, which are just combinations of the simple ones:

| **Enum** | **String** |
| -------- | ---------- |
| EastNorth | "east-north" |
| EastSouth | "east-south" |
| SouthEast | "south-east" |
| SouthWest | "south-west" |
| WestSouth | "west-south" |
| WestNorth | "west-north" |
| NorthWest | "north-west" |
| NorthEast | "north-east" |

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

`{... title: "Manual Positioning", orientationPreferences: [CardinalOrientation.EAST], ...}`

An orientation can also be specified at either level with its corresponding string, like this:

`{... orientationPreferences: ["south-east", "east-south", "south", "east"] ...}`


*_Center_ places the tooltip at the current center of the viewport. As such, it may have odd behavior when used with scrolling.
It also serves as the default position when the element targeted by a `Step`'s `selector` property cannot be found. 
If a content agnostic, centered tooltip is desired, it's generally best to **not** request it using the `orientationPreferences` option. 
Instead, specifiy that `Step`'s `selector` property value to `null` or `undefined`, or simply omit the property altogether. 
It is also currently recommended that `disableAutoScroll: false` be included to combat any scrolling inconsistencies:

`{... selector: null, description: "This tooltip is centered, disableAutoScroll: true, ...}`

### Examples

#### Minimal 
```
import * as React from 'react';
import { Walktour } from 'walktour';

class App extends Component<> {
  render() {
    return (
      <div>
        <div id="step-one">My first step</div>
        <Walktour
          steps={[
            {selector: "#step-one", title: "First Steps", description: "One foot in front of the other"}
          ]}
        />
      </div>)
  }
}
```

### Development / Demo
Clone the repo with:

`git clone https://github.com/alfrdmalr/walktour.git`

Navigate to the new directory and install the necessary development dependencies:

`cd walktour && yarn install`

Launch the development server:

`yarn start`

Once the server is running, it will specify a URL (typically http://localhost:1234). Navigate there in your browser to see your changes and interact with the demo app!

