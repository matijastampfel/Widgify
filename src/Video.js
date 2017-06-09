import React, {Component} from 'react';
import SearchBar from './components/search_bar';
import YTSearch from 'youtube-api-search';
import VideoList from './components/video_list';
import VideoDetail from './components/video_detail';
import './App.css';
const API_KEY = 'AIzaSyCQMSAf-4GdhWVd8YrSC43s-OskR0GzT98';
import { Grid, Row, Col } from 'react-flexbox-grid';
import {Card, CardTitle, CardMedia} from 'material-ui/Card';


class Video extends Component {
    constructor(props){
        super(props);

        this.state = {
            videos: [],
            selectedVideo: null
        };

        this.videoSearch("Miike Snow - Genghis Khan");
    }

    videoSearch = (term) =>{
        YTSearch({key: API_KEY, term:term}, (videos)=>{
            this.setState({
                videos: videos,
                selectedVideo:videos[0]
            });

        });

    };
    render() {
        const videoSearch=(term) => {this.videoSearch(term)};

        return (
            <Card>
                <CardTitle title="YouTube Player"/>
                <CardMedia style={{width:'95%', margin:'0 auto'}}>
                    <Grid>
                        <Row>
                            <SearchBar onSearchTermChange={videoSearch} />
                            <Col xs={12} md={8}>
                                <VideoDetail video={this.state.selectedVideo}/>
                            </Col>
                            <Col xs={12} md={4}>
                                Search results:
                                <VideoList onVideoSelect={selectedVideo=>this.setState({selectedVideo})} videos={this.state.videos}/>
                            </Col>
                        </Row>
                    </Grid>
                </CardMedia>


            </Card>
        );
    }}

export default Video