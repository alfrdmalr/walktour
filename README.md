# react-onboarding [![](https://img.shields.io/twitter/url/http/shields.io.svg?style=social?style=social)](https://github.com/ilyapasyuk/react-onboarding)
 
Simple wizard component for React.js

![size](https://img.shields.io/bundlephobia/min/react-onboarding.svg)
![](https://img.shields.io/npm/v/react-onboarding.svg?style=flat-square)

[NPM](https://www.npmjs.com/package/react-onboarding) |
[Github](https://github.com/ilyapasyuk/react-onboarding) |
[Feature request](https://github.com/ilyapasyuk/react-onboarding/issues/new)

### Preview
![](https://user-images.githubusercontent.com/5953765/50577446-28168500-0e39-11e9-9dfd-0a44a42d3268.gif)

### Installation

* `npm install --save react-onboarding`
* `yarn add react-onboarding`

### How To Use

First import this component where you want to use it

`import Wizard from "react-onboarding"`

Then just renders it

`<Wizard />`

### Props

|      _Prop_     |       _Description_       | _Default value_ |
| --------------- |   :-------------------:   | :-------------: |
| rule            |   array rules for wizard  |      none       |
| isShow          |    Sets view mode         |      true       |
| prevButtonTitle | title for previous button |      Prev       |
| nextButtonTitle | title for next button     |      Next       |

### Example

```
import React, { Component } from "react";
import Wizard from "react-onboarding";

const rule = [
    {
        elementId: 'elementIdOne',
        title: 'Title 1',
        description: 'description 1',
    },
    {
        elementId: 'elementIdTwo',
        title: 'Title 2',
        description: 'description 2',
    },
]

class App extends Component {
  render() {
    return (
        <Wizard rule={rule} nextButtonTitle="Next click" prevButtonTitle="Prev click"  />
    );
  }
}

export default App;
```
