import { dist, Coords, getElementCoords, getNearestScrollAncestor } from '../../src/utils/dom';
import { shallow, mount } from 'enzyme';
import * as React from 'react';

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
    expect(dist(coordsUgly3, coordsUgly1)).toBeCloseTo(826.6, 1)
  })
})

describe('get element coords', () => {
  test('origin', () => {
    mockGBCR({ x: 0, y: 0 })
    expect(getElementCoords(document.createElement('div'))).toStrictEqual({ x: 0, y: 0 })
  })

  test('positioned', () => {
    mockGBCR({ x: 30, y: 90 })
    expect(getElementCoords(document.createElement('div'))).toStrictEqual({ x: 30, y: 90 })
  })
})

describe('get nearest scroll ancestor', () => {
  const page = mount(<div id='parent'>
    <div id='child-1'>
      <button id="btn">button</button>
    </div>
    <div id='child-2' style={{overflow: 'scroll'}}>
      <div id='grandchild'>
        <div id='great-grandchild'>
          <div id='great-great-grandchild'>child</div>
        </div>
      </div>
      <div id='grandchild-2' style={{overflowY: 'auto'}}>
        <div id="great-grandchild-2">overflow y child</div>>
      </div>
      <div id='grandchild-3' style={{overflowX: 'hidden'}}>
        <div>overflow hidden child</div>>
      </div>
    </div>
  </div>);

  test('default scroll ancestor is document body', () => {
    const button = page.find('#btn');
    expect(getNearestScrollAncestor(button.getDOMNode())).toBe(document.body);

  })

  test('nested descendant', () => {
    const nestedChild = page.find('#great-great-grandchild');
    expect(getNearestScrollAncestor(nestedChild.getDOMNode())).not.toBe(document.body);
    expect(getNearestScrollAncestor(nestedChild.getDOMNode())).toBe(page.find('#child-2').getDOMNode())
  })

  test('direct descendant', () => {
    const grandchild = page.find('#grandchild')
    expect(getNearestScrollAncestor(grandchild.getDOMNode())).toBe(page.find('#child-2').getDOMNode()); 
  })

  test('self', () => {
    const greatGrandchild = page.find('#great-grandchild-2');
    const grandchildScroll = page.find('#grandchild-2')
    expect(getNearestScrollAncestor(grandchildScroll.getDOMNode())).toBe(grandchildScroll.getDOMNode()); //self
    expect(getNearestScrollAncestor(greatGrandchild.getDOMNode())).toBe(grandchildScroll.getDOMNode()); //immediate descendant
  })
  

})

// have to mock getBoundingClientRect because jsdom isn't actually rendered
function mockGBCR(args: { x?: number, y?: number, w?: number, h?: number }): void {
  const { x, y, h, w } = args;
  Element.prototype.getBoundingClientRect = jest.fn(() => {
    return {
      width: w,
      height: h,
      top: y,
      left: x,
      right: x + w,
      bottom: y + h,
      x: x,
      y: y
    }
  })
}