import { Dims, Coords, getElementCoords, isDefaultScrollingElement, getElementDims } from "./dom";
import { addAppropriateOffset } from "./offset";

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

export function getViewportScrollHeight(root: Element): number {
  return root.scrollHeight;
}

export function getViewportScrollWidth(root: Element): number {
  return root.scrollWidth;
}

export function getViewportScrollDims(root: Element): Dims {
  return {
    width: getViewportScrollWidth(root),
    height: getViewportScrollHeight(root)
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


export function isElementInView(root: Element, element: HTMLElement, atPosition?: Coords, needsAdjusting?: boolean): boolean {
  if (!root || !element) {
    return false;
  }
  const explicitPosition: Coords = atPosition && (needsAdjusting ? addAppropriateOffset(root, atPosition) : atPosition)
  const position: Coords = explicitPosition || addAppropriateOffset(root, getElementCoords(element));
  const elementDims: Dims = getElementDims(element);
  const startCoords: Coords = addAppropriateOffset(root, getViewportStart(root));
  const endCoords: Coords = addAppropriateOffset(root, getViewportEnd(root));
  const xVisibility: boolean = (position.x >= startCoords.x) && ((position.x + elementDims.width) <= endCoords.x);
  const yVisibility: boolean = (position.y >= startCoords.y) && ((position.y + elementDims.height) <= endCoords.y);

  return xVisibility && yVisibility;
}