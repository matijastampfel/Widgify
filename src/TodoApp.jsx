import React, { Component } from 'react';
import TodoList from './todoComponents/TodoList';
import AddTodo from './todoComponents/AddTodo';
import {Card, CardTitle, CardText} from 'material-ui/Card';
import * as firebase from 'firebase';



class TodoApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            todos: [
                {
                    id: 'init1',
                    text: 'Click the (X) to delete the todo',
                    completed: true
                },
                {
                    id: 'init2',
                    text: 'Click me to mark the todo as complete',
                    completed: false
                },
            ]
        };

    };

    handleRequestDelete = (id) => {
        let allTodos = [];
        this.state.todos.map((todo)=>{return allTodos.push(todo.id)});
        let deleteThis = allTodos.indexOf(id),
        newTodos = this.state.todos.filter((_, i) => i !== deleteThis);
        this.setState({todos: newTodos});
        this.updateTodos(newTodos);

    };

    generateHexString = () => {
        let ret = "",
        length = 16;
        while (ret.length < length) {
            ret += Math.random().toString(16).substring(2);
        }
        return ret.substring(0,length);
    };

    handleAddTodo (text) {
        let currentTodos = this.state.todos;
        currentTodos.push({id: this.generateHexString(), text: text, completed: false});
        this.setState({currentTodos});
        this.updateTodos(currentTodos);
    }

    updateTodos = (newTodos) =>{
        if(this.props.uid) {
            firebase.database().ref(`users/${this.props.uid}/todos`).update({
                list: newTodos
            });
        }
    };
    initTodos = () =>{
        firebase.database().ref(`users/${this.props.uid}/todos`).child('list').on('value', s => {
            if(s.val() !== null) this.setState({todos: s.val()});
        });
    };

    handleToggle (id) {
        const updatedTodos = this.state.todos.map((todo) => {
            if (todo.id === id) todo.completed = !todo.completed;
            return todo;
        });
        this.setState({todos: updatedTodos});
        this.updateTodos(updatedTodos);
    }

    componentWillMount(){
        firebase.auth().onAuthStateChanged((user)=> {
            if (user) this.initTodos();
            else this.setState({todos: [
                {
                    id: 'init1',
                    text: 'Click the (X) to delete the todo',
                    completed: true
                },
                {
                    id: 'init2',
                    text: 'Click me to mark the todo as complete',
                    completed: false
                },
            ]});
        });
    }

    render() {

        return (
            <Card>
                <CardTitle title="Todos"/>
                <AddTodo onAddTodo={this.handleAddTodo.bind(this)} updateTodos={this.updateTodos}/>
                <CardText style={{height: 280, overflowY: 'auto'}}>
                    <TodoList todos={this.state.todos} onToggle={this.handleToggle.bind(this)} onDelete={this.handleRequestDelete}/>
                </CardText>
            </Card>
        );
    }
}

export default TodoApp;