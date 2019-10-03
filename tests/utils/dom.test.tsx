import { dist, Coords, getElementCoords, getNearestScrollAncestor } from '../../src/utils/dom';
import { shallow, mount } from 'enzyme';
import * as React from 'react';
import { mockGBCR } from '../mocks';

// Testing "dist" function, which calculates the distance between two points
describe('dist', () => {
  const coordsOrigin: Coords = { x: 0, y: 0 }
  const coords100: Coords = { x: 100, y: 100 }
  const coordsTop: Coords = { x: 100, y: 0 }
  const coordsLeft: Coords = { x: 0, y: 100 }
  const coords100Negative: Coords = { x: -100, y: -100 }
  const coordsTopNegative: Coords = { x: -100, y: 0 }
  const coordsLeftNegative: Coords = { x: 0, y: -100 }
  const coordsUgly1: Coords = { x: 65.2, y: 155.6 }
  const coordsUgly2: Coords = { x: 0.003, y: 51.5 }
  const coordsUgly3: Coords = { x: 678.12, y: -399 }
  const coordsUndef: Coords = undefined;

  test('base case', () => {
    expect(dist(coordsUndef, coordsOrigin)).toBe(undefined);
    expect(dist(coordsOrigin, coordsOrigin)).toBe(0);
    expect(dist(coords100, coords100)).toBe(0);
  })

  test('different points', () => {
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
  test('negative coordinates', () => {
    expect(dist(coordsTopNegative, coordsOrigin)).toBeCloseTo(100);
    expect(dist(coordsLeftNegative, coordsOrigin)).toBeCloseTo(100);
    expect(dist(coordsLeftNegative, coords100Negative)).toBeCloseTo(100);
    expect(dist(coordsUgly3, coordsUgly1)).toBeCloseTo(826.6, 1)
  })
})

// testing "getElementCoords", which returns the coordinates of the element on the screen.
describe('getElementCoords', () => {
  test('origin', () => {
    mockGBCR({ x: 0, y: 0 })
    expect(getElementCoords(document.createElement('div'))).toStrictEqual({ x: 0, y: 0 })
  })

  test('positioned', () => {
    mockGBCR({ x: 30, y: 90 })
    expect(getElementCoords(document.createElement('div'))).toStrictEqual({ x: 30, y: 90 })
  })
})

// testing "getNearestScrollAncestor", which crawls up the dom tree looking for the nearest element that has scrolling capabilities.
describe('getNearestScrollAncestor', () => {
  const page = mount(<div id='parent'>
    <div id='child-1'>
      <button id="btn">button</button>
    </div>
    <div id='child-2' style={{ overflow: 'scroll' }}>
      <div id='grandchild'>
        <div id='great-grandchild'>
          <div id='great-great-grandchild' style={{overflow: 'visible'}}>
            <div id="great-great-great-grandchild"></div>
          </div>
        </div>
      </div>
      <div id='grandchild-2' style={{ overflowY: 'auto' }}>
        <div id="great-grandchild-2">overflow y child</div>>
      </div>
      <div id='grandchild-3' style={{ overflowX: 'hidden' }}>
        <div id="great-grandchild-3">overflow hidden child</div>>
      </div>
      <div id='child-3' style={{ overflowX: 'visible', overflowY: 'scroll' }}>
        <div id="grandchild-4"></div>
      </div>

    </div>
  </div>);

  test('default scroll ancestor is document body', () => {
    const button = page.find('#btn').getDOMNode();
    expect(getNearestScrollAncestor(button)).toBe(document.body);

  })

  test('nested descendant finds correct element', () => {
    const nestedChild = page.find('#great-grandchild').getDOMNode();;
    const c2 = page.find('#child-2').getDOMNode()

    expect(getNearestScrollAncestor(nestedChild)).not.toBe(document.body);
    expect(getNearestScrollAncestor(nestedChild)).toBe(c2)
  })

  test('overflow visible doesnt count as a scroll container', () => {
    const g3gc = page.find('#great-great-great-grandchild').getDOMNode()
    const gggc = page.find('#great-great-grandchild').getDOMNode();
    expect(getNearestScrollAncestor(g3gc)).not.toBe(gggc);
    expect(getNearestScrollAncestor(g3gc)).toBe(getNearestScrollAncestor(gggc)); //they should have the same ancestor, whatever it may be
  }) 

  test('direct descendant returns parent', () => {
    const grandchild = page.find('#grandchild').getDOMNode()
    const c2 = page.find('#child-2').getDOMNode();

    expect(getNearestScrollAncestor(grandchild)).toBe(page.find('#child-2').getDOMNode());
  })

  test('self returns self', () => {
    const greatGrandchild = page.find('#great-grandchild-2').getDOMNode();
    const grandchildScroll = page.find('#grandchild-2').getDOMNode();

    expect(getNearestScrollAncestor(grandchildScroll)).toBe(grandchildScroll) //self
    expect(getNearestScrollAncestor(greatGrandchild)).toBe(grandchildScroll); //immediate descendant
  })

  test('overflow hidden doesnt count', () => {
    const ggc3 = page.find('#great-grandchild-3').getDOMNode();
    const g3 = page.find('#grandchild-3').getDOMNode();

    expect(getNearestScrollAncestor(ggc3)).not.toBe(g3); //overflow is hidden, don't put the tour there
  })

  test('only one axis needs to allow scrolling', () => {
    const gc4 = page.find('#grandchild-4').getDOMNode();
    const c3 = page.find('#child-3').getDOMNode();

    expect(getNearestScrollAncestor(gc4)).toBe(c3);
  })
})