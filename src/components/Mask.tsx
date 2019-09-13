import * as React from 'react';
import { Coords, getMaskPosition } from "../positioning";

interface MaskProps {
  target: HTMLElement;
  padding: number;
  disableMaskInteraction?: boolean;
  disableCloseOnClick?: boolean;
  tourRoot: Element;
}

export function Mask(props: MaskProps): JSX.Element {
  const { target, disableMaskInteraction, padding, tourRoot } = props;

  const containerBottom: number = (tourRoot && !document.body.isSameNode(tourRoot)) ? tourRoot.scrollHeight : document.documentElement.scrollHeight;
  const containerRight: number = (tourRoot && !document.body.isSameNode(tourRoot)) ? tourRoot.scrollWidth : document.documentElement.scrollWidth;
  let maskStyle: React.CSSProperties = {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    pointerEvents: 'auto',
    top: 0,
    left: 0,
    height: containerBottom,
    width: containerRight,
  }

  if (!target) {
    return <div style={maskStyle} />
  }

  const targetData: ClientRect = target.getBoundingClientRect();
  const coords: Coords = getMaskPosition(target);

  const cutoutTop: number = coords.y - padding;
  const cutoutLeft: number = coords.x - padding;
  const cutoutRight: number = coords.x + targetData.width + padding;
  const cutoutBottom: number = coords.y + targetData.height + padding;

  const cutoutStyle: React.CSSProperties = {
    clipPath: `polygon(0px 0px, 0px ${containerBottom}px, ${cutoutLeft}px ${containerBottom}px, ${cutoutLeft}px ${cutoutTop}px, ${cutoutRight}px ${cutoutTop}px, ${cutoutRight}px ${cutoutBottom}px, ${cutoutLeft}px ${cutoutBottom}px, ${cutoutLeft}px ${containerBottom}px, ${containerRight}px ${containerBottom}px, ${containerRight}px 0px)`,
  }

  //cover the cutout to prevent interaction
  const blockInteractionStyle: React.CSSProperties = {
    position: 'absolute',
    pointerEvents: 'auto',
    top: cutoutTop,
    left: cutoutLeft,
    height: targetData.height + padding * 2,
    width: targetData.width + padding * 2
  }

  return (<>

    <div style={{ ...maskStyle, ...cutoutStyle }}>
      {disableMaskInteraction &&
        <div style={blockInteractionStyle} />}
    </div>
  </>
  );
}
