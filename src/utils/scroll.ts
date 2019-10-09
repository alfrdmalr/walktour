import { Coords, getElementCoords } from "./dom";
import { addAppropriateOffset, centerElementInViewport } from "./offset";
import { getViewportStart, getViewportEnd } from "./viewport";

export function isElementInView(root: Element, element: HTMLElement, atPosition?: Coords, needsAdjusting?: boolean): boolean {
  if (!root || !element) {
    return false;
  }
  const explicitPosition: Coords = atPosition && (needsAdjusting ? addAppropriateOffset(root, atPosition) : atPosition)
  const position: Coords = explicitPosition || addAppropriateOffset(root, getElementCoords(element));
  const elementData: ClientRect = element.getBoundingClientRect();
  const startCoords: Coords = addAppropriateOffset(root, getViewportStart(root));
  const endCoords: Coords = addAppropriateOffset(root, getViewportEnd(root));
  const xVisibility: boolean = (position.x >= startCoords.x) && ((position.x + elementData.width) <= endCoords.x);
  const yVisibility: boolean = (position.y >= startCoords.y) && ((position.y + elementData.height) <= endCoords.y);

  return xVisibility && yVisibility;
}

export function scrollToElement(root: Element, element: HTMLElement): void {
  if (!root || !element) {
    return;
  }

  const coords = addAppropriateOffset(root, centerElementInViewport(root, element));

  scrollTo(root, coords);
}

export function scrollTo(root: Element, destination: Coords): void {
  // check if the 'scrollBehavior' property is supported. Support for this property is consistent
  // with support for scrollToOptions, and if it's supported we can scroll smoothly
  const smoothScrollingIsSupported = 'scrollBehavior' in document.documentElement.style;
  if (smoothScrollingIsSupported) {
    const scrollOptions: ScrollToOptions = {
      top: destination.y,
      left: destination.x,
      behavior: 'smooth'
    }

    root.scrollTo(scrollOptions);
  } else {
    root.scrollTop = destination.y;
    root.scrollLeft = destination.x;
  }
}