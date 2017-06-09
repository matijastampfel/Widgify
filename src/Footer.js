import React, { Component } from 'react';
import './App.css';
import AppBar from 'material-ui/AppBar';
import {Card} from 'material-ui/Card';
import {blueGrey200, blueGrey600} from 'material-ui/styles/colors';




class Footer extends Component {
    render() {
        return (
            <Card style={this.props.darkTheme?{backgroundColor: blueGrey200}: {backgroundColor: blueGrey600}}>
                <AppBar showMenuIconButton={false}/>
            </Card>
        );
    }
}

export default Footer;