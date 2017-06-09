import React, { Component } from 'react';
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import * as firebase from 'firebase';
import './game.css';

const GAMESIZE = 7;

class Game extends Component
{
  constructor() {
    super(...arguments);
    this.state = this.getInitialState();

    this.handlePinClick = this.handlePinClick.bind(this);
    this.handleGameOverClose = this.handleGameOverClose.bind(this);
    this.handleStartgameClick = this.handleStartgameClick.bind(this);
    this.handleWhostartsClick = this.handleWhostartsClick.bind(this);
    this.handelRemovepinsClick = this.handelRemovepinsClick.bind(this);
    this.handleRestartgameClick = this.handleRestartgameClick.bind(this);
  }

  getInitialState() {
    return {
      isGameStarted: false,
      isGameOver: false,
      isUserTurn: null,
      numSelectedPins: 0,
      numPins: GAMESIZE,
      pins: [...Array(GAMESIZE)].map((e,i) => {
        return { active: true, selected: false }
      }),
      message: "Wanna play a game?",
    };
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged((user)=> {
      if (!user) return;
      firebase.database().ref(`users/${this.props.uid}/game`).child('score').on('value', snap => {
        this.setState({gameScore: snap.val()});
      });
    });
  }

  render() {
    const {isGameStarted, isGameOver, isUserTurn, pins, numPins, numSelectedPins, gameScore} = this.state;

    return <Card>
      <CardTitle
          title="The Pin Game"
          subtitle={this.state.message}
          actAsExpander={false}
          showExpandableButton={false}
      />
      <CardActions >

        { !isGameStarted
          ? <RaisedButton label="Start game" onClick={this.handleStartgameClick} />
          : "" }

        { isGameStarted && isUserTurn == null
          ? <span>
              <RaisedButton label="Yes" onClick={this.handleWhostartsClick} />
              <RaisedButton label="No"  onClick={this.handleWhostartsClick} />
            </span>
          : "" }

        { isGameStarted && isUserTurn != null && numSelectedPins === 0 && numPins > 5
          ? <RaisedButton label="Restart game" onClick={this.handleRestartgameClick} />
          : "" }

        { numSelectedPins > 0
          ? <RaisedButton label="Remove selected pins" onClick={this.handelRemovepinsClick} />
          : "" }

      </CardActions>

      <CardText expandable={false}>

        { isGameStarted && isUserTurn != null
          ? [...Array(GAMESIZE)].map( (e,i) =>
              <Pin key={i} id={i}
                   isActive={pins[i].active}
                   isSelected={pins[i].selected}
                   handlePinClick={this.handlePinClick}
              />)
          : "" }

        { !isGameStarted && gameScore
          ? <div className="score">

              <span style={{color:"green"}}>{gameScore.player}</span>
              -<span style={{color:"red"}}>{gameScore.cpu}</span>
            </div>
          : ""
        }

      </CardText>

      <Dialog
        title="Game Over"
        actions={[<RaisedButton
          label="OK"
          primary={true}
          onTouchTap={this.handleGameOverClose}
        />]}
        modal={false}
        open={Boolean(isGameOver)}
        onRequestClose={this.handleGameOverClose}
      >
        {isGameOver}
      </Dialog>

    </Card>;
  }

  handleGameOverClose() {
    this.setState({isGameOver: false});
    this.handleRestartgameClick();
  }

  handlePinClick(id) {
    const {isUserTurn, numSelectedPins, pins} = this.state;

    if (!isUserTurn) return; // ignore click

    var state = {
      pins: {...this.state.pins}, //copy current pins state
      numSelectedPins: numSelectedPins
    };

    if (pins[id].selected) { // then deselect
      state.numSelectedPins--;
      state.pins[id] = { selected: false, active: true };
    }
    else {
      if (numSelectedPins === 3) return;
      state.numSelectedPins++;
      state.pins[id] = { selected: true, active: true };
    }

    this.setState(state);
  }

  handelRemovepinsClick(e) {
    const {numPins, numSelectedPins, isUserTurn, pins, gameScore} = this.state;

    if (numPins === numSelectedPins) // Game Over
    {
      var newScore = { player: 0, cpu: 0, ...gameScore };

      if (isUserTurn === true ) {
        this.setState({isGameOver: "You lost. :-("});
        newScore.cpu++;
      }
      else if (isUserTurn === false) {
        this.setState({isGameOver: "You won! :-]"});
        newScore.player++;
      }

      if (this.props.uid)
        firebase.database()
          .ref(`users/${this.props.uid}/game`)
          .child("score").update(newScore);

      return;
    }

    var state = {};
    state.numPins = numPins-numSelectedPins;
    state.numSelectedPins = 0;
    state.pins = Object.keys(pins).map( (k,i) =>
      pins[k].selected === true
      ? { selected: false, active: false }
      : pins[k]
    );

    if (isUserTurn === true) {
      state.message = `Computer picks... (${numPins-numSelectedPins} left)`;
      state.isUserTurn = false;
      this.setState(state, this.calcMoveCPU);
    }
    else if (isUserTurn === false) {
      state.message = `It's your turn. Pick 1 to 3 pins. Don't take the last one! (${numPins-numSelectedPins} left)`;
      state.isUserTurn = true;
      this.setState(state);
    }
    else {
      console.trace(`handelRemovepinsClick() exception: >isUserTurn< is neither true or false`);
    }

  }

  calcMoveCPU() {
    const {numPins, numSelectedPins, pins} = this.state;
    const id = "1zQ1DcTyRUpsv0nX_INrbeKceJ4sSKTl57PpYHoqEbz8";
    const url = "https://spreadsheets.google.com/feeds/list/"+id+"/1/public/values?alt=json";

    fetch(url)
    .then(resp => resp.json())
    .then(data => {
      var matrix = data.feed.entry;
      var removeCount = Number(matrix[20-numPins].title.$t);
      var count = removeCount;

      var newPins = Object.keys(pins).map( (k,i) => {
        if (pins[k].active && count) {
          count--;
          return { selected: true, active: true }; // pin waiting to be removed
        }
        else
          return pins[k];
      });

      this.setState({
        numSelectedPins: removeCount,
        message: `Computers made it's move. Remove pins to continue... (${numPins-numSelectedPins} left)`,
        pins: newPins
      });

    })
    .catch(err => console.log("calcMoveCPU() fetch:", err));

  }

  handleStartgameClick(e) {
    this.setState({
      ...this.getInitialState(),
      isGameStarted: true,
      message: "Would you like to be the start player?"
    });
  }

  handleRestartgameClick(e) {
    this.setState({
      ...this.getInitialState(),
      message: "Do you wanna play again?"
    });
  }

  handleWhostartsClick(e) {
    var isUserTurn = ( e.target.innerText === "YES" ? false : true );
    this.setState(
      { isUserTurn: isUserTurn },
      this.handelRemovepinsClick
    );
  }

}

class Pin extends Component
{
  render() {
    const {isActive, isSelected} = this.props;

    if (isActive)
      return <div className={isSelected ? "pin selected" : "pin"}
                  onClick={this._handlePinClick.bind(this)}>|</div>;
    else
      return <script></script>; //empty tag without formatting
  }

  _handlePinClick() {
    this.props.handlePinClick(this.props.id);
  }
}

export default Game; //<-- Remember to export it
