import * as React from 'react';
import { Walktour } from '../../src/components/Walktour';
import { withKnobs, boolean } from '@storybook/addon-knobs';
import { SingleStepTour } from '../utils/wrappers';
import { singleTargetPlayground, singleTargetSteps } from '../utils/setup';

//TODO abstract out
const playgroundDecorator = (storyFunction: () => Node) => <>
  {singleTargetPlayground()}
  {storyFunction()}
</>


export const isOpen = () => (
  <SingleStepTour 
  steps={singleTargetSteps("Toggle the tour by changing 'isOpen' in the Knobs tab")}
  isOpen={boolean('isOpen', true)}
  />
)

export const disableMask = () => (
  <SingleStepTour
    steps={singleTargetSteps("Toggle the mask by changing the 'disableMask' in the Knobs tab")}
    disableMask={boolean('disableMask', false)}
  />
)

export default {
  title: "Walktour|Options/Visibility",
  component: Walktour,
  decorators: [
    withKnobs,
    playgroundDecorator
  ]
}