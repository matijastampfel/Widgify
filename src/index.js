import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import * as firebase from 'firebase';


const config = {
    apiKey: "AIzaSyDyQbQD61hwxRSQpyNll8EFRWPEb97R7Wc",
    authDomain: "widgify-caa66.firebaseapp.com",
    databaseURL: "https://widgify-caa66.firebaseio.com",
    projectId: "widgify-caa66",
    storageBucket: "widgify-caa66.appspot.com",
    messagingSenderId: "832223605648"
};
firebase.initializeApp(config);


ReactDOM.render(
    <App />,
    document.getElementById('root')
);