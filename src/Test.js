import React, { Component } from 'react';
import './App.css';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

class TestData extends Component {
    render() {
        return (
            <Card>
                <CardHeader
                    title="Widget"
                    actAsExpander={false}
                    showExpandableButton={false}
                />
                <CardActions>
                    <RaisedButton label="Button" />
                </CardActions>
                <CardText expandable={false}>


                </CardText>
            </Card>
        );
    }
}

export default TestData;