import React, { Component } from 'react';
import './App.css';
import Bookmarks from './Bookmarks';
import Note from './Note';
import Header from './Header';
import Footer from './Footer';
import Info from './Info';
import Todo from './TodoApp';
import Game from './Game';
import Video from './Video';
import News from './News';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Container from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import * as firebase from 'firebase';
import {fullWhite, fullBlack, blueGrey200, blueGrey600} from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';
import Snackbar from 'material-ui/Snackbar';



injectTapEventPlugin();

//Themes
const lightTheme = getMuiTheme({
        appBar: {
            textColor: fullWhite,
        },
        palette: {
            primary1Color: blueGrey600,
        }
}),
 darkTheme = getMuiTheme({
     appBar: {
         textColor: fullBlack,
     },
     palette: {
         primary1Color: blueGrey200,
         textColor: fullWhite,
         secondaryTextColor: fade(fullWhite, 0.7),
         alternateTextColor: '#303030',
         canvasColor: '#303030',
         borderColor: fade(fullWhite, 0.3),
         disabledColor: fade(fullWhite, 0.3),
         pickerHeaderColor: fade(fullWhite, 0.12),
         clockCircleColor: fade(fullWhite, 0.12),
     }
});



class App extends Component {
    constructor(){
        super();
        this.state = {
            uid: false,
            authPopup: false,
            username: '',
            darkTheme: false,
            promptOpen: false,
            message: 'Test'

        }
    }
    //handle auth

    popupAction = () => {
        this.setState({authPopup: !this.state.authPopup});
    };

    handleLogin=(e)=> {
        let provider;
        switch (e.target.innerText) {
            case 'Github': provider =  new firebase.auth.GithubAuthProvider(); break;
            case 'Google': provider =  new firebase.auth.GoogleAuthProvider(); break;
            case 'Facebook': provider =  new firebase.auth.FacebookAuthProvider(); break;
            default: provider =  new firebase.auth.TwitterAuthProvider();
        }
        firebase.auth().signInWithPopup(provider).then(this.setState({authPopup:false, promptOpen: true, message:'You just signed in!'}));
    };

    handleSignOut=()=>{
        firebase.auth().signOut().then(function() {
        }).catch(function(error) {
            console.log(error);
        });
        this.handleRequestOpen('You signed out! Have a good one.')
    };

    componentWillMount() {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                this.setState({uid: user.uid, username: user.displayName});
                firebase.database().ref(`users/${this.state.uid}/theme`).child('darkTheme').once('value', s=>{
                    this.setState({darkTheme: s.val()});
                });
            } else {
                this.setState({uid: false, username: '', darkTheme: false});
            }
        }.bind(this));
    }

    deleteCurrentUser=()=>{
        firebase.database().ref(`users/`).child(this.state.uid).remove().then(()=>{
            this.handleRequestOpen('You have deleted your account. Sad to see you go. ')
        });
        let user = firebase.auth().currentUser;
        user.delete().then(function() {}, function(error) {});
        this.handleRequestOpen('Deleted account. Sad to see you go.')

    };
    changeTheme=()=>{
        let darkTheme = this.state.darkTheme;
        darkTheme = !darkTheme;
      if(this.state.uid) {
          firebase.database().ref(`users/${this.state.uid}/theme`).update({
              darkTheme: darkTheme
          });
      }
        this.setState({darkTheme});

    };

    handleRequestOpen = (message) => {
        this.setState({promptOpen: true, message:message});
    };

    handleRequestClose = () => {
        this.setState({
            promptOpen: false,
        });
    };

    render() {
            return (
            <Container  muiTheme={getMuiTheme(this.state.darkTheme? darkTheme: lightTheme)}>
                <Grid style={{backgroundColor: this.state.darkTheme? 'rgb(60, 60, 60)': 'rgb(240, 240, 240)'}} fluid>
                    <Dialog open={this.state.authPopup} titleStyle={{textAlign: 'center'}} actions={ <RaisedButton fullWidth={true}  label="Close" primary={true} onTouchTap={this.popupAction}/>} title="Log in with one of the following providers" >
                        <FlatButton fullWidth={true} onTouchTap={this.handleLogin}>Github</FlatButton>
                        <FlatButton fullWidth={true} onTouchTap={this.handleLogin}>Google</FlatButton>
                        <FlatButton fullWidth={true} onTouchTap={this.handleLogin}>Facebook</FlatButton>
                        <FlatButton fullWidth={true} onTouchTap={this.handleLogin}>Twitter</FlatButton>
                    </Dialog>
                    <Snackbar
                        open={this.state.promptOpen}
                        message={this.state.message}
                        autoHideDuration={4000}
                        onRequestClose={this.handleRequestClose}
                    />
                    <Row around="xs"  middle="xs">
                        <Col className="widget" xs={12}>
                            <Header popupAction={this.popupAction} signOut={this.handleSignOut} uid={this.state.uid}  />
                        </Col>
                        <Col className="widget " xs={12}  md={6} lg={8}>
                            <News uid={this.state.uid} username={this.state.username}/>
                        </Col>
                        <Col className="widget" xs={12}  md={6} lg={4}>
                          <Info darkTheme={this.state.darkTheme} changeTheme={this.changeTheme} deleteCurrentUser={this.deleteCurrentUser} uid={this.state.uid} popupAction={this.popupAction}/>
                        </Col>
                        <Col className="widget" xs={12}  md={6} lg={4}>
                            <Note uid={this.state.uid} username={this.state.username} popupAction={this.popupAction} />
                        </Col>
                        <Col className="widget" xs={12}  md={6} lg={4}>
                            <Todo uid={this.state.uid}/>
                        </Col>
                        <Col className="widget" xs={12}  md={6} lg={4}>
                          <Bookmarks uid={this.state.uid} username={this.state.username} popupAction={this.popupAction} darkTheme={this.state.darkTheme}/>
                        </Col>
                        <Col className="widget" xs={12}  md={6} lg={4}>
                            <Game uid={this.state.uid} username={this.state.username} />
                        </Col>
                        <Col className="widget" xs={12}  md={12} lg={8}>
                            <Video />
                        </Col>
                        <Col className="widget" xs={12}>
                            <Footer darkTheme={this.state.darkTheme}/>
                        </Col>
                    </Row>
                </Grid>
            </Container>
        );
    }

}




export default App;
