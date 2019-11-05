import * as React from 'react';
import { playgroundSetup, primarySteps, secondarySteps } from '../demo/setup';
import { Step, Walktour } from '../src/components/Walktour';

export default {
  title: "Walktour|Demo",
  component: Walktour,
}

const steps: { [index: string]: () => Step[] } = {
  default: () => primarySteps,
  defaultSecondary: () => secondarySteps,

}

const basicTour = (open?: boolean, close?: () => void) => <Walktour identifier="1" customCloseFunc={() => {console.log('closing'); close()}} isOpen={open} steps={steps.default()} />
const scopedTour = (rootSelector: string) => <Walktour rootSelector={rootSelector} identifier="2" steps={steps.defaultSecondary()} />

export const full = () => {
  const [tourOpen, setTourOpen] = React.useState<boolean>(true);

  return (
    <>
      {playgroundSetup({ buttonText: "ToggleTour", onButtonClick: () => setTourOpen(!tourOpen) })}
      {basicTour(tourOpen, () => setTourOpen(false))}
      {scopedTour("#demo-container")}
    </>
  )
}

export const scoped = () => (
  <>
    {playgroundSetup({ buttonText: "Where Is The Tour?", onButtonClick: () => alert('Try the bottom right corner!') })}
    {scopedTour("#demo-container")}
  </>
)


export const normal = () => (
  <>
    {playgroundSetup({ buttonText: "Click me!", onButtonClick: () => alert('Button clicked.') })}
    {basicTour()}
  </>
)
