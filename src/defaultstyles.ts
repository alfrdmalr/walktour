import { CSSProperties } from "react";


// this file and it's contents are temporary: this logic is moved here to clean up the index.tsx file during refactoring and will be relocated
interface DefaultStyles {
  container: CSSProperties;
  footer: CSSProperties;
  title: CSSProperties;
  description: CSSProperties;
  info: CSSProperties;
  stepsCount: CSSProperties;
  pin: CSSProperties;
  pinLine: CSSProperties;
  wrapper: CSSProperties;
  primaryButton: CSSProperties;
  secondaryButton: CSSProperties;
  tertiaryButton: CSSProperties;
  disabledButton: CSSProperties;
}
const baseButtonStyle: React.CSSProperties = {
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
};

export const defaultStyles: DefaultStyles = {
  container: {
    maxWidth: 500,
    backgroundColor: 'white',
    padding: 10,
    zIndex: 2,
    position: 'relative',
    borderRadius: '5px',
    fontFamily: 'Roboto, sans-serif',
    boxShadow: '0 3px 8px 0 rgba(0,0,0,.25)',
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
  primaryButton: {
    ...baseButtonStyle,
    backgroundColor: "#0084ff",
    color: "#ffffff"
  },
  secondaryButton: {
    ...baseButtonStyle,
    backgroundColor: `transparent`,
    color: "#025c53",
    border: "solid 1px #025c53"
  },
  tertiaryButton: {
    ...baseButtonStyle,
    backgroundColor: "#8400ff",
    color: "#fff",
    border: "solid 1px #8400ff"

  },
  disabledButton: {
    ...baseButtonStyle,
    backgroundColor: "#bebebe",
    color: "#989898",
    cursor: "default"
  },
  wrapper: {
    position: 'absolute',
    zIndex: 99,
    transition: 'all 100ms ease',
  }
}