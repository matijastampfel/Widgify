import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {CardActions} from 'material-ui/Card';




class AddTodo extends Component {
    constructor(){
        super();
        this.state = {
            text: ''
        }
    }
    handleChange = (e) =>{
        this.setState({text: e.target.value});
    };

    handleKeyPress = (e) =>{
        if(e.key === 'Enter'){
            this.handleSubmit();
        }
    };
   handleSubmit = () => {
        if(this.state.text !== ''){
            this.setState({text: ''});
            this.props.onAddTodo(this.state.text);
        }
    };

    render() {
        return (
            <CardActions style={{textAlign: 'center'}}>
                <TextField onChange={this.handleChange} value={this.state.text} onKeyPress={this.handleKeyPress} hintText="What do you need to do?"/>
                <RaisedButton onTouchTap={this.handleSubmit} label="Add" />
            </CardActions>
        );
    }
}

export default AddTodo;
