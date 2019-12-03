import { Coords, dist, Dims, areaDiff, fitsWithin, getElementDims, getEdgeFocusables } from "./dom";
import { getTargetPosition } from "./positioning";
import { isElementInView, getViewportDims } from "./viewport";
import { TAB_KEYCODE } from "./constants";

//miscellaneous tour utilities

export function debounce<T extends any[]>(f: (...args: T) => void, interval: number = 300) {
  let timeoutId: number;
  return (...args: T) => {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }
    timeoutId = window.setTimeout(() => f(...args), interval);
  }
}

export function getIdString(base: string, identifier?: string): string {
  return `${base}${identifier ? `-${identifier}` : ``}`
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
  const { update, customSetListener, customRemoveListener, event } = { event: 'resize', ...args }
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

interface NaiveShouldScrollArgs {
  root: Element;
  tooltip: HTMLElement;
  tooltipPosition?: Coords;
  target: HTMLElement;
}

function naiveShouldScroll(args: NaiveShouldScrollArgs): boolean {
  const { root, tooltip, tooltipPosition, target } = args;

  if (!isElementInView(root, tooltip, tooltipPosition)) {
    return true;
  }

  if (!isElementInView(root, target)) {
    return fitsWithin(getElementDims(target), getViewportDims(root));
  }

  return false;
}
export interface ShouldScrollArgs extends NaiveShouldScrollArgs {
  disableAutoScroll: boolean;
}

export function shouldScroll(args: ShouldScrollArgs): boolean {
  const { root, tooltip, target, disableAutoScroll } = args;
  if (!root || !tooltip || !target) {
    return false;
  }

  if (disableAutoScroll) {
    return false;
  }

  return naiveShouldScroll({ ...args });
}

export interface TargetChangedArgs {
  root: Element;
  target: HTMLElement;
  targetCoords: Coords;
  targetDims: Dims;
  rerenderTolerance: number;
}
export function targetChanged(args: TargetChangedArgs): boolean {
  const { root, target, targetCoords, targetDims, rerenderTolerance } = args;
  if (!target && !targetCoords && !targetDims) {
    return false;
  }

  // when the target / target data are out of sync. usually due to a movingTarget, i.e. the target arg is more up to date than the pos/dims args
  if ((!target && targetCoords && targetDims) || (target && !targetCoords && !targetDims)) {
    return true;
  }

  const currentTargetSize: Dims = getElementDims(target);
  const currentTargetPosition: Coords = getTargetPosition(root, target);

  const sizeChanged: boolean = areaDiff(currentTargetSize, targetDims) > rerenderTolerance;
  const positionChanged: boolean = dist(currentTargetPosition, targetCoords) > rerenderTolerance;

  return sizeChanged || positionChanged;
}

export interface ShouldUpdateArgs extends TargetChangedArgs, ShouldScrollArgs { }

export function shouldUpdate(args: ShouldUpdateArgs): boolean {
  const { root, tooltip } = args;
  if (!root || !tooltip) {
    return false; // bail if these aren't present; need them for calculations
  }

  return targetChanged({ ...args }) || shouldScroll({ ...args }); // future todo: if no target, check if tooltip is correctly positioned (null selector -> tooltip out of place)
}