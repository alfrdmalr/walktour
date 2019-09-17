import * as React from 'react';
import { WalktourLogic } from './Walktour';
import { WalktourStyles, defaultStyles } from '../defaultstyles';

interface TooltipProps extends WalktourLogic {
  nextLabel: string;
  prevLabel: string;
  closeLabel: string;
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
      customFooterRenderer
    },
    stepIndex,
    allSteps,
    styles,
    nextLabel,
    prevLabel,
    closeLabel,
  } = {
    styles: defaultStyles,
    ...props
  };

  const tooltipStyle: React.CSSProperties = {
    ...styles.tooltip,
  }
  
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
            <button onClick={close} style={styles.tertiaryButton}>
              {closeLabel}
            </button>
            <button
              onClick={prev}
              disabled={stepIndex === 0}
              style={stepIndex !== 0 ? styles.secondaryButton : styles.disabledButton}
            >
              {prevLabel}
            </button>
            <button
              onClick={next}
              disabled={stepIndex + 1 === allSteps.length}
              style={stepIndex + 1 !== allSteps.length ? styles.primaryButton : styles.disabledButton}
            >
              {nextLabel}
            </button>
          </div>
        )}
    </div>
  )
}