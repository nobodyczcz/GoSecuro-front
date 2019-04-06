import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import SwipeableViews from 'react-swipeable-views';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import { autoPlay } from 'react-swipeable-views-utils';
import Paper from '@material-ui/core/Paper';





const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const styles = theme => ({
    root: {
        position: 'fixed',
        left: 0,
        top:0,
        flexGrow: 1,
        padding: '5%',
        width:'90%',
        zIndex: 100,
        height:'100%',
    },
    content: {
        marginTop: theme.spacing.unit * 15,
        height:'100%'
    },
    body: {
        height: '70%',
    },
    header: {
        display: 'flex',
        justifyContent: 'center',
        height: 50,
        paddingLeft: theme.spacing.unit * 4,
        backgroundColor: theme.palette.background.default,
    },
    mobileStepper: {
        alignItem: 'center',
        backgroundColor: theme.palette.background.paper,
    },

});

class HomePageStepper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeStep: 0,
        };
    };

    handleNext = () => {
        this.setState(prevState => ({
            activeStep: prevState.activeStep + 1,
        }));
    };

    handleBack = () => {
        this.setState(prevState => ({
            activeStep: prevState.activeStep - 1,
        }));
    };

    handleStepChange = activeStep => {
        this.setState({ activeStep });
    };

    render() {
        const { classes, theme } = this.props;
        const { activeStep } = this.state;
        const maxSteps = 3;

        return (
            <Paper className={classes.root}>
                <div className={classes.content}>
                    <AutoPlaySwipeableViews
                        className={classes.body}
                        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                        index={activeStep}
                        onChangeIndex={this.handleStepChange}
                        enableMouseEvents
                    >
                        <div key='1'>
                            Page one
                        </div>
                        <div key='2'>
                            Page two
                        </div>
                        <div key='3'>
                            Page three
                        </div>
 
                    </AutoPlaySwipeableViews>
                    <MobileStepper
                        steps={maxSteps}
                        position="static"
                        activeStep={activeStep}
                        className={classes.mobileStepper}
                        nextButton={
                          <Button size="small" onClick={this.handleNext} disabled={activeStep === maxSteps}>
                              Next
                              {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                          </Button>
                        }
                        backButton={
                          <Button size="small" onClick={this.handleBack} disabled={activeStep === 0}>
                              {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                              Back
                          </Button>
                        }
                    />
                </div>
            </Paper>
        );
    }
}

export default withStyles(styles, { withTheme: true })(HomePageStepper);