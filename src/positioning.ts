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

export interface Dims {
  width: number;
  height: number;
}

export interface OrientationCoords {
  orientation: CardinalOrientation;
  coords: Coords;
}

interface GetTooltipPositionArgs {
  target: HTMLElement;
  tooltip: HTMLElement;
  padding: number;
  tooltipSeparation: number;
  tourRoot: Element;
  orientationPreferences?: CardinalOrientation[];
  getPositionFromCandidates?: (candidates: OrientationCoords[]) => Coords;
}

//helpers

export function dist(a: Coords, b: Coords): number {
  if (!a || !b) {
    return;
  }
  return Math.sqrt(
    Math.pow((Math.abs(a.x - b.x)), 2) +
    Math.pow((Math.abs(a.y - b.y)), 2))
}

function getViewportHeight(root: Element): number {
  if (document.body.isSameNode(root)) {
    return Math.max(root.clientHeight,
      document.documentElement.clientHeight,
      window.innerHeight);
  } else {
    return root.clientHeight;
  }
}

function getViewportWidth(root: Element): number {
  if (document.body.isSameNode(root)) {
    return Math.max(root.clientWidth,
      document.documentElement.clientWidth,
      window.innerWidth);
  } else {
    return root.clientWidth;
  }
}

function getViewportDims(root: Element): Dims {
  return {
    width: getViewportWidth(root),
    height: getViewportHeight(root)
  }
}

function getViewportStart(root: Element): Coords {
  if (document.body.isSameNode(root)) {
    return {
      x: 0,
      y: 0
    }
  } else {
    return getElementCoords(root);
  }
}

function getViewportEnd(root: Element): Coords {
  return {
    x: getViewportWidth(root),
    y: getViewportHeight(root)
  }
}

function getCurrentScrollOffset(root: Element): Coords {
  //use documentElement instead of body for scroll-related purposes 
  if (document.body.isSameNode(root)) {
    return {
      x: document.documentElement.scrollLeft,
      y: document.documentElement.scrollTop
    }
  } else {
    return {
      x: root.scrollLeft,
      y: root.scrollTop
    }
  }
}

function addScrollOffset(root: Element, coords: Coords) {
  const curOffset: Coords = getCurrentScrollOffset(root);
  return {
    x: coords.x + curOffset.x,
    y: coords.y + curOffset.y
  }
}

function addAppropriateOffset(root: Element, coords: Coords) {
  if (!coords || !root) {
    return;
  }

  if (!document.body.isSameNode(root)) {
    const rootCoords: Coords = getElementCoords(root);
    return addScrollOffset(root, {
      x: coords.x - rootCoords.x,
      y: coords.y - rootCoords.y
    })
  } else {
    return addScrollOffset(root, coords);
  }
}

function getElementCoords(element: Element): Coords {
  if (!element) {
    return;
  }
  const elementData: ClientRect = element.getBoundingClientRect();
  let coords: Coords = { x: elementData.left, y: elementData.top }

  return coords;
}

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

//apply a common offset calculation where b is centered relative to a. If b is larger than a, the result is that a will be centered within b.
function applyCenterOffset(origin: Coords, a: Dims, b: Dims): Coords {
  return {
    x: origin.x + (a.width / 2) - (b.width / 2),
    y: origin.y + (a.height / 2) - (b.height / 2)
  }
}

// get the coordinates the viewport would need to be placed for the element to be centered
function centerElementInViewport(root: Element, element: HTMLElement): Coords {
  const elementData: ClientRect = element.getBoundingClientRect();
  const elementDims: Dims = {width: elementData.width, height: elementData.height}
  const elementCoords: Coords = getElementCoords(element);

  return applyCenterOffset(elementCoords, elementDims, getViewportDims(root))
}

// get the center coord of the viewport. If element is provided, the return value is the origin 
// which would align that element's center with the viewport center
function getViewportCenter(root: Element, element?: HTMLElement): Coords {
  if (!root) {
    return;
  }
  const elementData: ClientRect = element && element.getBoundingClientRect();
  const startCoords: Coords = getViewportStart(root);
  const viewportDims: Dims = getViewportDims(root);
  const elementDims: Dims = elementData
    ? { width: elementData.width, height: elementData.height }
    : {width: 0, height: 0}

  return applyCenterOffset(startCoords, viewportDims, elementDims);
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

function getTooltipPositionCandidates(root: Element, target: HTMLElement, tooltip: HTMLElement, padding: number, tooltipDistance: number, includeAllPositions?: boolean): OrientationCoords[] {
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
  const center: Coords = getViewportCenter(root, tooltip);

  const standardPositions = [
    { orientation: CardinalOrientation.EAST, coords: east },
    { orientation: CardinalOrientation.SOUTH, coords: south },
    { orientation: CardinalOrientation.WEST, coords: west },
    { orientation: CardinalOrientation.NORTH, coords: north },
  ];

  let additionalPositions: OrientationCoords[];
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
function getCenterReducer(root: Element, tooltip: HTMLElement): ((acc: Coords, cur: OrientationCoords, ind: number, arr: OrientationCoords[]) => Coords) {
  const center: Coords = getViewportCenter(root, tooltip);

  return (acc: Coords, cur: OrientationCoords, ind: number, arr: OrientationCoords[]): Coords => {
    if (cur.orientation === CardinalOrientation.CENTER) { //ignore centered coords since those will always be closest to the center
      if (ind === arr.length - 1 && acc === undefined) { //unless  we're at the end and we still haven't picked a coord
        return cur.coords;
      } else {
        return acc;
      }
    } else if (acc === undefined) {
      return cur.coords;
    } else {
      if (dist(center, cur.coords) > dist(center, acc)) {
        return acc;
      } else {
        return cur.coords;
      }
    }
  }
}

function filterPreferredCandidates(candidates: OrientationCoords[], orientationPreferences?: CardinalOrientation[]): OrientationCoords[] {
  if (!orientationPreferences || orientationPreferences.length === 0) {
    return candidates;
  } else {
    const preferenceFilter = (cc: OrientationCoords) => orientationPreferences.indexOf(cc.orientation) !== -1;
    return candidates.filter(preferenceFilter);
  }
}

export function getTooltipPosition(args: GetTooltipPositionArgs): Coords {
  const { target, tooltip, padding, tooltipSeparation, orientationPreferences, getPositionFromCandidates, tourRoot } = args;
  const defaultPosition: Coords = addAppropriateOffset(tourRoot, getViewportCenter(tourRoot, tooltip));

  if (!tooltip || !tourRoot) {
    return;
  } else if (!target) {
    return defaultPosition;
  }

  const candidates: OrientationCoords[] = getTooltipPositionCandidates(tourRoot, target, tooltip, padding, tooltipSeparation, true);
  const choosePosition = getPositionFromCandidates || ((candidates: OrientationCoords[]) => candidates.reduce(getCenterReducer(tourRoot, tooltip), undefined));

  const rawPosition: Coords = choosePosition(filterPreferredCandidates(candidates, orientationPreferences)); //position relative to current viewport

  if (!rawPosition) {
    return defaultPosition;
  }

  return addAppropriateOffset(tourRoot, rawPosition);
}

export function getTargetPosition(root: Element, target: HTMLElement): Coords {
  return addAppropriateOffset(root, getElementCoords(target));
}
