/* eslint-disable */
import React, { Component } from 'react';
import Chip from 'material-ui/Chip';
import Checkbox from 'material-ui/Checkbox';
import Checked from 'material-ui/svg-icons/action/done';
import NotChecked from 'material-ui/svg-icons/content/remove';




class Todo extends Component {
    constructor(){
        super();
        this.styles = {
            chip: {
                margin: 4,
                padding: 4,
            }
        };
    }
    render() {
        const {id, text, completed} = this.props;
       
        return (
            <Chip
                key={id}
                onTouchTap={()=>this.props.onToggle(id)}
                onRequestDelete={() => this.props.onDelete(id)}
                style={this.styles.chip}

            >
              <Checkbox checkedIcon={<Checked/>} uncheckedIcon={<NotChecked/>} label={text} checked={completed}/>
            </Chip>
        );
    }
}

export default Todo;  