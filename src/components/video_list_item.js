import React from 'react';
import {ListItem} from 'material-ui/List';


const VideoListItem = ({video, onVideoSelect}) => {
    const imageUrl = video.snippet.thumbnails.default.url;
    return (
        <ListItem onTouchTap={()=>onVideoSelect(video)}>
            <img src={imageUrl} alt={video.snippet.title}/><br/>
            {video.snippet.title}
        </ListItem>
    );
};

export default VideoListItem;