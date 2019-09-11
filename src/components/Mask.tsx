import * as React from 'react';
import { Coords, getElementCoords, addAppropriateOffset } from "../positioning";
import * as ReactDOM from 'react-dom';

interface MaskProps {
  target: HTMLElement;
  padding: number;
  zIndex: number;
  disableMaskInteraction?: boolean;
  roundedCutout?: boolean;
  offsetParent?: Element;
}

export function Mask(props: MaskProps): JSX.Element {
  const { target, disableMaskInteraction, padding, roundedCutout, offsetParent, zIndex } = { roundedCutout: true, ...props };
  if (!target) {
    return null;
  }

  const targetData: ClientRect = target.getBoundingClientRect();
  const coords: Coords = addAppropriateOffset(getElementCoords(target), offsetParent);

  const top: number = coords.y - padding;
  const left: number = coords.x - padding;
  const right: number = coords.x + targetData.width + padding;
  const bottom: number = coords.y + targetData.height + padding;

  return (<>
    <div
      style={{
        position: 'absolute',
        top: top,
        left: left,
        height: targetData.height + (padding * 2),
        width: targetData.width + (padding * 2),
        boxShadow: '0 0 0 9999px rgb(0,0,0,0.3)',
        borderRadius: roundedCutout ? '5px' : 0,
        pointerEvents: disableMaskInteraction ? 'auto' : 'none',
        zIndex: zIndex
      }}
    />
    <div style={{
      position: 'absolute',
      backgroundColor: 'rgba(0, 0, 255, 0.3)',
      top: 0,
      left: 0,
      height: '100%',
      width: '100%',
      clipPath: `polygon(0% 0%, 0% 100%, ${left}px 100%, ${left}px ${top}px, ${right}px ${top}px, ${right}px ${bottom}px, ${left}px ${bottom}px, ${left}px 100%, 100% 100%, 100% 0%)`,
    }}
    />
    </>
  );
}
