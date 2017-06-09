import React from 'react';
import {CardMedia} from 'material-ui/Card';




const VideoDetail = ({video}) => {
    if(!video){
        return <p>Loading...</p>
    }

    const videoId = video.id.videoId;
    const url = `https://www.youtube.com/embed/${videoId}`;

    return (
        <CardMedia mediaStyle={{width: '100%'}}>
            <iframe style={{height: 300}} src={url}/>
            {/*<CardText className="details">
                {video.snippet.description}
            </CardText>*/}
        </CardMedia>
    );

};

export default VideoDetail;