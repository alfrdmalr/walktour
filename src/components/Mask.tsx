import * as React from 'react';
import { Coords } from '../utils/dom';
import { getTargetPosition } from '../utils/positioning';

interface MaskProps {
  target: HTMLElement;
  padding: number;
  close: () => void;
  tourRoot: Element;
  disableMaskInteraction?: boolean;
  disableCloseOnClick?: boolean;
  maskId: string;
}

export function Mask(props: MaskProps): JSX.Element {
  const { target, disableMaskInteraction, padding, tourRoot, close, disableCloseOnClick, maskId } = props;

  const containerBottom: number = (tourRoot && !document.body.isSameNode(tourRoot)) ? tourRoot.scrollHeight : document.documentElement.scrollHeight;
  const containerRight: number = (tourRoot && !document.body.isSameNode(tourRoot)) ? tourRoot.scrollWidth : document.documentElement.scrollWidth;

  const pathId = `clip-path-${maskId}`;


  const getCutoutPoints = (target: HTMLElement): string => {
    if (!target) {
      return;
    }

    const targetData: ClientRect = target.getBoundingClientRect();
    const coords: Coords = getTargetPosition(tourRoot, target);

    const cutoutTop: number = coords.y - padding;
    const cutoutLeft: number = coords.x - padding;
    const cutoutRight: number = coords.x + targetData.width + padding;
    const cutoutBottom: number = coords.y + targetData.height + padding;

    return `0 0, 
            0 ${containerBottom}, 
            ${cutoutLeft} ${containerBottom}, 
            ${cutoutLeft} ${cutoutTop}, 
            ${cutoutRight} ${cutoutTop}, 
            ${cutoutRight} ${cutoutBottom}, 
            ${cutoutLeft} ${cutoutBottom}, 
            ${cutoutLeft} ${containerBottom}, 
            ${containerRight} ${containerBottom}, 
            ${containerRight} 0`;
  }

  const svgStyle: React.CSSProperties = {
    height: containerBottom,
    width: containerRight,
    pointerEvents: disableMaskInteraction ? 'auto' : 'none'
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
        width={containerRight}
        height={containerBottom}
        fill='black'
        fillOpacity={0.3}
        pointerEvents='auto'
        clipPath={target ? `url(#${pathId})` : null}
      />
    </svg>
  );
}