import * as React from 'react';
import { playgroundSetup, primarySteps } from '../../demo/setup';
import { Walktour } from '../../src/components/Walktour';
import { withKnobs } from '@storybook/addon-knobs';

//TODO abstract out
const playgroundDecorator = (storyFunction: () => Node) => <>
  {playgroundSetup({ buttonText: "Click Me", onButtonClick: () => "Thanks!" })}
  {storyFunction()}
</>

export default {
  title: "Walktour|Options",
  component: Walktour,
  decorators: [
    withKnobs,
    playgroundDecorator
  ]
}

export const all = () => (
  <Walktour steps={primarySteps()} />
)