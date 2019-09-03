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

### Step Shape
Each step of the tour is defined by a `Step` object.


_Additionally, any of the optional `WalktourOptions` attributes can be included in a `Step` object._

### Props

_Additionally, any of the optional `WalktourOptions` attributes can be included as props._


 | **Attribute** | **Type** | **Description** |
 | ------------- | -------- | --------------- |
 | steps | _Array<`Step`>_ | All the `Step` objects defining stops along the tour. |
 | isVisible | _boolean_ | Determines whether the tour is shown. |
 | _initialStepIndex_ | _number_ | Start the tour on a particular step when opened. Default is 0. |
 | ... | [`WalktourOptions`](#options) | Any of the optional [`WalktourOptions`](#options) attributes can be included as props, at the same level as any other prop. No need for an options object. | 

### Options
These options can be provided at a tour level or applied to a single step along the tour. 


Step-level options will take precedence over global options.


### Example

```

```
