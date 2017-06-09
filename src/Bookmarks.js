import React from 'react';
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {List, ListItem} from 'material-ui/List';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Delete from 'material-ui/svg-icons/action/delete';
import * as firebase from 'firebase';
import {fullWhite, fullBlack} from 'material-ui/styles/colors';



class Bookmarks extends React.Component
{
  constructor()
  {
    super(...arguments);
    this.state = {
      message: "Why not save some bookmarks?",
      userInput: "",
      userInputError: "",
      userSortOrder: "added",
      bookmarks: {}
    }
  }

  componentWillMount()
  {
    firebase.auth().onAuthStateChanged((user) =>
    {
      if (!user) return;

      const rootRef = firebase.database().ref(`users/${user.uid}/bookmarks`);

      rootRef.child("hasBeenUsed").once('value', snap =>
      {
        if (snap.exists()) return;

        var newKey = () => rootRef.child('items').push().key;
        var updates = {
          [newKey()]: {url: "http://www.facebook.com"},
          [newKey()]: {url: "http://firebase.google.com"},
          [newKey()]: {url: "http://www.github.com"},
          [newKey()]: {url: "http://stackoverflow.com"}
        };

        rootRef.set({ hasBeenUsed: true });
        rootRef.child("items").update(updates);
      });

      rootRef.child("items").off('value');
      rootRef.child("items").on('value', snap => {
        this.setState({bookmarks: snap.val() || {}});
      });

    });

  }

  handleAdd(e)
  {
    const {uid} = this.props
    const {userInput, userInputError} = this.state;

    if (!uid) return;
    if (!userInput) return;
    if (userInputError) return;

    var newItem = {url: userInput};

    firebase.database()
      .ref(`users/${uid}/bookmarks`)
      .child("items").push(newItem);

    this.setState({userInput:""});

    // fetch title and desc?
  }

  handleChange(e)
  {
    const val = e.target.value;
    const validateURL = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;

    var newState = {userInput: val};

    if (val === "" || validateURL.test(val))
      newState.userInputError = ""
    else
      newState.userInputError = "Invalid URL!"

    this.setState(newState);
  }

  handleKeyPress(e)
  {
    if (e.key === "Enter")
      this.handleAdd();
  }

  render() {
    const {uid, popupAction} = this.props;
    const {userInput, userInputError, userSortOrder, bookmarks} = this.state;

    var keys = Object.keys(bookmarks);

    if (userSortOrder === "name")
      keys = keys.sort((a,b) => keys[a]-keys[b]);
    else // by Added (reversed)
      keys = keys.reverse();

    return (<Card>
      <CardTitle title="Bookmarks">
      <IconMenu
        iconButtonElement={<IconButton><MoreVertIcon color={this.props.darkTheme?fullWhite:fullBlack}/></IconButton>}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        style={{position:"absolute", top:3, right:4}}
      >
        <MenuItem primaryText={userSortOrder === "name" ? <b>Sort by name</b> : "Sort by name" } onTouchTap={() => this.setState({userSortOrder:"name"})} />
        <MenuItem primaryText={userSortOrder === "added" ? <b>Sort by added</b> : "Sort by added" } onTouchTap={() => this.setState({userSortOrder:"added"})} />
      </IconMenu>
    </CardTitle>

    <CardActions style={{paddingBottom:0, textAlign: 'center'}}>
      <TextField hintText="Enter an URL"
        style={{marginLeft:"10px"}}
        value={userInput}
        errorText={userInputError}
        onChange={this.handleChange.bind(this)}
        onKeyPress={this.handleKeyPress.bind(this)}
      />

      <RaisedButton label="Add"
        onTouchTap={this.handleAdd.bind(this)}
      />
    </CardActions>

    <CardText style={{paddingTop:0, overflowY:'hidden', display:'flex', justifyContent:'center'}}>
      <List> { !uid
        ? <ListItem>
            <RaisedButton label="Log in to use this widget" onTouchTap={popupAction} />
          </ListItem>

        : keys.map(k =>
          {
            return <ListItem key={k}
              insetChildren={true}
              style={{overflow:"hidden", whiteSpace:"nowrap" }}
              primaryText={<Link to={bookmarks[k].url} />}
              leftIcon={<Favicon url={bookmarks[k].url} />}
              rightIcon={<Delete id={k} color="white" hoverColor="#757575"
                                 onTouchTap={() => this.handleDelete(k)} />}
            />
          }
        )
      } </List>
    </CardText>
  </Card>);
  }

  handleDelete(id)
  {
    const {uid} = this.props;
    if (!uid) return;

    firebase.database()
      .ref(`users/${uid}/bookmarks/items`)
      .child(id).set(null);
  }
}

class Link extends React.Component
{
    render() {
      const {to} = this.props;

      var [p1, ...p3] = to.replace(/^https?:\/\/(?:www\.)?/i, "")
                          .replace(/\/$/, "")
                          .split("/");


      var p2 = p3.join("/").length > 20-p1.length ? "/..." : ""; // 32
       p3 = p3.length ? "/" + p3.join("/").substr(-20+p1.length) : ""; //32
      return <a href={to} target="_blank">{p1 + p2 + p3}</a>
    }
}

class Favicon extends React.Component
{
  render() {
    const {url} = this.props;
    const style = {
      position: 'absolute',
      top: 8,
      left: 8,
      height: 32,
      width: 32,
    };

    return <img alt={url} style={style}
      src={"http://www.google.com/s2/favicons?domain=" + url}
    />
  }
}

export default Bookmarks;
