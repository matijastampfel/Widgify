import React, { Component } from 'react';
import Todo from './Todo'
import {CardText} from 'material-ui/Card';


class TodoList extends Component {
    constructor(){
        super();
        this.styles = {
            wrapper: {
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center'
            },
        };
    }
    renderTodos = () => {
        const {todos} =this.props;
        return todos.slice(0).reverse().map((todo) => {
            return (
                <Todo key={todo.id} {...todo} onToggle={this.props.onToggle} onDelete={this.props.onDelete}/>
            )
        })
    };
    render() {


        return (
            <CardText style={this.styles.wrapper}>
                {this.renderTodos()}
            </CardText>
        );
    }
}

export default TodoList;  