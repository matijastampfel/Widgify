import React, { Component } from 'react';
import './App.css';
import {Card, CardText} from 'material-ui/Card';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';



class Header extends Component {
    constructor(){
        super();
        this.state = {
            search: ''
        }
    }

    handleChange=(e)=>{
      this.setState({[e.target.name]: e.target.value})
    };
    handleKeyPress = (e) =>{
        if(e.key === 'Enter'){
            this.handleClick();
        }
    };
    handleClick=()=>{
      let value = String(this.state.search);
      window.open("https://www.google.se/search?q=" + encodeURIComponent(value), "_blank");
    };


    render() {
        return (
            <Card>
                <AppBar title="Widgify"  showMenuIconButton={false}  iconElementRight={this.props.uid?<FlatButton  label="Sign Out" onTouchTap={this.props.signOut}/>:<FlatButton  label="Log in" onTouchTap={this.props.popupAction}/>}/>
                <CardText style={{justifyContent: 'space-around', display: 'flex'}}>
                    <TextField name='search' type="text" fullWidth={true}  onChange={this.handleChange} onKeyPress={this.handleKeyPress} hintText={`search the web`}/>
                    <FlatButton label='search' style={{width:'28%', margin:'0 1% 0 1%'}} onTouchTap={this.handleClick}/>
                </CardText>
            </Card>
        );
    }
}

export default Header;
