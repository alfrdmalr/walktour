import { Dims, Coords, getElementCoords, isDefaultScrollingElement } from "./dom";

export function getViewportHeight(root: Element): number {
  return root.clientHeight;
}

export function getViewportWidth(root: Element): number {
  return root.clientWidth;
}

export function getViewportDims(root: Element): Dims {
  return {
    width: getViewportWidth(root),
    height: getViewportHeight(root)
  }
}

export function getViewportStart(root: Element): Coords {
  if (isDefaultScrollingElement(root)) {
    return {
      x: 0,
      y: 0
    }
  } else {
    return getElementCoords(root);
  }
}

export function getViewportEnd(root: Element): Coords {
  return {
    x: getViewportWidth(root),
    y: getViewportHeight(root)
  }
}