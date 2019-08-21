interface CardinalCoords {
  east: Coords;
  south: Coords;
  west: Coords;
  north: Coords;
  center: Coords;
  eastNorth?: Coords;
  eastSouth?: Coords;
  southEast?: Coords;
  southWest?: Coords;
  westSouth?: Coords;
  westNorth?: Coords;
  northWest?: Coords;
  northEast?: Coords;
}

export interface Coords {
  x: number;
  y: number;
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

  return addScrollOffset({x: element.left, y: element.top})
}

function getCenterPosition(element?: ClientRect): Coords {
  const xOffset: number = element ? element.width / 2 : 0;
  const yOffset: number = element ? element.height / 2 : 0;
  return addScrollOffset({
    x: (Math.max(document.documentElement.clientWidth, window.innerWidth) / 2) - xOffset,
    y: (Math.max(document.documentElement.clientHeight, window.innerHeight) / 2) - yOffset
  })
}

function getTooltipPositionCandidates(targetData: ClientRect, tooltipData: ClientRect, padding: number, buffer: number, includeAllPositions?: boolean): CardinalCoords {
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
  const center: Coords = getCenterPosition(tooltipData);
  const standardPositions = { east, south, west, north, center };

  let additionalPositions: Partial<CardinalCoords>;
  if (includeAllPositions) {
    const eastAlign: number = coords.x - (tooltipData.width - targetData.width) + padding;
    const southAlign: number = coords.y + targetData.height + padding + buffer;
    const westAlign: number = coords.x - padding;
    const northAlign: number = coords.y - padding;

    const eastNorth: Coords = {
      x: eastOffset,
      y: northAlign
    }

    const eastSouth: Coords = {
      x: eastOffset,
      y: southAlign
    }

    const southEast: Coords = {
      x: eastAlign,
      y: southOffset
    }

    const southWest: Coords = {
      x: westAlign,
      y: southOffset
    }

    const westSouth: Coords = {
      x: westOffset,
      y: southAlign
    }

    const westNorth: Coords = {
      x: westOffset,
      y: northAlign
    }

    const northWest: Coords = {
      x: westAlign,
      y: northOffset
    }

    const northEast: Coords = {
      x: eastAlign,
      y: northOffset
    }

    additionalPositions = {
      eastNorth,
      eastSouth,
      southEast,
      southWest,
      westSouth,
      westNorth,
      northWest,
      northEast,
    }
  }

  return {
    ...standardPositions,
    ...additionalPositions
  }
}

function chooseBestTooltipPosition(candidates: CardinalCoords): Coords {
  console.log(Object.keys(candidates));
  
  return candidates.center; //temporarily we indiscriminately return east, to mirror original functionality
  
}

export function getTooltipPosition(targetData: ClientRect, tooltipData: ClientRect, padding: number = 0, buffer: number = 0): Coords {
  if (targetData) {
    return (chooseBestTooltipPosition(getTooltipPositionCandidates(targetData, tooltipData, padding, buffer)));
  } else {
    return getCenterPosition(tooltipData);
  }
}
