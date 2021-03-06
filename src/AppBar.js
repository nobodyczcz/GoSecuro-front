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
import ClearIcon from '@material-ui/icons/Clear';

import ContactsIcon from '@material-ui/icons/Contacts';
import BusIcon from '@material-ui/icons/DirectionsBus';
import WalkIcon from '@material-ui/icons/DirectionsWalk';
import DriveIcon from '@material-ui/icons/DriveEta';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';


const styles = theme => ({
    mainBar:{
        position:'fixed',
        height: `calc(5% + 100px)`,
        //height: '129px',
        width:'100%',
        left:0,
        top:0,
        zIndex:900,
        //backgroundColor: '#616161'
        backgroundColor: "#4f6c98"
    },
    mainBarMap: {
        position:'fixed',
        height:`calc(5% + 100px)`,
        //height: '129px',
        width:'100%',
        left:0,
        top:0,
        zIndex:900,
        //backgroundColor:"#424242",
        backgroundColor:"#074A8F",
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
    width: theme.spacing.unit * 4,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    paddingRight:'0px',
    paddingLeft:'0px'

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
            searchPlaceHolder:"Search a destination...",
            showClear:false
        };
  
    }
    
    handleTabChange = (event, value) => {
        console.log("tab value:" + value)
        this.setState({ tabValue:value });
        
    };
    handleNavChange = (event, value) => {
        this.setState({ navValue: value });
    };

    setupAutoComplete(location=null) {
      console.log('setUp auto complete')
        var input = document.getElementById('searchInput');
        if(location){
          var circle = new window.google.maps.Circle(
              { center: location, radius: 1000 });
          var options = {
              bounds: circle.getBounds(),
              types: ['establishment']
          };
          this.autocomplete = new window.google.maps.places.Autocomplete(input, options);
          window.google.maps.event.addListener(this.autocomplete, 'place_changed', function() {
            var input = document.getElementById('searchIcon');
            input.click();
        });
        }
        else{
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
            this.autocomplete = new window.google.maps.places.Autocomplete(input, options);
            window.google.maps.event.addListener(this.autocomplete, 'place_changed', function() {
              var input = document.getElementById('searchIcon');
              input.click();
          });
        }.bind(this));
        }

    };

    componentDidMount() {
        if (window.google) {
            this.setupAutoComplete(this.props.getLocation());
        }

    }
    componentWillMount(){
      var currentRoute = this.props.history.location.pathname

      if (currentRoute==='/'){
        this.state.tabValue=0
      }
      // else if(currentRoute==='/map'){
      //   this.state.tabValue=1
      // }
      else if(currentRoute==='/contactsPage'){
        this.state.tabValue=1
      }
    }

    checkTab(){
      var currentRoute = this.props.history.location.pathname

      if (currentRoute==='/'){
        this.setState({tabValue:0});
      }
      // else if(currentRoute==='/map'){
      //   this.state.tabValue=1
      // }
      else if(currentRoute==='/contactsPage'){
        this.setState({tabValue:1});
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
        console.log(text);
        if (text) {
            var searchIconPosition = event.currentTarget.getBoundingClientRect()
            this.props.handleInputSearch(text);
            this.setState({ searching: true, searchCoord: [searchIconPosition.left, searchIconPosition.top] });
            if (this.state.tabValue != 0) {
                document.getElementById('mapIcon').click();
                this.props.history.go(window.homeIndex());
            }
        }
        else {
            this.setState({searchPlaceHolder:"Search a destination.."})
        }

    }
    handleInputChange = event => {
        if (event.key === 'Enter') {
          var search = document.getElementById('searchIcon');
            search.click();
        }
        
    }
    handleInputClear=event=>{
      if(event.target.value && !this.state.showClear){
        this.setState({showClear:true});
      }
      else if(!event.target.value){
        this.setState({showClear:false});
      }
    }

    handleClickAway = () => {
        document.getElementById('searchInput').blur();
    }
    handleClear=()=>{
      var input = document.getElementById('searchInput');
      input.value='';
      this.setState({showClear:false});

    }

    render() {

      this.state.navValue = this.props.navValue;
      const { classes } = this.props;


        return (
          <div>
                    <div className={this.state.tabValue == 0? classes.mainBarMap :classes.mainBar}>
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
                      GoSecuro
                    </Typography>
                    <div className={classes.search}>
                          <InputBase
                            placeholder={this.state.searchPlaceHolder}
                              id="searchInput"
                              onKeyPress={this.handleInputChange.bind(this)}
                              onChange={this.handleInputClear.bind(this)}
                              classes={{
                                  root: classes.inputRoot,
                                  input: classes.inputInput,
                              }}
                        />
                        
                    </div>
                    {this.state.showClear?<IconButton id="clearIcon" onClick={this.handleClear.bind(this)} className={classes.searchIcon} color="inherit">
                          <ClearIcon />
                    </IconButton>:null}
                    
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

                      <Tab icon={<WalkIcon color="primary" />} onClick={() => {
                          this.props.setNavMode('walking')
                      }} />
                        <Tab icon={<BusIcon color="primary" />} onClick={() => {
                          this.props.setNavMode('transit')
                      }} />
                        <Tab icon={<DriveIcon color="primary" />} onClick={() => {
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
                      <Tab icon={<HomeIcon color="primary"/>} id='mapIcon' onClick={() => {
                        if(this.props.history.location.pathname!=='/')
                          this.props.history.goBack();
                      }} />
                      {/* <Tab icon={<MapIcon color="primary"/>} id='mapIcon' onClick={() => {
                          this.props.history.push('/map')
                      }} /> */}
                      <Tab icon={<ContactsIcon color="primary"/>} onClick={() => {
                          this.props.history.push('/contactsPage')
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