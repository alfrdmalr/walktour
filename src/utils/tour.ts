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