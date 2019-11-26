import { Coords, dist, Dims, areaDiff, fitsWithin, getElementDims, getEdgeFocusables } from "./dom";
import { getTargetPosition } from "./positioning";
import { isElementInView, getViewportDims } from "./viewport";
import { TAB_KEYCODE } from "./constants";

//miscellaneous tour utilities

export function debounce<T extends any[]>(f: (...args: T) => void) {
  let functionCall: number;
  return (...args: T) => {
    if (functionCall) {
      window.cancelAnimationFrame(functionCall);
    }
    functionCall = window.requestAnimationFrame(() => f(...args));
  }
}

export function getIdString(base: string, identifier?: string): string {
  return `${base}${identifier ? `-${identifier}` : ``}`
}

export function shouldUpdate(tourRoot: Element, tooltip: HTMLElement, target: HTMLElement, disableAutoScroll: boolean, targetPosition: Coords, targetSize: Dims, rerenderTolerance: number): boolean {
  if (!tourRoot || !tooltip) {
    return false; // bail if these aren't present; need them for calculations
  } else if (!isElementInView(tourRoot, tooltip)) {
    return fitsWithin(getElementDims(tooltip), getViewportDims(tourRoot)); //if the tooltip is off screen, update if it CAN fit
  } else if (!target && !targetPosition && !targetSize) {
    return false;  // if no target info exists, bail
  } else if ((!target && targetPosition) || (target && !targetPosition)) {
    return true; // if the target appeared/disappeared 
  } else if (!isElementInView(tourRoot, target) && fitsWithin(getElementDims(target), getViewportDims(tourRoot))) {
    return !disableAutoScroll; // if the target is offscreen and can fit on the screen (and we're allowed to scroll)
  } else {
    const currentTargetSize: Dims = { width: target.getBoundingClientRect().width, height: target.getBoundingClientRect().height }; //TODO getelementdims
    const currentTargetPosition: Coords = getTargetPosition(tourRoot, target);
    const sizeChanged: boolean = areaDiff(currentTargetSize, targetSize) > rerenderTolerance;
    const positionChanged: boolean = dist(currentTargetPosition, targetPosition) > rerenderTolerance;

    return sizeChanged || positionChanged;
  }
}

export function setTargetWatcher(callback: () => void, interval: number): (() => void) {
  const intervalId: number = window.setInterval(callback, interval);

  return () => window.clearInterval(intervalId);
}

export interface SetTourUpdateListenerArgs {
  update: () => void;
  customSetListener?: (update: () => void) => void;
  customRemoveListener?: (update: () => void) => void;
  event?: string; // default is resize event
}

export function setTourUpdateListener(args: SetTourUpdateListenerArgs) {
  const {update, customSetListener, customRemoveListener, event } = {event: 'resize', ...args}
  if (customSetListener && customRemoveListener) {
    customSetListener(update);
    return () => customRemoveListener(update);
  } else {
    window.addEventListener(event, update)
    return () => window.removeEventListener(event, update);
  }
}

interface FocusTrapArgs {
  start: HTMLElement;
  end: HTMLElement;
  beforeStart?: HTMLElement;
  afterEnd?: HTMLElement;
  // element that should be excluded from the focus trap but may obtain focus.
  // any focus changes from this element will be directed back to the trap.
  // behavior is based on "verify address" example from https://www.w3.org/TR/wai-aria-practices/examples/dialog-modal/dialog.html
  lightningRod?: HTMLElement;
}

// helper function to create a keyboard focus trap, potentially including multiple elements
function getFocusTrapHandler(args: FocusTrapArgs): (e: KeyboardEvent) => void {
  const { start, end, beforeStart, afterEnd, lightningRod } = args;
  return (e: KeyboardEvent) => {
    if (e.keyCode === TAB_KEYCODE) {
      if (e.shiftKey && e.target === start) {
        e.preventDefault();
        beforeStart ? beforeStart.focus() : end.focus();
      } else if (!e.shiftKey && e.target === end) {
        e.preventDefault();
        afterEnd ? afterEnd.focus() : start.focus();
      } else if (e.target === lightningRod) {
        e.preventDefault();
        start.focus();
      }
    }
  }
}

export const setFocusTrap = (tooltipContainer: HTMLElement, target?: HTMLElement, disableMaskInteraction?: boolean): (() => void) => {
  if (!tooltipContainer) {
    return;
  }

  const { start: tooltipFirst, end: tooltipLast } = getEdgeFocusables(tooltipContainer, tooltipContainer);
  const { start: targetFirst, end: targetLast } = getEdgeFocusables(undefined, target, true);

  let tooltipBeforeStart: HTMLElement;
  let tooltipAfterEnd: HTMLElement;
  let targetTrapHandler: (e: KeyboardEvent) => void;

  if (target && !disableMaskInteraction && targetFirst && targetLast) {
    tooltipAfterEnd = targetFirst;
    tooltipBeforeStart = targetLast;
    targetTrapHandler = getFocusTrapHandler({ start: targetFirst, end: targetLast, beforeStart: tooltipLast, afterEnd: tooltipFirst })
    target.addEventListener('keydown', targetTrapHandler);
  }

  const tooltipTrapHandler = getFocusTrapHandler({ start: tooltipFirst, end: tooltipLast, beforeStart: tooltipBeforeStart, afterEnd: tooltipAfterEnd, lightningRod: tooltipContainer });
  tooltipContainer.addEventListener('keydown', tooltipTrapHandler);

  return () => {
    if (target) {
      target.removeEventListener('keydown', targetTrapHandler);
    }
    
    tooltipContainer.removeEventListener('keydown', tooltipTrapHandler);
  }
}
