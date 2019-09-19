import { globalTourRoot } from "./components/Walktour";

export enum CardinalOrientation {
  EAST = 'east',
  SOUTH = 'south',
  WEST = 'west',
  NORTH = 'north',
  CENTER = 'center',
  EASTNORTH = 'east-north',
  EASTSOUTH = 'east-south',
  SOUTHEAST = 'south-east',
  SOUTHWEST = 'south-west',
  WESTSOUTH = 'west-south',
  WESTNORTH = 'west-north',
  NORTHWEST = 'north-west',
  NORTHEAST = 'north-east'
}

export interface Coords {
  x: number;
  y: number;
}

interface CardinalCoords {
  orientation: CardinalOrientation;
  coords: Coords;
}

interface GetTooltipPositionArgs {
  target: HTMLElement;
  tooltip: HTMLElement;
  padding: number;
  tooltipSeparation: number;
  orientationPreferences?: CardinalOrientation[];
  positionCandidateReducer?: (acc: Coords, cur: CardinalCoords, ind: number, arr: CardinalCoords[]) => Coords;
}

//helpers

function dist(a: Coords, b: Coords): number {
  return Math.sqrt(
    Math.pow((Math.abs(a.x - b.x)), 2) +
    Math.pow((Math.abs(a.y - b.y)), 2))
}

function getViewportHeight(): number {
  return globalTourRoot.clientHeight;
}

function getViewportWidth(): number {
  return globalTourRoot.clientWidth;
}

function getViewportStart(): Coords {
  if (document.body.isSameNode(globalTourRoot)) {
    return {
      x: 0,
      y: 0
    }
  } else {
    return getElementCoords(globalTourRoot);
  }
}


function getCurrentScrollOffset(): Coords {
  //use documentElement instead of body for scroll-related purposes 
  if (document.body.isSameNode(globalTourRoot)) {
    return {
      x: document.documentElement.scrollLeft,
      y: document.documentElement.scrollTop
    }
  } else {
    return {
      x: globalTourRoot.scrollLeft,
      y: globalTourRoot.scrollTop
    }
  }
}

function addScrollOffset(coords: Coords) {
  const curOffset: Coords = getCurrentScrollOffset();
  return {
    x: coords.x + curOffset.x,
    y: coords.y + curOffset.y
  }
}

function addAppropriateOffset(coords: Coords) {
  if (!document.body.isSameNode(globalTourRoot)) {
    const rootCoords: Coords = getElementCoords(globalTourRoot);
    return addScrollOffset({
      x: coords.x - rootCoords.x,
      y: coords.y - rootCoords.y
    })
  } else {
    return addScrollOffset(coords);
  }
}

function getElementCoords(element: Element): Coords {
  const elementData: ClientRect = element.getBoundingClientRect();
  let coords: Coords = { x: elementData.left, y: elementData.top }

  return coords;
}

function isElementInView(element: HTMLElement, atPosition?: Coords): boolean {
  const position: Coords = atPosition || getElementCoords(element);
  const elementData: ClientRect = element.getBoundingClientRect();
  const startCoords: Coords = getViewportStart();
  const xVisibility: boolean = (position.x >= startCoords.x) && (position.x + elementData.width) <= getViewportWidth();
  const yVisibility: boolean = (position.y >= startCoords.y) && (position.y + elementData.height) <= getViewportHeight();

  return xVisibility && yVisibility;
}

function getCenterCoords(element?: HTMLElement): Coords {
  const elementData: ClientRect = element && element.getBoundingClientRect();
  const xOffset: number = element && elementData ? elementData.width / 2 : 0;
  const yOffset: number = element && elementData ? elementData.height / 2 : 0;
  const startCoords: Coords = getViewportStart();
  return {
    x: startCoords.x + (getViewportWidth() / 2) - xOffset,
    y: startCoords.y + (getViewportHeight() / 2) - yOffset
  }
}

