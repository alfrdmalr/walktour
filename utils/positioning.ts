
enum CardinalAlignment {
  EAST = 'east',
  SOUTH = 'south',
  WEST = 'west',
  NORTH = 'north',
  CENTER = 'center',
  EASTNORTH = 'eastnorth',
  EASTSOUTH = 'eastsouth',
  SOUTHEAST = 'southeast',
  SOUTHWEST = 'southwest',
  WESTSOUTH = 'westsouth',
  WESTNORTH = 'westnorth',
  NORTHWEST = 'northwest',
  NORTHEAST = 'northeast'
}

export interface Coords {
  x: number;
  y: number;
}

interface CardinalCoords {
  alignment: CardinalAlignment;
  coords: Coords;
}

function getViewportHeight() {
  return Math.max(document.documentElement.clientHeight, window.innerHeight);
}

function getViewportWidth() {
  return Math.max(document.documentElement.clientWidth, window.innerWidth);
}

function addScrollOffset(coords: Coords): Coords {
  return {
    x: coords.x + (document.documentElement.scrollLeft || window.pageXOffset),
    y: coords.y + (document.documentElement.scrollTop || window.pageYOffset)
  }
}

export function getElementCoords(element: ClientRect, adjustForScroll: boolean = true): Coords {
  if (!adjustForScroll) {
    return {
      x: element.left,
      y: element.top
    }
  }

  return addScrollOffset({ x: element.left, y: element.top })
}

function getCenterCoords(element?: ClientRect): Coords {
  const xOffset: number = element ? element.width / 2 : 0;
  const yOffset: number = element ? element.height / 2 : 0;
  return addScrollOffset({
    x: (getViewportWidth() / 2) - xOffset,
    y: (getViewportHeight() / 2) - yOffset
  })
}

function getTooltipPositionCandidates(targetData: ClientRect, tooltipData: ClientRect, padding: number, buffer: number, includeAllPositions?: boolean): CardinalCoords[] {
  if (!targetData || !tooltipData) {
    return;
  }

  const coords: Coords = getElementCoords(targetData);
  const centerX: number = coords.x - (Math.abs(tooltipData.width - targetData.width) / 2);
  const centerY: number = coords.y - (Math.abs(tooltipData.height - targetData.height) / 2);
  const eastOffset: number = coords.x + targetData.width + padding + buffer;
  const southOffset: number = coords.y + targetData.height + padding + buffer;
  const westOffset: number = coords.x - tooltipData.width - padding - buffer;
  const northOffset: number = coords.y - tooltipData.height - padding - buffer;

  const east: Coords = { x: eastOffset, y: centerY }
  const south: Coords = { x: centerX, y: southOffset }
  const west: Coords = { x: westOffset, y: centerY };
  const north: Coords = { x: centerX, y: northOffset };
  const center: Coords = getCenterCoords(tooltipData);

  const standardPositions = [
    { alignment: CardinalAlignment.EAST, coords: east },
    { alignment: CardinalAlignment.SOUTH, coords: south },
    { alignment: CardinalAlignment.WEST, coords: west },
    { alignment: CardinalAlignment.NORTH, coords: north },
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
      { alignment: CardinalAlignment.EASTNORTH, coords: eastNorth },
      { alignment: CardinalAlignment.EASTSOUTH, coords: eastSouth },
      { alignment: CardinalAlignment.SOUTHEAST, coords: southEast },
      { alignment: CardinalAlignment.SOUTHWEST, coords: southWest },
      { alignment: CardinalAlignment.WESTSOUTH, coords: westSouth },
      { alignment: CardinalAlignment.WESTNORTH, coords: westNorth },
      { alignment: CardinalAlignment.NORTHWEST, coords: northWest },
      { alignment: CardinalAlignment.NORTHEAST, coords: northEast }
    ]
  }

  return [
    ...standardPositions,
    ...additionalPositions,
    { alignment: CardinalAlignment.CENTER, coords: center }
  ]
}

function isElementInView(elementData: ClientRect, atPosition?: Coords): boolean {
  const position: Coords = atPosition || getElementCoords(elementData);
  const scrollOffsets: Coords = addScrollOffset({ x: 0, y: 0 })
  const xVisibility: boolean = position.x >= scrollOffsets.x && (position.x + elementData.width) <= getViewportWidth();
  const yVisibility: boolean = position.y >= scrollOffsets.y && (position.y + elementData.height) <= getViewportHeight();

  return xVisibility && yVisibility;
}

function chooseBestTooltipPosition(tooltip: ClientRect, candidates: CardinalCoords[]): Coords {
  for (let i: number = 0; i < candidates.length; i++) {
    const pos: CardinalCoords = candidates[i];
    if (isElementInView(tooltip, pos.coords)) {
      return pos.coords;
    }
  }
}

export function getTooltipPosition(targetData: ClientRect, tooltipData: ClientRect, padding: number = 0, buffer: number = 0): Coords {
  return chooseBestTooltipPosition(tooltipData, 
      getTooltipPositionCandidates(targetData, tooltipData, padding, buffer, true)) ||
    getCenterCoords(tooltipData); //if no position can be determined, default to the center of the screen
}

