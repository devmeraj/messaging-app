import React, {useState, useEffect} from 'react';
import {Menu, Icon} from 'semantic-ui-react';
import {firestore, database} from '../firebase/firebase.utils';
import {connect} from 'react-redux';
import {currentChannel, isPrivateChannel } from '../Redux/actions';


const DirectMessages = (props) => {
    const [users, setUsers] = useState([]);
    const [selectedChannel, setSelectedChannel] = useState('');
    const [loading, setLoading] = useState(true);
    const usersRef = firestore.collection("users");
    const { currentUser } = props.currentUser;
    const currentUserId = currentUser ? currentUser.id : '';
    
    const userOnlineStat = (users, userKey, connected) => {
        const modifiedUsers = users.map(user => {
            if(userKey === user.id) {
                user['status'] = connected ? "online" : "offline";
            }
            return user;
        });
        setUsers(modifiedUsers);
    }
    
    const getUsers = () => {
        let updatedUsers = [];
        return usersRef.onSnapshot((snapshot)=> {
        if(snapshot.size){        
            updatedUsers = snapshot.docs.reduce((acc, doc) => {
                if(doc.id !== currentUserId){
                const user = {
                    id: doc.id,
                    ...doc.data(),
                }
                acc.push(user);
                
            }
            return acc;
        }, []);
            setUsers(updatedUsers);
            listenPresenceChange(updatedUsers);
            setLoading(false);
            
        } else {
            setLoading(false);
        }
        
        

        }, (error) => {
            console.error(error);
        } );
    }

    const getPresence = () => {
        if(!currentUserId) return;
        const presenceRef = database.ref(`presence`);
            
        database.ref('.info/connected').on('value', function(snapshot) {
            const ref = presenceRef.child(currentUserId);
            
            if(snapshot.val() === true) {
                ref.set(true);
                ref.onDisconnect().remove().then((err) => {
                    console.error(err);
                });
            }
        });
        

    }

    const listenPresenceChange = (users) => {
        database.ref('presence').on('child_added', (snapshot) => {
            userOnlineStat(users, snapshot.key, true)
        });

        database.ref('presence').on('child_removed', (snapshot) => {
            userOnlineStat(users, snapshot.key, false);
        })
    }


    useEffect(() => {

        const unsubscribeFirestore = getUsers();
        getPresence();

        return () => {
            unsubscribeFirestore();
        }
    }, []);

    

    const getChannelId = (userId) => {
        return currentUserId > userId ? `${userId}${currentUserId}` : `${currentUserId}${userId}`;
    }

    
    const selectPrivateChannel = (user) => {
        setSelectedChannel(user.id);
        const channelId =  getChannelId(user.id);
        const privateChannel = {
            id: channelId,
            name: user.displayName
        }

        props.currentChannel(privateChannel);
        props.isPrivateChannel(true);
    }

    const displayUsers = () => {
        if(users.length > 0) {
            return users.map((user) => (
                <Menu.Item
                    key={user.id}
                    active={ user.id === selectedChannel}
                    onClick={() => selectPrivateChannel(user)}
                    style={{opacity: 0.7, fontStyle: 'italic'}}
                >
                    <Icon name="circle" color={user.status === 'online'? 'green' : 'red'} />
                    {user.displayName}
                </Menu.Item>
            ));
        }
    }

    return (
        <Menu.Menu className="menu">
            {/* {console.log(users, loading)} */}
            <Menu.Item>
                <span>
                    <Icon name="mail" /> DIRECT MESSAGES
                </span>
                ({users.length})
            </Menu.Item>
            {displayUsers()}
        </Menu.Menu>
    )
}
const mapStateToProps = state => {
    return {
        currentUser: state.currentUser
    }
}
export default connect(mapStateToProps, {currentChannel, isPrivateChannel})(DirectMessages);