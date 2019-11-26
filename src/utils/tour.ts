import { Coords, dist, Dims, areaDiff, fitsWithin, getElementDims, getEdgeFocusables, getFocusableElements } from "./dom";
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

export function clearWatcher(watcherId: React.MutableRefObject<number>): void {
  window.clearInterval(watcherId.current);
  watcherId.current = null;
}

export function addListener(callback: () => void, setCustomListener?: (update: () => void) => void, defaultEvent: string = 'resize'): void {
  if (setCustomListener) {
    setCustomListener(callback);
  } else {
    window.addEventListener(defaultEvent, callback)
  }
}

export function removeListener(callback: () => void, customRemoveListener?: (update: () => void) => void, defaultEvent: string = 'resize'): void {
  if (customRemoveListener) {
    customRemoveListener(callback);
  } else {
    window.removeEventListener(defaultEvent, callback);
  }
}

export const refreshListeners = (callback: () => void, callbackRef: React.MutableRefObject<() => void>,
  customSetListener?: (update: () => void) => void, customRemoveListener?: (update: () => void) => void): void => {
  removeListener(callbackRef.current, customRemoveListener);

  addListener(callback, customSetListener);
  callbackRef.current = callback;
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
      } else if (e.target === lightningRod && start !== lightningRod) {
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
  let removeTargetTrap: () => void = () => { };

  if (target && !disableMaskInteraction && targetFirst && targetLast) {
    tooltipAfterEnd = targetFirst;
    tooltipBeforeStart = targetLast;

    let tabPressed: boolean = false;
    let shiftPressed: boolean = false;
    const targetFocusables = getFocusableElements(target);

    const tabDown = (e: KeyboardEvent) => {
      if (e.keyCode === TAB_KEYCODE) {
        tabPressed = true;
        shiftPressed = e.shiftKey
      }
    }

    const tabUp = (e: KeyboardEvent) => {
      if (e.keyCode === TAB_KEYCODE) {
        tabPressed = false;
      }
    }

    const focusOut = (e: FocusEvent) => {
      if (targetFocusables.indexOf(e.relatedTarget as HTMLElement) < 0) {
        if (tabPressed) {
          if (shiftPressed) {
            tooltipLast.focus();
          } else {
            tooltipFirst.focus();
          }
        }
      }
    }

    // watch for target blur (not traditional blur or focusout - we want to know when the focus leaves the tree of target/its children, but don't care about
    // lost focus if we stay within that tree). When that happens, we set the focus back to the tooltip
    target.addEventListener('keydown', tabDown)
    target.addEventListener('focusout', focusOut);
    target.addEventListener('keyup', tabUp)

    removeTargetTrap = () => {
      target.removeEventListener('keydown', tabDown);
      target.removeEventListener('keyup', tabUp);
      target.removeEventListener('focusout', focusOut);
    }
  }

  const tooltipTrapHandler = getFocusTrapHandler({ start: tooltipFirst, end: tooltipLast, beforeStart: tooltipBeforeStart, afterEnd: tooltipAfterEnd, lightningRod: tooltipContainer });
  tooltipContainer.addEventListener('keydown', tooltipTrapHandler);

  return () => {
    tooltipContainer.removeEventListener('keydown', tooltipTrapHandler);
    removeTargetTrap();
  }
}
