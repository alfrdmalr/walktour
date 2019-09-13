import * as React from 'react';
import { Coords, getElementCoords, addAppropriateOffset } from "../positioning";
import * as ReactDOM from 'react-dom';

interface MaskProps {
  target: HTMLElement;
  padding: number;
  zIndex: number;
  disableMaskInteraction?: boolean;
  roundedCutout?: boolean;
  tourRoot: Element;
}

export function Mask(props: MaskProps): JSX.Element {
  const { target, disableMaskInteraction, padding, roundedCutout, zIndex, tourRoot } = { roundedCutout: true, ...props };
  if (!target) {
    return null;
  }

  const targetData: ClientRect = target.getBoundingClientRect();
  const coords: Coords = addAppropriateOffset(getElementCoords(target));

  const cutoutTop: number = coords.y - padding;
  const cutoutLeft: number = coords.x - padding;
  const cutoutRight: number = coords.x + targetData.width + padding;
  const cutoutBottom: number = coords.y + targetData.height + padding;
  const containerBottom: number = (tourRoot && !document.body.isSameNode(tourRoot)) ? tourRoot.scrollHeight : document.documentElement.scrollHeight;
  const containerRight: number = (tourRoot && !document.body.isSameNode(tourRoot)) ? tourRoot.scrollWidth : document.documentElement.scrollWidth;

  return (<>

    <div style={{
      position: 'absolute',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      pointerEvents: 'auto',
      top: 0,
      left: 0,
      height: containerBottom,
      width: containerRight,
      clipPath: `polygon(0px 0px, 0px ${containerBottom}px, ${cutoutLeft}px ${containerBottom}px, ${cutoutLeft}px ${cutoutTop}px, ${cutoutRight}px ${cutoutTop}px, ${cutoutRight}px ${cutoutBottom}px, ${cutoutLeft}px ${cutoutBottom}px, ${cutoutLeft}px ${containerBottom}px, ${containerRight}px ${containerBottom}px, ${containerRight}px 0px)`,
    }} />
  </>
  );
}
