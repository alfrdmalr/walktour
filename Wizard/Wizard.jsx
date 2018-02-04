import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './Wizard.scss';
import WizardActions from './WizardActions/WizardActions';
import WizardInfo from './WizardInfo/WizardInfo';

class Wizard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentStepNumber: 0,
            currentStep: props.rule[0],
            showWizard: props.show,
        };
        this.handleScroll = this.handleScroll.bind(this);
        this.props.checkFieldCompleted(this.state.currentStepNumber);
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    onNextStepButtonClick(step) {
        const currentStep = this.props.rule.indexOf(step);

        this.props.checkFieldCompleted(this.state.currentStepNumber + 1);

        this.setState((prevState, props) => {
            return {
                currentStepNumber: currentStep + 1,
                currentStep: props.rule[currentStep + 1],
                transition: 'all 100ms ease',
            };
        });
    }

    onBackStepButtonClick(step) {
        const currentStep = this.props.rule.indexOf(step);

        this.props.checkFieldCompleted(this.state.currentStepNumber - 1);

        this.setState((prevState, props) => {
            return {
                currentStepNumber: currentStep - 1,
                currentStep: props.rule[currentStep - 1],
                transition: 'all 100ms ease',
            };
        });
    }

    onShowWizardButtonClick() {
        this.setState({
            showWizard: true,
        });
    }

    onSkipButtonClick() {
        this.setState(() => {
            return {
                currentStepNumber: 0,
                currentStep: this.props.rule[0],
                showWizard: false,
            };
        });
    }

    getCoords(elementId) {
        const element = document.getElementById(elementId);
        const coordinates = element.getBoundingClientRect();

        return {
            top: coordinates.top + (coordinates.height / 2),
            left: (coordinates.left + coordinates.width),
        };
    }

    getStepsCount(array) {
        return array.length;
    }

    handleScroll() {
        this.setState((prevState) => {
            return {
                position: this.getCoords(prevState.currentStep.elementId),
                transition: null,
            };
        });
    }

    render() {
        if (this.state.showWizard) {
            const currentStep = this.state.currentStep;
            const currentStepNumber = this.state.currentStepNumber + 1;
            const stepsCount = this.getStepsCount(this.props.rule);
            const title = currentStep.title;
            const description = currentStep.description;
            const tips = currentStep.tips ? <div className="Wizard__tips">{currentStep.tips}</div> : '';
            const position = this.getCoords(currentStep.elementId);
            const transition = this.state.transition;
            return (
                <div
                    className="Wizard"
                    style={
                        {
                            ...position,
                            transition,
                        }
                    }

                >
                    <div className="Wizard__content">
                        <button
                            className="Wizard__close"
                            onClick={() => this.onSkipButtonClick()}
                        >
                            <i className="fa fa-close" />
                        </button>

                        <WizardInfo
                            show={this.props.rule.length !== this.state.currentStepNumber + 1}
                            steps={this.props.rule}
                            currentStepNumber={currentStepNumber}
                            stepsCount={stepsCount}
                        />

                        <div className="Wizard__title">
                            {title}
                        </div>

                        <div
                            className="Wizard__description"
                            dangerouslySetInnerHTML={{__html: description}}
                        />

                        {tips}

                        <WizardActions
                            show={this.props.rule.length !== this.state.currentStepNumber + 1}
                            isShowBackButton={currentStepNumber !== 1}
                            backStep={() => this.onBackStepButtonClick(currentStep)}
                            nextStep={() => this.onNextStepButtonClick(currentStep)}
                            disableNextStepButton={this.props.disableNextStepButton}
                        />
                    </div>
                    <div
                        className="Wizard__pin"
                        style={
                            {
                                ...position,
                                transition,
                            }
                        }
                    />
                </div>
            );
        }
        return (
            <button
                className="Wizard__show-button"
                onClick={() => this.onShowWizardButtonClick()}
            >
                <i className="fa fa-magic" />
                Wizard
            </button>
        );

    }
}

Wizard.propTypes = {
    rule: PropTypes.array.isRequired,
    show: PropTypes.bool.isRequired,
    checkFieldCompleted: PropTypes.func.isRequired,
    disableNextStepButton: PropTypes.bool.isRequired,
};

export default Wizard;
