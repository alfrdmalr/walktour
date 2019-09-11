import * as React from 'react';
import { Coords, getElementCoords, addAppropriateOffset } from "../positioning";

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
        boxShadow: '0 0 0 9999px rgb(0,0,0,0.6)',
        borderRadius: roundedCutout ? '5px' : 0,
        pointerEvents: disableMaskInteraction ? 'auto' : 'none',
        zIndex: zIndex
      }}
    />
  </>
  );
}