function scrollToElement(element: HTMLElement, centerElementInViewport?: boolean, padding?: number): void {
  const el: Coords = addAppropriateOffset(getElementCoords(element));
  const elementData: ClientRect = element.getBoundingClientRect();
  let xOffset: number = 0;
  let yOffset: number = 0;

  if (centerElementInViewport) {
    xOffset = (getViewportWidth() - elementData.width) / 2;
    yOffset = (getViewportHeight() - elementData.height) / 2;
  } else if (padding) {
    xOffset = padding;
    yOffset = padding;
  }

  const scrollOptions: ScrollToOptions = {
    top: el.y - yOffset, 
    left: el.x - xOffset,
    behavior: 'smooth'
  }

  //use documentElement instead of body for scrolling related calls
  if (document.body.isSameNode(globalTourRoot)) {
    document.documentElement.scrollTo(scrollOptions)
  } else {
    globalTourRoot.scrollTo(scrollOptions);
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

//tooltip positioning logic

function getTooltipPositionCandidates(target: HTMLElement, tooltip: HTMLElement, padding: number, tooltipDistance: number, includeAllPositions?: boolean): CardinalCoords[] {
  const targetData: ClientRect = target.getBoundingClientRect();
  const tooltipData: ClientRect = tooltip.getBoundingClientRect();
  if (!targetData || !tooltipData) {
    return;
  }

  const coords: Coords = getElementCoords(target);
  const centerX: number = coords.x - ((tooltipData.width - targetData.width) / 2);
  const centerY: number = coords.y - ((tooltipData.height - targetData.height) / 2);
  const eastOffset: number = coords.x + targetData.width + padding + tooltipDistance;
  const southOffset: number = coords.y + targetData.height + padding + tooltipDistance;
  const westOffset: number = coords.x - tooltipData.width - padding - tooltipDistance;
  const northOffset: number = coords.y - tooltipData.height - padding - tooltipDistance;

  const east: Coords = { x: eastOffset, y: centerY }
  const south: Coords = { x: centerX, y: southOffset }
  const west: Coords = { x: westOffset, y: centerY };
  const north: Coords = { x: centerX, y: northOffset };
  const center: Coords = getCenterCoords(tooltip);

  const standardPositions = [
    { orientation: CardinalOrientation.EAST, coords: east },
    { orientation: CardinalOrientation.SOUTH, coords: south },
    { orientation: CardinalOrientation.WEST, coords: west },
    { orientation: CardinalOrientation.NORTH, coords: north },
  ];

  let additionalPositions: CardinalCoords[];
  if (includeAllPositions) {
    const eastAlign: number = coords.x - (tooltipData.width - targetData.width) + padding;
    const southAlign: number = coords.y - (tooltipData.height - targetData.height) + padding;
    const westAlign: number = coords.x - padding;
    const northAlign: number = coords.y - padding;

    const eastNorth: Coords = { x: eastOffset, y: northAlign }
    const eastSouth: Coords = { x: eastOffset, y: southAlign }
    const southEast: Coords = { x: eastAlign, y: southOffset }
    const southWest: Coords = { x: westAlign, y: southOffset }
    const westSouth: Coords = { x: westOffset, y: southAlign }
    const westNorth: Coords = { x: westOffset, y: northAlign }
    const northWest: Coords = { x: westAlign, y: northOffset }
    const northEast: Coords = { x: eastAlign, y: northOffset }

    additionalPositions = [
      { orientation: CardinalOrientation.EASTNORTH, coords: eastNorth },
      { orientation: CardinalOrientation.EASTSOUTH, coords: eastSouth },
      { orientation: CardinalOrientation.SOUTHEAST, coords: southEast },
      { orientation: CardinalOrientation.SOUTHWEST, coords: southWest },
      { orientation: CardinalOrientation.WESTSOUTH, coords: westSouth },
      { orientation: CardinalOrientation.WESTNORTH, coords: westNorth },
      { orientation: CardinalOrientation.NORTHWEST, coords: northWest },
      { orientation: CardinalOrientation.NORTHEAST, coords: northEast }
    ]
  }

  return [
    ...standardPositions,
    ...additionalPositions,
    { orientation: CardinalOrientation.CENTER, coords: center }
  ]
}

// simple reducer who selects for coordinates closest to the current center of the viewport
function centerReducer(acc: Coords, cur: CardinalCoords, ind: number, arr: CardinalCoords[]): Coords {
 
  if (cur.orientation === CardinalOrientation.CENTER) { //ignore centered coords since those will always be closest to the center
    if (ind === arr.length - 1 && acc === undefined ) { //unless  we're at the end and we still haven't picked a coord
      return cur.coords;
    } else {
      return acc;
    }
  } else if (acc === undefined) {
    return cur.coords;
  } else {
    const center: Coords = getCenterCoords();
    if (dist(center, cur.coords) > dist(center, acc)) {
      return acc;
    } else {
      return cur.coords;
    }
  }
}

function chooseBestPosition(candidates: CardinalCoords[],
  reducer: (acc: Coords, cur: CardinalCoords, ind: number, arr: CardinalCoords[]) => Coords): Coords {
  return candidates.reduce(reducer, undefined);
}

export function getTooltipPosition(args: GetTooltipPositionArgs): Coords {
  const { target, tooltip, padding, tooltipSeparation, orientationPreferences, positionCandidateReducer} = args;

  if (!tooltip) {
    return;
  } else if (!target) {
    return addAppropriateOffset(getCenterCoords(tooltip));
  }

  const choosePositionFromPreferences = (): Coords => {
    const reducer = positionCandidateReducer || centerReducer;
    const candidates: CardinalCoords[] = getTooltipPositionCandidates(target, tooltip, padding, tooltipSeparation, true);
    if (!orientationPreferences || orientationPreferences.length === 0) {
      return chooseBestPosition(candidates, reducer);
    } else {
      const preferenceFilter = (cc: CardinalCoords) => orientationPreferences.indexOf(cc.orientation) !== -1;
      return chooseBestPosition(candidates.filter(preferenceFilter), reducer);
    }
  }

  const rawPosition: Coords = choosePositionFromPreferences(); //position relative to current viewport
  const adjustedPosition: Coords = addAppropriateOffset(rawPosition);

  if (isElementInView(target) && isElementInView(tooltip, rawPosition)) {
    return adjustedPosition;
  } else {
    scrollToElement(target, true);
    return adjustedPosition;
  }
}

export function getMaskPosition(target: HTMLElement): Coords {
  return addAppropriateOffset(getElementCoords(target));
}
