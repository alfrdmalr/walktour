import {dist, Coords} from '../src/positioning';

const coordsOrigin: Coords = {x: 0, y: 0}
const coords100: Coords = {x: 100, y: 100}
const coordsTop: Coords = {x: 100, y: 0}
const coordsLeft: Coords = {x: 0, y: 100}
const coords100Negative: Coords = {x: -100, y: -100}
const coordsTopNegative: Coords = {x: -100, y: 0}
const coordsLeftNegative: Coords = {x: 0, y: -100}
const coordsUgly1: Coords = {x: 65.2, y: 155.6}
const coordsUgly2: Coords = {x: 0.003, y: 51.5}
const coordsUgly3: Coords = {x: 678.12, y: -399}
const coordsUndef: Coords = undefined;

test('dist base case', () => {
  expect(dist(coordsUndef, coordsOrigin)).toBe(undefined);
  expect(dist(coordsOrigin, coordsOrigin)).toBe(0);
  expect(dist(coords100, coords100)).toBe(0);
})

test('dist different points', () => {
  //trivial
  expect(dist(coordsTop, coordsOrigin)).toBeCloseTo(100);
  expect(dist(coordsLeft, coordsOrigin)).toBeCloseTo(100);
  expect(dist(coordsLeft, coords100)).toBeCloseTo(100);

  //use pythag to roughly calculate
  expect(dist(coordsOrigin, coords100)).toBeCloseTo(141.4, 1);
  expect(dist(coordsUgly1, coordsOrigin)).toBeCloseTo(168.7, 1);
  expect(dist(coordsUgly1, coordsUgly2)).toBeCloseTo(122.8, 1)

})

//negatives shouldn't impact the distance.
test('dist with negatives', () => {
  expect(dist(coordsTopNegative, coordsOrigin)).toBeCloseTo(100);
  expect(dist(coordsLeftNegative, coordsOrigin)).toBeCloseTo(100);
  expect(dist(coordsLeftNegative, coords100Negative)).toBeCloseTo(100);
  expect (dist(coordsUgly3, coordsUgly3)).toBeCloseTo(826.6, 1)
})


