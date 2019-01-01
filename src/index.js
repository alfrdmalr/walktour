import React, { Component } from 'react'
import PropTypes from 'prop-types'

const styles = {
    wizard: {
        width: 226,
        minHeight: 100,
        backgroundColor: 'white',
        padding: 10,
        border: '1px solid #d9d9d9',
        boxShadow: '0 3px 8px 0 rgba(0,0,0,.15)',
        transform: 'translate(22px, -50px)',
        zIndex: 2,
        position: 'relative',
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
    },
    title: {
        marginBottom: 8,
        letterSpacing: 'normal',
        color: '#000000',
        fontSize: 14,
        fontWeight: 600,
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
        width: '87%',
        marginBottom: 10,
        alignItems: 'center',
    },
    stepsCount: {
        width: '35%',
        fontSize: 12,
    },
    steps: {
        display: 'flex',
        width: 100,
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
}

class Wizard extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isShow: props.isShow,
            transition: null,
        }

        this.currentStepNumber = 0

        this.handleScroll = this.handleScroll.bind(this)
        this.onStepButtonClick = this.onStepButtonClick.bind(this)
        this.onCloseButtonClick = this.onCloseButtonClick.bind(this)
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll)
        this.setState({
            position: getCoords(getStep(0, this.props.rule).elementId),
        })
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll)
    }

    onStepButtonClick(stepNumber) {
        this.currentStepNumber = stepNumber

        this.setState({
            position: getCoords(getStep(stepNumber, this.props.rule).elementId),
            transition: 'all 100ms ease',
        })
    }

    onCloseButtonClick() {
        this.setState({
            isShow: false,
        })
    }

    handleScroll() {
        this.setState({
            position: getCoords(getStep(this.currentStepNumber, this.props.rule).elementId),
            transition: null,
        })
    }

    render() {
        if (!this.state.isShow) {
            return null
        }

        const wrapperStyle = {
            position: 'fixed',
            zIndex: 99,
            transition: this.state.transition,
            ...this.state.position,
        }

        const currentStepContent = getStep(this.currentStepNumber, this.props.rule)

        return (
            <div style={wrapperStyle}>
                <button onClick={() => this.onCloseButtonClick()} style={styles.closeButton}>
                    X
                </button>

                <div style={styles.wizard}>
                    <div style={styles.info}>
                        <div style={styles.stepsCount}>
                            {this.currentStepNumber + 1} of {this.props.rule.length}
                        </div>
                        <div style={styles.steps}>
                            {this.props.rule.map((step) => {
                                return (
                                    <div
                                        className={`WizardInfo__step WizardInfo__step_${
                                            this.currentStepNumber > this.props.rule.indexOf(step)
                                                ? 'passed'
                                                : ''
                                        }`}
                                        key={`step-${step.elementId}`}
                                    />
                                )
                            })}
                        </div>
                    </div>

                    <div
                        dangerouslySetInnerHTML={{ __html: currentStepContent.title }}
                        style={styles.title}
                    />
                    <div
                        dangerouslySetInnerHTML={{ __html: currentStepContent.description }}
                        style={styles.description}
                    />

                    <div style={styles.footer}>
                        {this.currentStepNumber !== 0 && (
                            <button
                                onClick={() => this.onStepButtonClick(this.currentStepNumber - 1)}
                                style={styles.button}
                            >
                                {this.props.prevButtonTitle}
                            </button>
                        )}

                        <button
                            onClick={() => this.onStepButtonClick(this.currentStepNumber + 1)}
                            disabled={this.currentStepNumber + 1 === this.props.rule.length}
                            style={styles.button}
                        >
                            {this.props.nextButtonTitle}
                        </button>
                    </div>
                </div>
                <div style={styles.pin} />
                <div style={styles.pinLine} />
            </div>
        )
    }
}

Wizard.propTypes = {
    rule: PropTypes.array.isRequired,
    isShow: PropTypes.bool.isRequired,
    prevButtonTitle: PropTypes.string,
    nextButtonTitle: PropTypes.string,
}

Wizard.defaultProps = {
    prevButtonTitle: 'Prev',
    nextButtonTitle: 'Next',
}

function getStep(stepNumber, rules) {
    return rules[stepNumber]
}

function getCoords(elementId) {
    const element = document.getElementById(elementId)
    const coordinates = element.getBoundingClientRect()

    return {
        top: coordinates.top + coordinates.height / 2,
        left: coordinates.left + coordinates.width,
    }
}

export default Wizard
