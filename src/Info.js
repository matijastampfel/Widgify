import React, { Component } from 'react';
import './App.css';
import {Card ,CardTitle} from 'material-ui/Card';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import {List, ListItem} from 'material-ui/List';
import ActionInfo from 'material-ui/svg-icons/action/info';
import Sun from 'material-ui/svg-icons/image/wb-sunny';
import Moon from 'material-ui/svg-icons/image/brightness-2';
import Toggle from 'material-ui/Toggle';

class Info extends Component {
    constructor(props){
        super(props);
        this.state = {
            popup: false,
            information: [
                {topic: 'How to sign up', category: 'Account', info: 'Click on the sign up button on the top right of the page. ' +
                'Then you will prompted with a dialog that asks you to ' +
                'log in with the wanted provider. Smooth.'},

                {topic: 'How to change theme', category: 'Styling', info: 'In the information and settings widget you can toggle between light and dark theme (must be logged in). The ' +
                'settings will be saved and remembered on your user account.'},

                {topic: 'Powered by', category: 'About', info: 'NewsAPI.org, Google and the Widgify team'},

                {topic: 'Anything else on you mind?', category: 'Contact', info: 'Do not hesitate to contact us at widgify@widgify.widgify if you have any questions' +
                ' or ideas on how to improve this site.'},

                {topic: 'Delete your account', category: 'Account', info: 'If you are logged in, you will have the option to delete your account on this page.', deleteUser: true}
            ],
            currentInformation: ''
        }
    }

    popupAction = (index) => {
        let info;
        info = this.state.information[index];
        this.setState({currentInformation: info, popup: !this.state.popup});
    };

    close = () =>{
        this.setState({popup: false})
    };


    render() {
        let buttons = this.state.information.map((info, index)=>{return <ListItem key={`info${index}`} onTouchTap={()=>this.popupAction(index)} rightIcon={<ActionInfo />} primaryText={info.topic} secondaryText={info.category}/>});
        return (
            <Card>
                <PopupInfo popup={this.state.popup} close={this.close}  info={this.state.currentInformation} deleteCurrentUser={this.props.deleteCurrentUser} uid={this.props.uid}/>
                <CardTitle title="Information and settings"   actAsExpander={false} showExpandableButton={false} />
                <List>
                    {this.props.uid?<ListItem><Toggle toggled={!!this.props.darkTheme} onToggle={this.props.changeTheme} label={this.props.darkTheme?<Moon/>:<Sun/>}/></ListItem>: <ListItem onTouchTap={this.props.popupAction}>Log in to use additional features</ListItem>}
                    {buttons}
                </List>
            </Card>
        );
    }
}

class PopupInfo extends Component {
    onClick=()=>{
        this.props.deleteCurrentUser();
        this.props.close();
    };

    render(){
        return(
            <Dialog open={this.props.popup} titleStyle={{textAlign: 'center'}} actions={ <RaisedButton fullWidth={true}  label="Close" primary={true} onTouchTap={this.props.close}/>} title={this.props.info.topic} >
                {this.props.info.info}
                {this.props.info.deleteUser && this.props.uid?<RaisedButton backgroundColor="#D50000" labelStyle={{color: 'white'}} style={{marginTop: 30}} fullWidth={true} onTouchTap={this.onClick} label="Delete my account"/>:null}
            </Dialog>
        );
    }
}

export default Info;