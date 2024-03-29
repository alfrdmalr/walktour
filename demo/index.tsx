import * as React from 'react'
import * as ReactDOM from 'react-dom'

//import { Walktour, WalktourLogic } from 'walktour'; // test with npm pack
import { Walktour, WalktourLogic } from '../src/components/Walktour'
import { playgroundSetup, secondarySteps, primaryIntoSecondary } from './setup'

const App = () => {

  const [tourOpen, setTourOpen] = React.useState<boolean>(true);

  return (
    <>
      {playgroundSetup({ buttonText: "Toggle Tour", onButtonClick: () => setTourOpen(!tourOpen)})}
      <Walktour
        steps={secondarySteps()}
        identifier={"2"}
        rootSelector={"#demo-container"}
      />
      <Walktour
        steps={primaryIntoSecondary()}
        identifier={"1"}
        isOpen={tourOpen}
        customCloseFunc={(logic: WalktourLogic) => { setTourOpen(false); logic.close(); }}
        disableCloseOnClick
      />
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))
