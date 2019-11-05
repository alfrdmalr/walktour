import * as React from 'react';
import { playgroundSetup, primarySteps } from '../../demo/setup';
import { Walktour } from '../../src/components/Walktour';
import { withKnobs, boolean } from '@storybook/addon-knobs';

const statefulPlaygroundDecorator = (storyFunction: (open?: boolean, close?: () => void) => Node) => {
  const [tourOpen, setTourOpen] = React.useState<boolean>(true);

  const closeFunc = () => setTourOpen(false);
  console.log('closeFunc', closeFunc)
  return (
    <>
      {playgroundSetup({ buttonText: "Toggle Tour", onButtonClick: () => setTourOpen(!tourOpen) })}
      {storyFunction(tourOpen, closeFunc)}

    </>
  )
}

export default {
  title: "Walktour|Options/Interaction",
  component: Walktour,
  decorators: [
    withKnobs,
    statefulPlaygroundDecorator
  ]
}

export const all = (tourOpen: boolean, closeFunc: () => void) => (
  <Walktour
    isOpen={tourOpen}
    customCloseFunc={(logic) => closeFunc()}
    steps={primarySteps}
    disableCloseOnClick={boolean('disableCloseOnClick', false)}
    disableMaskInteraction={boolean('disableMaskInteraction', false)}
    disableNext={boolean('disableNext', false)}
    disablePrev={boolean('disablePrev', false)}
    disableClose={boolean('disableClose', false)}
  />
)

export const disableCloseOnClick = (tourOpen: boolean, close: () => void) => (
  <Walktour
    customCloseFunc={close}
    isOpen={tourOpen}
    initialStepIndex={3}
    steps={primarySteps}
    disableCloseOnClick={boolean('disableCloseOnClick', false)}
  />
)


export const disableMaskInteraction = () => (
  <Walktour
    steps={primarySteps}
    disableMaskInteraction={boolean('disableMaskInteraction', false)}
  />
)

export const disableNext = () => (
  <Walktour
    steps={primarySteps}
    disableNext={boolean('disableNext', false)}
  />
)

export const disablePrev = () => (
  <Walktour
    steps={primarySteps}
    disablePrev={boolean('disablePrev', false)}
  />
)

export const disableClose = () => (
  <Walktour
    steps={primarySteps}
    disableClose={boolean('disableClose', false)}
  />
)
