import React from 'react';
import PropTypes from 'prop-types';
import './WizardInfo.scss';

const WizardInfo = ({
    show, steps, currentStepNumber, stepsCount,
}) => {
    if (show) {
        return (
            <div className="WizardInfo">
                <div className="WizardInfo__step-count">
                    {currentStepNumber} of {stepsCount}
                </div>
                <div className="WizardInfo__steps">
                    {steps.map((step) => {
                        return (
                            <div
                                className={`WizardInfo__step WizardInfo__step_${currentStepNumber > steps.indexOf(step) ? 'passed' : ''}`}
                                key={`step-${step.elementId}`}
                            />
                        );
                    })}
                </div>
            </div>
        );
    }
    return null;

};

WizardInfo.propTypes = {
    show: PropTypes.bool.isRequired,
    steps: PropTypes.array.isRequired,
    currentStepNumber: PropTypes.number.isRequired,
    stepsCount: PropTypes.number.isRequired,
};

export default WizardInfo;
