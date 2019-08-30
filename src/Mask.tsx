import * as React from 'react';
import { Coords, getElementCoords } from "./positioning";

interface MaskProps {
  target: ClientRect;
  disableMaskInteraction?: boolean;
  padding?: number;
  roundedCutout?: boolean;
}

export function Mask(props: MaskProps): JSX.Element {
  const {target, disableMaskInteraction, padding, roundedCutout} = {roundedCutout: true, ...props};
  if (!target) {
    return null;
  }
  
  const coords: Coords = getElementCoords(target, true);
  return (
    <div
      style={{
        position: 'absolute',
        top: coords.y - padding,
        left: coords.x - padding,
        height: target.height + (padding * 2),
        width: target.width + (padding * 2),
        boxShadow: '0 0 0 9999px rgb(0,0,0,0.6)',
        borderRadius: roundedCutout ? '5px' : 0,
        pointerEvents: disableMaskInteraction ? 'auto' : 'none'
      }}
    >
    </div>
  );
}