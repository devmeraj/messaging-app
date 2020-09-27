import React, {useEffect, useState} from 'react';
import { Comment, Segment } from 'semantic-ui-react';
import { firestore } from '../firebase/firebase.utils';
import MessagesHeader from './MessagesHeader';
import MessagesForm from './MessagesForm';
import { connect } from 'react-redux';
import Message from './Message';

const displayMessages = (messages, currentUser) => (
    messages.length > 0 && messages.map(message => (
        <Message message={message} key={message.id} currentUser={currentUser} />
        )
    )
);

const Messages = (props) => {
    const [messages, setMessages] = useState([]);
    const [searchedMessages, setSearchedMessages] = useState([]);
    const [users, setUsers] = useState(0);

    const [searchTerm, setSearchTerm] = useState('');
    
    const countUniqueUsers = (messages) => {
        // if(messages.leng) return;
        const allUsers = messages.length > 0 && messages.reduce((acc, message) => {
            
            if(!acc.includes(message.user.displayName)) {
            
                acc.push(message.user.displayName);
                
            }           
            return acc;
        }, [])
        setUsers(allUsers.length);
    }


    const getMessages = (channel) => {
        const collectionRef = firestore.collection('messages').doc(channel.id).collection('message');
        collectionRef.onSnapshot((snapshot) => {
            const messages = snapshot.docs.map((doc) => {
                const message = {
                    id: doc.id,
                    ...doc.data()
                }
                return message;
            });
            
            setMessages(messages);
            countUniqueUsers(messages);
        })
    }

    const fetchMessages = async () => {
        const {channel} = props;
        
        if(channel){
            const messages = await getMessages(channel);
            setMessages({messages});
        }
        
    }
    useEffect(() => {
        fetchMessages();
        setSearchedMessages([]);
    }, [props.channel]);
    
    useEffect(() => {
        if (messages.length > 0 && searchTerm) {
            searchMessage(searchTerm);
            
        }

    }, [searchTerm]);

    const searchMessage = (term) => {
    const channelMessages = [...messages];

    const regex = new RegExp(term.searchTerm, "gi");
    const searchResults = channelMessages.filter((message)=> {
        return (message.content && message.content.match(regex)) || message.user.displayName.match(regex);
    })
    
    setSearchedMessages(searchResults);
    console.log(searchResults);
    
    }

    const handleTermChange = e => {
        setSearchTerm({searchTerm: e.target.value});
    }

    

    const {currentUser, channel} = props;
        return (
            <React.Fragment>
                
                <MessagesHeader isPrivateChannel={props.isPrivateChannel} channel={channel} users={users} handleChange={handleTermChange} />
                <Segment>
                    <Comment.Group className="messages">
                        {searchedMessages.length > 0 ? displayMessages(searchedMessages, currentUser) : displayMessages(messages, currentUser)}
                    </Comment.Group>
                </Segment>

                <MessagesForm />
            </React.Fragment>
        );
}
const mapStateToProps = state => {
    return {
        channel: state.channel.currentChannel,
        currentUser: state.currentUser.currentUser,
    }
}
export default connect(mapStateToProps)(Messages);  