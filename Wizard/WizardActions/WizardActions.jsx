import React from 'react';
import PropTypes from 'prop-types';
import './WizardActions.scss';

const WizardActions = ({
    show, isShowBackButton, backStep, nextStep, disableNextStepButton,
}) => {

    function BackStepButton() {
        if (isShowBackButton) {
            return (
                <button
                    className="button button_link"
                    onClick={() => backStep()}
                >
                    Back
                </button>
            );
        }
        return null;
    }

    if (show) {
        return (
            <div className="WizardActions">
                <BackStepButton />
                <button
                    className="button button_primary"
                    onClick={() => nextStep()}
                    disabled={disableNextStepButton}
                >
                    Next
                </button>
            </div>
        );
    }
    return null;
};

WizardActions.propTypes = {
    show: PropTypes.bool.isRequired,
    isShowBackButton: PropTypes.bool.isRequired,
    backStep: PropTypes.func.isRequired,
    nextStep: PropTypes.func.isRequired,
    disableNextStepButton: PropTypes.bool.isRequired,
};

export default WizardActions;
