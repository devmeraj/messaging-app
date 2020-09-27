import React from 'react';
import { Image, Comment } from 'semantic-ui-react';
import moment from 'moment';

const timeFromNow = published => {
    if(!published) return;
    moment(published).fromNow()
};

const messageSelf = (user, currentUser) => (
    user.id === currentUser.id ? 'message__self' : ''
);
const Message = ({message, currentUser}) => {
    const { image, content , published, user} = message;
    return (
    <Comment>
        <Comment.Avatar src={user.photoURL} />
        <Comment.Content className={messageSelf(user, currentUser)}>
            <Comment.Author as="a">{user.displayName}</Comment.Author>
            <Comment.Metadata>{timeFromNow(published)}</Comment.Metadata>
            {image ?
                <Image src={image} className="message__image" /> : 
                <Comment.Text>{content}</Comment.Text>
            }
        </Comment.Content>
    </Comment>
    );
}

export default Message;