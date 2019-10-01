export interface Coords {
  x: number;
  y: number;
}

export interface Dims {
  width: number;
  height: number;
}

export function dist(a: Coords, b: Coords): number {
  return Math.sqrt(
    Math.pow((Math.abs(a.x - b.x)), 2) +
    Math.pow((Math.abs(a.y - b.y)), 2))
}

export function getElementCoords(element: Element): Coords {
  if (!element) {
    return;
  }
  const elementData: ClientRect = element.getBoundingClientRect();
  let coords: Coords = { x: elementData.left, y: elementData.top }

  return coords;
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

  if (!element || element.isSameNode(document.body)) {
    return document.body;
  } else {
    if (scroll(element)) {
      return element;
    } else {
      return getNearestScrollAncestor(element.parentElement)
    }
  }
}