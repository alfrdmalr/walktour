import { Coords, dist, Dims, areaDiff } from "./dom";
import { getTargetPosition } from "./positioning";
import { isElementInView } from "./viewport";

//miscellaneous tour utilities

export function debounce<T extends any[]>(f: (...args: T) => void) {
  let functionCall: number;

  console.log('debounce called')

  return (...args: T) => {
    if (functionCall) {
      console.log('function canceled')
      window.cancelAnimationFrame(functionCall);
    }

    console.log('function called')
    functionCall = window.requestAnimationFrame(() => f(...args));
  }
}

export function getIdString(base: string, identifier?: string): string {
  return `${base}${identifier ? `-${identifier}` : ``}`
}

export function shouldUpdate(tourRoot: Element, tooltip: HTMLElement, target: HTMLElement, targetPosition: Coords, targetSize: Dims, rerenderTolerance: number): boolean {
  if (!tourRoot || !tooltip) {
    return false; // bail if these aren't present; need them for calculations
  }

  // if the target appeared/disappeared or if the tooltip is off screen, update
  if ((!target && targetPosition) || (target && !targetPosition) || !isElementInView(tourRoot, tooltip)) {
    return true;
  }

  // if neither target nor target position are defined, bail
  if (!target && !targetPosition) {
    return false;
  }

  const currentTargetSize: Dims = { width: target.getBoundingClientRect().width, height: target.getBoundingClientRect().height }; //TODO getelementdims
  const currentTargetPosition: Coords = getTargetPosition(tourRoot, target);

  const sizeChanged: boolean = areaDiff(currentTargetSize, targetSize) > rerenderTolerance;
  const positionChanged: boolean = dist(currentTargetPosition, targetPosition) > rerenderTolerance;

  return sizeChanged || positionChanged;
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
  customSetListener?: (update: () => void) => void, customRemoveListener?: (update: () => void) => void) => {
  removeListener(callbackRef.current, customRemoveListener);

  addListener(callback, customSetListener);
  callbackRef.current = callback;
}