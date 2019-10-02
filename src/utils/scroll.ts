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

  const scrollOptions: ScrollToOptions = {
    top: coords.y,
    left: coords.x,
    behavior: 'smooth'
  }

  //use documentElement instead of body for scrolling related calls
  if (document.body.isSameNode(root)) {
    document.documentElement.scrollTo(scrollOptions)
  } else {
    root.scrollTo(scrollOptions);
  }
}