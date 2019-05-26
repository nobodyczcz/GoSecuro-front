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
        left: 0,
        top:0,
        flexGrow: 1,
        width:'100%',
        zIndex: 100,
        height:'calc(100% - 68px)',


    },
    content: {
        backgroundImage: "url('img/background1.jpg')",
        backgroundSize: "cover",
        overflow:"hidden",
        height:"100%",
        // overflowY: 'hidden',
    },
    body: {
        overflowX: 'hidden',
        height:"100%",

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
        backgroundColor: theme.palette.secondary.main,
    },
    mainText:{
        color:'#FF7504',
        justifyContent: 'center',
    },
    pages: {
         overflowX:'hidden',
    },
    contentText:{
        //color:'#FF7504',
        textAlign: 'justify',
        margin:'10px',
    },
    privacy:{
        height:'100%'
    },
    pages4:{
        overflowX:'hidden',
        height:'100%'


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
        const maxSteps = 5;

        return (
            <Paper className={classes.root}>
                <Card
                    className={classes.content}
                    onTouchStart={this.handleTouchPage}
                >
                    <AutoPlaySwipeableViews
                        autoplay={this.state.autoPlay}
                        interval={5000}
                        className={classes.body}
                        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                        index={activeStep}
                        onChangeIndex={this.handleStepChange}
                        enableMouseEvents
                        
                    >
                        <div key='1' className={classes.pages}>
                            <div className='screenPicture'>
                                <img src='img/GoSecuro-home.png' alt='Background' className='screen3'/>  
                            </div>                            
                        </div>

                        <div key='2' className={classes.pages}>
                            <Typography id='headerText' className={classes.mainText} gutterBottom align='center' variant='h5'>
                                Top 5 Suburbs with Highest Crime Rate
                            </Typography> 
                            <img id='highCrimeRateChart' src='img/crimeStatistics-transparent.png' alt='Top 5 Suburbs with High Crime rate' width ='100%' height='70%' align='center'/>
                            <Typography className={classes.mainText} variant='h6'>
                                <br/>
                                Your safe journey Home is important.
                                <br/>
                                Find your safe way home.
                            </Typography>                           
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
                        <div key='3' className={classes.pages}>
                        <Typography className={classes.contentText} variant='h6'>
                        Crime and offences in public spaces have continued to threaten the safety of women, discouraging them to travel alone confidently.
                        <br/><br/>
                        This situation is particularly intimidating to female students who are new and unfamiliar to Melbourne. It is a social responsibility to ensure the safety of women and encourage them to travel confidently. 
                        <br/><br/>
                        GoSecuro is a safety app targeted towards new students in Melbourne. The application is developed with your safety in mind. 
                        <br/><br/>
                        GoSecuro acts as an additional safety measure when you’re navigating Melbourne, crime and incidents.
                    </Typography>
                        </div>
                        <div key='4' className={classes.pages4}>
                        <iframe className={classes.privacy} src="https://docs.google.com/document/d/e/2PACX-1vRxZ0bspFXirBwHxI_1NWsAbS6u2xy8ss9FDM_qFLL_CNqIlgChGhWtHVXIaEg4Mz8g7Bhm1jnBkmJm/pub?embedded=false"></iframe>
                        </div>

 
                    </AutoPlaySwipeableViews>
                    
                </Card>
                <MobileStepper
                    steps={maxSteps}
                    variant="dots"
                    position="bottom"
                    activeStep={activeStep}
                    className={classes.mobileStepper}
                    nextButton={
                        <Button color="primary" size="small" onClick={this.handleNext} disabled={activeStep === maxSteps - 1}>
                            Next
                              {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                        </Button>
                    }
                    backButton={
                        <Button color="primary" size="small" onClick={this.handleBack} disabled={activeStep === 0}>
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