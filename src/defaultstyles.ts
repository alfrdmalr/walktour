import { CSSProperties } from "react";


// this file and it's contents are temporary: this logic is moved here to clean up the index.tsx file during refactoring and will be relocated
interface DefaultStyles {
  container: CSSProperties;
  closeButton: CSSProperties;
  footer: CSSProperties;
  title: CSSProperties;
  description: CSSProperties;
  info: CSSProperties;
  stepsCount: CSSProperties;
  pin: CSSProperties;
  pinLine: CSSProperties;
  button: CSSProperties;
  wrapper: CSSProperties;
}

export const defaultStyles: DefaultStyles = {
  container: {
    width: 226,
    minHeight: 100,
    backgroundColor: 'white',
    padding: 10,
    transform: 'translate(22px, -50px)',
    zIndex: 2,
    position: 'relative',
    borderRadius: '5px',
    fontFamily: 'Roboto, sans-serif',
    boxShadow: '0 3px 8px 0 rgba(0,0,0,.25)',
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 10,
    padding: 0,
    cursor: 'pointer',
    color: 'grey',
    border: 0,
    outline: 'none',
    background: 'transparent',
  },
  footer: {
    padding: '10px 0 0',
    textAlign: 'right',
    display: 'flex',
  },
  title: {
    marginBottom: 8,
    letterSpacing: 'normal',
    color: '#000000',
    fontSize: 24,
    fontStyle: 'normal',
  },
  description: {
    marginBottom: 15,
    color: '#4d4d4d',
    fontSize: 12,
    lineHeight: 1.25,
  },
  info: {
    display: 'flex',
    fontSize: 18,
    width: '87%',
    marginBottom: 10,
    alignItems: 'center',

  },
  stepsCount: {
    width: '35%',
    fontSize: 12,
  },
  pin: {
    position: 'absolute',
    zIndex: 2,
    width: 15,
    height: 15,
    borderRadius: 50,
    background: '#1787fc',
    boxShadow: '0 0 0 2px white',
    top: '-7px',
    left: '-7px',
  },
  pinLine: {
    height: 1,
    width: 25,
    top: 1,
    position: 'absolute',
    zIndex: 1,
    background: '#1787fc',
  },
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 300,
    cursor: 'pointer',
    height: 32,
    lineHeight: '32px',
    padding: '0 16px',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    border: 0,
    borderRadius: 3,
    outline: 'none',
    backgroundColor: '#0084ff',
    color: '#fff',
    fontSize: 14,
    marginLeft: 10,
  },
  wrapper: {
    position: 'absolute',
    zIndex: 99,
    transition: 'all 100ms ease',
  }
}