import * as React from 'react';
import { Coords, Dims } from '../utils/dom';
import { getViewportScrollDims } from '../utils/viewport';

export interface MaskOptions {
  targetInfo?: {
    coords: Coords,
    dims: Dims
  };
  padding: number;
  close: () => void;
  tourRoot: Element;
  disableMaskInteraction?: boolean;
  disableCloseOnClick?: boolean;
  maskId: string;
}

export function Mask(props: MaskOptions): JSX.Element {
  const { targetInfo, disableMaskInteraction, padding, tourRoot, close, disableCloseOnClick, maskId } = props;
  const {width: containerWidth, height: containerHeight} = getViewportScrollDims(tourRoot);
  const pathId = `clip-path-${maskId}`;

  const getCutoutPoints = (target?: {coords: Coords, dims: Dims}): string => {
    if (!target) {
      return '';
    }

    const {
      dims,
      coords
    } = target;

    const cutoutTop: number = coords.y - padding;
    const cutoutLeft: number = coords.x - padding;
    const cutoutRight: number = coords.x + dims.width + padding;
    const cutoutBottom: number = coords.y + dims.height + padding;

    return `0 0, 
            0 ${containerHeight}, 
            ${cutoutLeft} ${containerHeight}, 
            ${cutoutLeft} ${cutoutTop}, 
            ${cutoutRight} ${cutoutTop}, 
            ${cutoutRight} ${cutoutBottom}, 
            ${cutoutLeft} ${cutoutBottom}, 
            ${cutoutLeft} ${containerHeight}, 
            ${containerWidth} ${containerHeight}, 
            ${containerWidth} 0`;
  }

  const svgStyle: React.CSSProperties = {
    height: containerHeight,
    width: containerWidth,
    pointerEvents: disableMaskInteraction ? 'auto' : 'none',
  }

  return (
    <svg style={svgStyle}>
      {targetInfo &&
        <defs>
          <clipPath id={pathId}>
            <polygon points={getCutoutPoints(targetInfo)}
            />
          </clipPath>
        </defs>
      }

      <rect
        onClick={disableCloseOnClick ? undefined : close}
        x={0}
        y={0}
        width={containerWidth}
        height={containerHeight}
        fill='black'
        fillOpacity={0.3}
        pointerEvents='auto'
        clipPath={targetInfo ? `url(#${pathId})` : undefined}
      />
    </svg>
  );
}
