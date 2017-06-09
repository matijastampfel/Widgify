import React, { Component } from 'react';
import './App.css';
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import * as firebase from 'firebase';


class Note extends Component {

    constructor() {
        super();
        this.state = {
            text: '',
            timestamp: 0
        }
    }
    handleChange=(e)=>{
        this.setState({[e.target.name]: e.target.value});
        firebase.database().ref(`users/${this.props.uid}/note`).update({
           text: e.target.value
        });
    };

    handleTimestamp = () => {
            let url1 = "https://api.timezonedb.com/v2/get-time-zone?key=FPYC4024VFCA&format=json&by=zone&zone=Europe/Stockholm";
            let req1= new XMLHttpRequest();
            req1.onreadystatechange= () => {
                if(req1.status === 200 && req1.readyState === 4){
                    let json1= JSON.parse(req1.responseText);
                    firebase.database().ref(`users/${this.props.uid}/note`).update({
                        text: this.state.text + json1.formatted
                    })
                }
            };
            req1.open('get', url1);
            req1.send();
    };

    updateNoteText = () => {
        firebase.database().ref(`users/${this.props.uid}/note`).child('text').on('value', s=>{
            this.setState({text: s.val()});
        });
    };

    componentWillMount() {
        firebase.auth().onAuthStateChanged((user)=> {
            if (user) this.updateNoteText();
            else this.setState({text: ''});
        });
    }

    render() {
        return (
            <Card>
                <CardTitle title="Make a note"  subtitle={`I will remember it for you`}/>
                <CardActions>
                    {this.props.uid?<RaisedButton label="Get current time" onTouchTap={this.props.uid?this.handleTimestamp:null} />:<RaisedButton label="log in to use the note widget" onTouchTap={this.props.popupAction}/>}
                </CardActions>
                <CardText>
                    <TextField name='text' value={this.state.text?this.state.text:''} rows={10} rowsMax={10} fullWidth={true} multiLine={true} hintText={`what's on your mind ${this.props.uid?',': ' '} ${this.props.username}?`} onChange={this.props.uid?this.handleChange:null}/>
                </CardText>
            </Card>
        );
    }
}

export default Note;

