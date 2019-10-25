import * as React from 'react';
import { WalktourLogic } from './Walktour';
import { WalktourStyles, defaultStyles } from '../defaultstyles';

interface TooltipProps extends WalktourLogic {
  styles?: WalktourStyles;
}

export function Tooltip(props: TooltipProps) {
  const {
    next,
    prev,
    close,
    stepContent: {
      title,
      description,
      customTitleRenderer,
      customDescriptionRenderer,
      customFooterRenderer,
      disableClose,
      disableNext,
      disablePrev,
      nextLabel,
      prevLabel,
      closeLabel,
    },
    stepIndex,
    allSteps,
    styles,
  } = {
    styles: defaultStyles,
    ...props
  };

  const tooltipStyle: React.CSSProperties = {
    ...styles.tooltip,
  }

  const prevDisabled: boolean = disablePrev !== undefined ? disablePrev : stepIndex === 0;
  const nextDisabled: boolean = disableNext !== undefined ? disableNext : stepIndex + 1 === allSteps.length;

  return (
    <div style={tooltipStyle}>
      {customTitleRenderer
        ? customTitleRenderer(title, props)
        : (title &&
          <div style={styles.title}>
            {title}
          </div>
        )
      }

      {customDescriptionRenderer
        ? customDescriptionRenderer(description, props)
        : (
          <div style={styles.description}>
            {description}
          </div>
        )
      }

      {customFooterRenderer
        ? customFooterRenderer(props)
        : (
          <div style={styles.footer}>
            <button 
            onClick={() => close()} 
            style={styles.tertiaryButton}
            disabled={disableClose}
            >
              {closeLabel || "close"}
            </button>
            <button
              onClick={prev}
              disabled={prevDisabled}
              style={prevDisabled ? styles.disabledButton : styles.secondaryButton}
            >
              {prevLabel || "prev"}
            </button>
            <button
              onClick={next}
              disabled={nextDisabled}
              style={nextDisabled ? styles.disabledButton : styles.primaryButton}
            >
              {nextLabel || "next"}
            </button>
          </div>
        )}
    </div>
  )
}