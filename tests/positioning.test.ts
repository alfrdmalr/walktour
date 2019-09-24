import {dist, Coords} from '../src/positioning';

test('dist-base-case', () => {
  expect(dist(null, null)).toBe(null);
})