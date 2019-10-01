import { Dims, Coords, getElementCoords } from "./dom";

export function getViewportHeight(root: Element): number {
  if (document.body.isSameNode(root)) {
    return Math.max(root.clientHeight,
      document.documentElement.clientHeight,
      window.innerHeight);
  } else {
    return root.clientHeight;
  }
}

export function getViewportWidth(root: Element): number {
  if (document.body.isSameNode(root)) {
    return Math.max(root.clientWidth,
      document.documentElement.clientWidth,
      window.innerWidth);
  } else {
    return root.clientWidth;
  }
}

export function getViewportDims(root: Element): Dims {
  return {
    width: getViewportWidth(root),
    height: getViewportHeight(root)
  }
}

export function getViewportStart(root: Element): Coords {
  if (document.body.isSameNode(root)) {
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