import * as React from 'react';
import {shallow} from 'enzyme';
import {Walktour } from '../../src/components/Walktour';

test('walktour render', () => {
  const tour = shallow(<div>
    <Walktour steps={[]} />
  </div>)

  expect(tour.length).toBe(1); //should render a single "portal" container
  

})