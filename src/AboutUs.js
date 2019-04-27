import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import { Toolbar } from '@material-ui/core';


const styles = theme => ({
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        backgroundColor:'#fffafa'
    },
    backButton:{
        color: '#FF7504'

    },
    content: {
        justifyContent: 'center',
        paddingTop:'60px',
        paddingLeft: theme.spacing.unit * 3.5,
        paddingRight: theme.spacing.unit * 3.5
    },
    contentText:{
        color:'#FF7504',
        textAlign: 'justify'
    },
    emergencyText:{
        color:'Red',
        textAlign: 'center',
    },
    headerTitle:{
        align:'center',
        position: 'absolute',
        marginTop: theme.spacing.unit * 1.5,
        paddingLeft: '35%'
        
    },
    paper: {
        position: 'fixed',
        width: '100%',
        height: '100%',
        top: '0',
        left: '0',
        zIndex:1200,
    },
    navHeader: {
        padding: 0,
        marginLeft: 0,
        marginRight: 0,
      },
});
class AboutUs extends React.Component{
    render(){
        const { classes,theme } = this.props;
        return(
            <Paper className={classes.paper}>
                
                <div>
                    <AppBar
                            position="fixed"
                            className={classes.appBar}
                    >
                        <Toolbar className={classes.navHeader}>
                            <IconButton className={classes.backButton}>
                            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                            </IconButton>
                        </Toolbar>
                        <Typography className={classes.headerTitle} variant="h5" color="Black" noWrap>
                            About Us
                        </Typography>
                    </AppBar>
                    <div className={classes.content}>
                    <Typography className={classes.contentText} variant='h6'>
                        GoSafe is developed with your safety in mind.
                        <br/><br/>
                        Knowing newcomers to Melbourne, like you are not familiar with the suburbs, 
                        and how to get around.
                        <br/><br/>
                        In emergency, dial:
                    </Typography>
                    <Typography className={classes.emergencyText} variant='h4'>
                    "000"
                    </Typography>
                    <Typography className={classes.contentText} variant='h6'>
                        to contact the Victorian Police.
                    </Typography>
                    </div>
                    
                </div>
            </Paper>
            
        );
    }
}

AboutUs.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
  };
export default withStyles(styles, { withTheme: true })(AboutUs);