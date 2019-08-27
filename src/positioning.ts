
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

function getViewportHeight() {
  return Math.max(document.documentElement.clientHeight, window.innerHeight);
}

function getViewportWidth() {
  return Math.max(document.documentElement.clientWidth, window.innerWidth);
}

function addScrollOffset(coords: Coords): Coords {
  const curOffset: Coords = getCurrentScrollOffset();
  return {
    x: coords.x + curOffset.x,
    y: coords.y + curOffset.y
  }
}

function getCurrentScrollOffset(): Coords {
  return {
    x: document.documentElement.scrollLeft || window.pageXOffset,
    y: document.documentElement.scrollTop || window.pageYOffset
  }
}

export function getElementCoords(element: ClientRect, adjustForScroll: boolean): Coords {
  if (!adjustForScroll) {
    return {
      x: element.left,
      y: element.top
    }
  }

  return addScrollOffset({ x: element.left, y: element.top })
}

function isElementInView(elementData: ClientRect, atPosition?: Coords): boolean {
  const position: Coords = atPosition || getElementCoords(elementData, false);
  const xVisibility: boolean = (position.x >= 0) && (position.x + elementData.width) <= getViewportWidth();
  const yVisibility: boolean = (position.y >= 0) && (position.y + elementData.height) <= getViewportHeight();

  return xVisibility && yVisibility;
}

function getCenterCoords(element?: ClientRect): Coords {
  const xOffset: number = element ? element.width / 2 : 0;
  const yOffset: number = element ? element.height / 2 : 0;
  return addScrollOffset({
    x: (getViewportWidth() / 2) - xOffset,
    y: (getViewportHeight() / 2) - yOffset
  })
}

function scrollToElement(elementData: ClientRect, centerElementInViewport?: boolean, padding?: number): void {
  const el: Coords = getElementCoords(elementData, false);
  let xOffset: number = 0;
  let yOffset: number = 0;

  if (centerElementInViewport) {
    xOffset = (getViewportWidth() + elementData.width) / 2;
    yOffset = (getViewportHeight() + elementData.height) / 2;
  } else if (padding) {
    xOffset = padding;
    yOffset = padding;
  }

  window.scrollTo({
    top: el.y - yOffset,
    left: el.x - xOffset,
    behavior: 'smooth'
  })
}

function getTooltipPositionCandidates(targetData: ClientRect, tooltipData: ClientRect, padding: number, tooltipDistance: number, includeAllPositions?: boolean): CardinalCoords[] {
  if (!targetData || !tooltipData) {
    return;
  }

  const coords: Coords = getElementCoords(targetData, true);
  const centerX: number = coords.x - (Math.abs(tooltipData.width - targetData.width) / 2);
  const centerY: number = coords.y - (Math.abs(tooltipData.height - targetData.height) / 2);
  const eastOffset: number = coords.x + targetData.width + padding + tooltipDistance;
  const southOffset: number = coords.y + targetData.height + padding + tooltipDistance;
  const westOffset: number = coords.x - tooltipData.width - padding - tooltipDistance;
  const northOffset: number = coords.y - tooltipData.height - padding - tooltipDistance;

  const east: Coords = { x: eastOffset, y: centerY }
  const south: Coords = { x: centerX, y: southOffset }
  const west: Coords = { x: westOffset, y: centerY };
  const north: Coords = { x: centerX, y: northOffset };
  const center: Coords = getCenterCoords(tooltipData);

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

function dist(a: Coords, b: Coords): number {
  return Math.sqrt(
    Math.pow((Math.abs(a.x - b.x)), 2) +
    Math.pow((Math.abs(a.y - b.y)), 2))
} 

// simple reducer who selects for coordinates closest to the current center of the viewport
function centerReducer(acc: Coords, cur: CardinalCoords): Coords {
  if (cur.orientation === CardinalOrientation.CENTER) { //ignore centered coords since those will always be closest to the center
    return acc;
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

function chooseTooltipPositionWithReduce(tooltip: ClientRect, candidates: CardinalCoords[], 
  reducer?: (acc: Coords, cur: CardinalCoords, ind: number, arr: CardinalCoords[]) => Coords): Coords {
    const candidateReducer: (acc: Coords, cur: CardinalCoords, ind: number, arr: CardinalCoords[]) => Coords = reducer || centerReducer;


  return candidates.reduce(candidateReducer, undefined);
}

export function getTooltipPosition(targetData: ClientRect, tooltipData: ClientRect, padding: number, 
  tooltipDistance: number, orientationPreferences?: CardinalOrientation[]): Coords {

  const choosePosBasedOnPreferences = (): Coords => {
  const candidates: CardinalCoords[] = getTooltipPositionCandidates(targetData, tooltipData, padding, tooltipDistance, true);
    if (!orientationPreferences || orientationPreferences.length === 0) {
      return chooseTooltipPositionWithReduce(tooltipData, candidates);
    } else {
      const preferenceFilter = (cc: CardinalCoords) => orientationPreferences.indexOf(cc.orientation) !== -1;
      return chooseTooltipPositionWithReduce(tooltipData, candidates.filter(preferenceFilter));
    }
  }

  if (isElementInView(targetData)) {
    return choosePosBasedOnPreferences();
  } else {
    // scrollToElement(targetData, false, Math.max(tooltipData.height, tooltipData.width) + tooltipDistance + padding);
    scrollToElement(targetData, true);
    return choosePosBasedOnPreferences();
  }
}