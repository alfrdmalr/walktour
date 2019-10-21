export interface Coords {
  x: number;
  y: number;
}

export interface Dims {
  width: number;
  height: number;
}

export function dist(a: Coords, b: Coords): number {
  if (!a || !b) {
    return;
  }

  return Math.sqrt(
    Math.pow((Math.abs(a.x - b.x)), 2) +
    Math.pow((Math.abs(a.y - b.y)), 2))
}

export function areaDiff(a: Dims, b: Dims): number {
  if (!a || !b) {
    return;
  }

  return Math.abs((a.height * a.width) - (b.height * b.width));
}

export function getElementCoords(element: Element): Coords {
  if (!element) {
    return;
  }
  const elementData: ClientRect = element.getBoundingClientRect();
  return {
    x: elementData.left,
    y: elementData.top
  }
}

export function getElementDims(element: Element): Dims {
  if (!element) {
    return;
  }
  const elementData = element.getBoundingClientRect();
  return {
    width: elementData.width,
    height: elementData.height
  }
}

//https://gist.github.com/gre/296291b8ce0d8fe6e1c3ea4f1d1c5c3b
export function getNearestScrollAncestor(element: Element): Element {
  const regex = /(auto|scroll)/;

  const style = (el: Element, prop: string) =>
    getComputedStyle(el, null).getPropertyValue(prop);

  const scroll = (el: Element) =>
    regex.test(
      style(el, "overflow") +
      style(el, "overflow-y") +
      style(el, "overflow-x"));

  if (!element || isDefaultScrollingElement(element)) {
    return getDefaultScrollingElement();
  } else {
    if (scroll(element)) {
      return element;
    } else {
      return getNearestScrollAncestor(element.parentElement)
    }
  }
}

//https://github.com/GreenGremlin/scroll-doc/blob/master/index.js
export function getDefaultScrollingElement(): Element {
  const windowStart: number = window.pageYOffset; //slightly better support than scrollY
  document.documentElement.scrollTop = windowStart + 1;
  if (window.pageXOffset > windowStart) {
    document.documentElement.scrollTop = windowStart; //reset
    return document.documentElement;
  } else {
    return document.scrollingElement || document.body;
  }
}

export function isDefaultScrollingElement(root: Element) {
  return root.isSameNode(document.body) || root.isSameNode(document.scrollingElement) || root.isSameNode(document.documentElement);
}

//if we're not putting the portal in a custom container, it needs to be at the body level
export function getValidPortalRoot(root: Element) {
  // check for the potential default scrolling elements that might be returned from the above function
  if (isDefaultScrollingElement(root)) {
    return document.body;
  } else {
    return root;
  }
}

export function getCombinedData(aCoords: Coords, aDims: Dims, bCoords: Coords, bDims: Dims): { coords: Coords, dims: Dims } {

  // generates similar data as getBoundingClientRect but using hypothetical positions
  const generateBounds = (coords: Coords, dims: Dims): {left: number, right: number, top: number, bottom: number} => {
    return {
      left: coords.x,
      right: coords.x + dims.width,
      top: coords.y,
      bottom: coords.y + dims.height
    }
  }

  const mostExtreme = (a: number, b: number, largest: boolean): number => {
    return (a > b)
      ? (largest ? a : b)
      : (largest ? b : a)
  }

  const aBounds = generateBounds(aCoords, aDims);
  const bBounds = generateBounds(bCoords, bDims);

  
  const left: number = mostExtreme(aBounds.left, bBounds.left, false);
  const right: number = mostExtreme(aBounds.right, bBounds.right, true);
  const top: number = mostExtreme(aBounds.top, bBounds.top, false);
  const bottom: number = mostExtreme(aBounds.bottom, bBounds.bottom, true);

  return {
    coords: {
      x: left,
      y: top
    },
    dims: {
      height: bottom - top,
      width: right - left
    }
  }
}

// determines if a can fit within b
export function fitsWithin(aDims: Dims, bDims: Dims) {
  return aDims.height <= bDims.height && aDims.width <= bDims.width;
}


