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
import { Grid } from '@material-ui/core';
import Card from '@material-ui/core/Card';





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
        backgroundImage: "url('img/background1.jpg')",
        backgroundSize: "cover",
        marginTop: theme.spacing.unit * 15,
        height: '73%',
        overflow:"hidden"
    },
    body: {
        height: '100%',
        
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
    mainText:{
        color:'#FF7504',
        justifyContent: 'center',
    },
    pages: {
        overflow:'hidden',
    }

});

class HomePageStepper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeStep: 0,
            autoPlay:true,
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

    handleTouchPage=()=> {
        this.setState({ autoPlay: false });
        console.log('autoplay false')
    }

    render() {
        const { classes, theme } = this.props;
        const { activeStep } = this.state;
        const maxSteps = 3;

        return (
            <Paper className={classes.root}>
                <Card
                    className={classes.content}
                    onTouchStart={this.handleTouchPage}
                >
                    <AutoPlaySwipeableViews
                        autoplay={this.state.autoPlay}
                        interval='5000'
                        className={classes.body}
                        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                        index={activeStep}
                        onChangeIndex={this.handleStepChange}
                        enableMouseEvents
                        
                    >
                        <div key='1' className={classes.pages}>
                            <div className='screenPicture'>
                                <img src='img/screen3v3.png' alt='Background' className='screen3'/>  
                            </div>                            
                        </div>

                        <div key='2' className={classes.pages}>
                            <Typography id='headerText' className={classes.mainText} gutterBottom align='center' variant='h5'>
                                Top 5 Suburbs with Highest Crime Rate
                            </Typography> 
                            <img id='highCrimeRateChart' src='img/top5suburbsWithHighCrime.png' alt='Top 5 Suburbs with High Crime rate' width ='100%' height='70%' align='center'/>
                                                       
                        </div>

                        <div key='3' className={classes.pages}>
                            <div id="previewsecondLevel" className={classes.mainText}>Location of Criminal Incidents</div>
                            <div className='picture'>
                                <img src="img/LocationCrime.png" alt='Location of Criminal Incidents' className="CrimePic" />
                            </div>
                            <br/>
                            <div className='chartPicture'>
                                <img src='img/statisticsChart.png' alt='Statistics based on Survey with 400 Women' className='statisticsImage'/>
                            </div>
                        </div>
 
                    </AutoPlaySwipeableViews>
                    
                </Card>
                <MobileStepper
                    steps={maxSteps}
                    position="static"
                    activeStep={activeStep}
                    className={classes.mobileStepper}
                    color='secondary'
                    nextButton={
                        <Button size="small" onClick={this.handleNext} disabled={activeStep === maxSteps - 1}>
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
            </Paper>
        );
    }
}

export default withStyles(styles, { withTheme: true })(HomePageStepper);