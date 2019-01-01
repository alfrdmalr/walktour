# react-onboarding
Simple wizard component for React.js

### Preview
![image](https://user-images.githubusercontent.com/5953765/50577419-c7874800-0e38-11e9-8837-de6e5e6ba71e.png)

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
        position: 1,
        elementId: 'elementIdOne',
        title: 'Title 1',
        description: 'description 1',
    },
    {
        position: 5,
        elementId: 'elementIdTwo',
        title: 'Title 2',
        description: 'description 2',
    },
]

class App extends Component {
  render() {
    return (
        <Wizard isShow rule={rule} nextButtonTitle="Next click" prevButtonTitle="Prev click"  />
    );
  }
}

export default App;
```
