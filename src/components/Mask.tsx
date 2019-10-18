import * as React from 'react';
import { Coords, Dims, getElementDims } from '../utils/dom';
import { getTargetPosition } from '../utils/positioning';
import { getViewportScrollDims } from '../utils/viewport';

interface MaskProps {
  target: HTMLElement;
  padding: number;
  close: () => void;
  tourRoot: Element;
  disableMaskInteraction?: boolean;
  disableCloseOnClick?: boolean;
  disableMask?: boolean;
  maskId: string;
  
}

export function Mask(props: MaskProps): JSX.Element {
  const { target, disableMaskInteraction, padding, tourRoot, close, disableCloseOnClick, maskId, disableMask } = props;
  const {width: containerWidth, height: containerHeight} = getViewportScrollDims(tourRoot);
  const pathId = `clip-path-${maskId}`;


  const getCutoutPoints = (target: HTMLElement): string => {
    if (!target) {
      return;
    }

    const targetDims: Dims = getElementDims(target);
    const coords: Coords = getTargetPosition(tourRoot, target);

    const cutoutTop: number = coords.y - padding;
    const cutoutLeft: number = coords.x - padding;
    const cutoutRight: number = coords.x + targetDims.width + padding;
    const cutoutBottom: number = coords.y + targetDims.height + padding;

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
    visibility: disableMask ? 'hidden' : 'visible'
  }

  return (
    <svg style={svgStyle}>
      {target &&
        <defs>
          <clipPath id={pathId}>
            <polygon points={getCutoutPoints(target)}
            />
          </clipPath>
        </defs>
      }

      <rect
        onClick={disableCloseOnClick ? null : close}
        x={0}
        y={0}
        width={containerWidth}
        height={containerHeight}
        fill='black'
        fillOpacity={0.3}
        pointerEvents='auto'
        clipPath={target ? `url(#${pathId})` : null}
      />
    </svg>
  );
}