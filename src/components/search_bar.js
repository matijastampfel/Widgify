import React, {Component} from 'react';
import TextField from 'material-ui/TextField';


class SearchBar extends Component {
    constructor(props){
        super(props);

        this.state = { term: ''};
        
    }
    onInputChange = (term) =>{
        this.setState({term});
        this.props.onSearchTermChange(term);
    };

    render(){
         return (
             <TextField floatingLabelText="search for video" value={this.state.term} hintText="ex. Miike Snow - Genghis Khan" fullWidth={true} onChange={(event)=>this.onInputChange(event.target.value)}/>
         );
    }
}



export default SearchBar;