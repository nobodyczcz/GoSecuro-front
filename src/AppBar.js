import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import ArrowBack from '@material-ui/icons/ArrowBack';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import HomeIcon from '@material-ui/icons/Home';
import MapIcon from '@material-ui/icons/Map';
import ContactsIcon from '@material-ui/icons/Contacts';
import BusIcon from '@material-ui/icons/DirectionsBus';
import WalkIcon from '@material-ui/icons/DirectionsWalk';
import DriveIcon from '@material-ui/icons/DriveEta';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';


const styles = theme => ({
    mainBar:{
        position:'fixed',
        height:"129px",
        width:'100%',
        left:0,
        top:0,
        zIndex:900,
        backgroundColor:"#ff7504"
    },
    mainBarMap: {
        position:'fixed',
        height:"129px",
        width:'100%',
        left:0,
        top:0,
        zIndex:900,
        backgroundColor:"#ff5603",
        opacity:0.7,

    },
    root: {
        position: 'fixed',
        left: '3%',
        top: '5%',
        zIndex: 1100,
        width: '94%',
        height:theme.spacing.unit * 6,
    },
    
    tabsRoot: {
        height: theme.spacing.unit * 1,

    },
    tabs: {
        position: 'fixed',
        left: '3%',
        top: '5%',
        zIndex: 1000,
        width: '94%',
        backgroundColor: 'secondary',
        marginTop: theme.spacing.unit * 6
    },
    toolbarRoot: {
        paddingTop: theme.spacing.unit * 0.3,
        minHeight: theme.spacing.unit * 6,
        [theme.breakpoints.up('sm')]: {
            minHeight: theme.spacing.unit * 6,
        },
    },
  grow: {
    flexGrow: 1,
  },
    menuButton: {
        verticalAlign: 'middle',
    marginLeft: -12,
    marginRight: 20,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing.unit * 1,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 1,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 5,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    },
    progress: {
        position: 'fixed',
    },
  inputRoot: {
    color: 'secondary',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  sectionMobile: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
});

class MainBar extends React.Component {  
    constructor(props) {
        super(props);
        if (window.cordova) {
            window.addEventListener('keyboardDidHide', function () {
                document.getElementById('searchInput').blur();
            });
        }

        this.state = {
            anchorEl: null,
            mobileMoreAnchorEl: null,
            displayBack: this.props.displayBack,
            tabValue: this.props.tabValue ? this.props.tabValue : 0,
            navValue: this.props.navValue ? this.props.navValue : 0,
            searching: null,
            searchCoord: [0, 0],
            searchPlaceHolder:"Search a destination..."
        };
  
    }
    
    handleTabChange = (event, value) => {
        console.log("tab value:" + value)
        this.setState({ tabValue:value });
        
    };
    handleNavChange = (event, value) => {
        this.setState({ navValue: value });
    };

    setupAutoComplete() {
        var input = document.getElementById('searchInput');
        navigator.geolocation.getCurrentPosition(function (position) {
            var geolocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var circle = new window.google.maps.Circle(
                { center: geolocation, radius: 1000 });
            var options = {
                bounds: circle.getBounds(),
                types: ['establishment']
            };
            var autocomplete = new window.google.maps.places.Autocomplete(input, options);
        });
    };

    componentDidMount() {
        if (window.google) {
            this.setupAutoComplete();
        }

    }


    removeFocus() {
        document.getElementById('searchInput').blur();
    }
    handleProfileMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
    };

    handleMenuClose = () => {
    this.setState({ anchorEl: null });
    this.handleMobileMenuClose();
    };

    handleMobileMenuOpen = event => {
    this.setState({ mobileMoreAnchorEl: event.currentTarget });
    };

    handleMobileMenuClose = () => {
    this.setState({ mobileMoreAnchorEl: null });
    };

    handleSearch = event => {
        var input = document.getElementById('searchInput');
        var text = input.value;
        input.value = "";
        console.log(text);
        if (text) {
            var searchIconPosition = event.currentTarget.getBoundingClientRect()
            this.props.handleInputSearch(text);
            this.setState({ searching: true, searchCoord: [searchIconPosition.left, searchIconPosition.top] });
            if (this.state.tabValue != 1) {
                document.getElementById('mapIcon').click();
                this.props.history.push('/map');

            }
        }
        else {
            this.setState({searchPlaceHolder:"Search a destination.."})
        }

    }
    handleInputChange = event => {
        if (event.key == 'Enter') {
            var input = document.getElementById('searchIcon');
            input.click();
        }
    }

    handleClickAway = () => {
        document.getElementById('searchInput').blur();
    }

    render() {

      this.state.navValue = this.props.navValue;
      const { classes } = this.props;


        return (
          <div>
                    <div className={this.state.tabValue == 1? classes.mainBarMap :classes.mainBar}>
                    </div>
              <AppBar position="static" className={classes.root}>
                  <Toolbar className={classes.toolbarRoot}>
                      {this.props.displayBack ? 
                          <IconButton className={classes.menuButton} onClick={this.props.handleBack} color="inherit" aria-label="Back">
                              <ArrowBack />
                          </IconButton>
                          :
                          <IconButton className={classes.menuButton} onClick={this.props.toggleDrawer('left', true)} color="inherit" aria-label="Open drawer">
                            <MenuIcon />
                          </IconButton>
                      }
                    
                    <Typography className={classes.title} variant="h6" color="inherit" noWrap>
                      GoSafe
                    </Typography>
                    <div className={classes.search}>
                            <InputBase
                              placeholder={this.state.searchPlaceHolder}
                              inputProps={{ maxlength: "10" }}
                                id="searchInput"
                                onKeyPress={this.handleInputChange.bind(this)}
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                        />
                        
                    </div>
                        {this.state.searching ? <CircularProgress style={{ left: this.state.searchCoord[0], top:this.state.searchCoord[1]+3}} className={classes.progress} color="secondary" /> : null}
                        <IconButton id="searchIcon" onClick={this.handleSearch.bind(this)} className={classes.searchIcon} color="inherit">
                          <SearchIcon />
                    </IconButton>
                    
                    
                    
                  </Toolbar>
              </AppBar>
              {this.props.displayNavRoutes ?
                  <Tabs
                      variant="fullWidth"
                      value={this.state.navValue}
                      indicatorColor="primary"
                      textColor="primary"
                      onChange={this.handleNavChange}
                      className={classes.tabs}
                  >

                      <Tab icon={<WalkIcon />} onTouchEnd={() => {
                          this.props.setNavMode('walking')
                      }} />
                      <Tab icon={<BusIcon />} onTouchEnd={() => {
                          this.props.setNavMode('transit')
                      }} />
                      <Tab icon={<DriveIcon />} onTouchEnd={() => {
                          this.props.setNavMode('driving')
                      }}/>
                  </Tabs>
                  :
                  <Tabs
                      variant="fullWidth"
                      value={this.state.tabValue}
                      indicatorColor="primary"
                      textColor="primary"
                      onChange={this.handleTabChange}
                      className={classes.tabs}

                  >
                      <Tab icon={<HomeIcon color="primary"/>} onTouchEnd={() => {
                          this.props.history.push('/')
                      }} />
                      <Tab icon={<MapIcon color="primary"/>} id='mapIcon' onTouchEnd={() => {
                          this.props.history.push('/map')
                      }} />
                      <Tab icon={<ContactsIcon color="primary"/>} onTouchEnd={() => {
                          this.props.history.push('/contacts')
                      }} />
                  </Tabs>
              }

              
      </div>
    );
  }
}

MainBar.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(MainBar);