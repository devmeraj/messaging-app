import React from 'react';
import { firestore } from '../firebase/firebase.utils';
import { connect } from 'react-redux';
import { currentChannel, isPrivateChannel } from '../Redux/actions';
import { Menu, Modal, Icon, Form, Input, Button, Label } from 'semantic-ui-react';

class channels extends React.Component {
    state = {
        selectedChannel: '',
        channels: [],
        channelName: '',
        channelDetails: '',
        modal: false,
        notifications: []
    }

    handleChange = e => {
        this.setState({[e.target.name]: e.target.value});
    }

    openModal = () => {
        this.setState({modal: true});
    }

    closeModal = () => {
        this.setState({modal: false});
    }

    isFormValid = ({channelName, channelDetails}) => channelName && channelDetails;

    addchannel = async () => {
        const {channelName, channelDetails} = this.state;
        const {currentUser: {displayName, photoURL}} = this.props;
        const collectionRef = firestore.collection('/channels');
        
        await collectionRef.doc().set({
            name: channelName,
            details: channelDetails,
            createdBy: {
                name: displayName,
                avatar: photoURL
            }
        });

        this.setState({modal: false});
    }

    selectchannel = (channel) => {
        this.setState({selectedChannel: channel});
        this.props.currentChannel(channel);
        this.props.isPrivateChannel(false);
        this.clearNotification(channel);
    }

    activechannel = (channelId) => {
        const {selectedChannel} = this.state;
        if ( selectedChannel ) {
         return selectedChannel.id === channelId;
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        if(this.isFormValid(this.state)){
            this.addchannel();
        }
        this.setState({
            channelName: '',
            channelDetails: ''
        });
    }

    selectFirstchannelOnLoad(channels) {
        const { currentChannel, isPrivateChannel } = this.props;
        const {selectedChannel} = this.state;
        const firstchannel = this.state.channels[0];
        
        if(channels.length > 0 && !selectedChannel) {    
            this.setState({selectedChannel: firstchannel});
            currentChannel(firstchannel);
            isPrivateChannel(false);
            
        }
        
    }
    

    clearNotification = (channel) => {
        
        const index  = this.state.notifications.findIndex((notification) => {
             return notification.id === channel.id;
        });
        
        if(index !== -1){
            const updatedNotifications = [...this.state.notifications];
            updatedNotifications[index].count = 0;
            updatedNotifications[index].total = updatedNotifications[index].lastKnownTotal;
            this.setState({notifications: updatedNotifications});
        }

        
    }
    updateNotifications = [...this.state.notifications];

    addNotificationListner = (snap, channelId) => {
        let lastTotal = 0;

        const index = this.state.notifications.findIndex(
            notification => notification.id === channelId
        );

        if (index !== -1){
            
            if(channelId !== this.state.selectedChannel.id){
                lastTotal = this.state.notifications[index].total;
                if ((snap.size - lastTotal) > 0) {
                        this.updateNotifications[index].count = snap.size - lastTotal;
                    }
            }
            this.updateNotifications[index].lastKnownTotal = snap.size;
        } else {
            this.updateNotifications.push({
                id: channelId,
                total: snap.size,
                lastKnownTotal: snap.size,
                count: 0
            });
        }
        console.log(this.updateNotifications)
        this.setState({notifications: this.updateNotifications});
    }

    componentDidMount() {
        const channelsRef = firestore.collection('channels');
        const messagesRef = firestore.collection('messages');
        channelsRef.onSnapshot((snapshot) => {

            const channels = snapshot.docs.map(doc => {
                const {name, details} = doc.data();

                messagesRef.doc(doc.id).collection('message').onSnapshot((snap) => {
                    this.addNotificationListner(snap, doc.id)
                });

                return {
                    id: doc.id,
                    name,
                    details
                }

                
            });
            this.setState({channels});
            this.selectFirstchannelOnLoad(channels);
            
        });

        

        
    }

    getNotificationCount = (channel) => {
        let count = 0;

        

        this.state.notifications.forEach((notification) => {
            if(notification.id === channel.id) {
                count = notification.count;
            }
        })

        return count > 0 ? count : '';
        
    }

    displaychannel = () => {
        const {channels} = this.state;
        return channels.length > 0 && channels.map((channel) => {
            return (
                <Menu.Item
                    key={channel.id}
                    onClick={() => this.selectchannel(channel)}
                    name={channel.name}
                    style={{opacity: 0.7}}
                    active={this.activechannel(channel.id)}
                >
                    {this.getNotificationCount(channel) && (
                        <Label color="red">{this.getNotificationCount(channel)}</Label>
                    )}
                    # {channel.name} 
                </Menu.Item>
            );
        });
    }

    render() {
        const {channels} = this.state;
        const {modal, channelDetails, channelName} = this.state;
        return (
            <React.Fragment>
                <Menu.Menu style={{ paddingBottom: '2em'}} >
                    <Menu.Item>
                        <span>
                            <Icon name="exchange" /> channels {" "}
                        </span>
                        ({channels.length})<Icon name="add" onClick={this.openModal} />
                    </Menu.Item>

                    {this.displaychannel()}
                    
                </Menu.Menu>                

                <Modal basic open={modal} onClose={this.closeModal}>
                    <Modal.Header>Add a channel</Modal.Header>
                    <Modal.Content>
                        <Form>
                            <Form.Field>
                                <Input
                                    fluid
                                    label="Name of channel"
                                    value={channelName}
                                    name="channelName"
                                    onChange={this.handleChange}
                                />
                            </Form.Field>

                            <Form.Field>
                                <Input
                                    fluid
                                    label="About the channel"
                                    name="channelDetails"
                                    value={channelDetails}
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="green" onClick={this.handleSubmit} inverted>
                            <Icon name="checkmark" /> Add
                        </Button>

                        <Button color="red" onClick={this.closeModal}>
                            <Icon name="remove" /> Cancel
                        </Button>
                    </Modal.Actions>
                </Modal>
            </React.Fragment>
            
        )
    }
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser.currentUser
    }
}

export default connect(mapStateToProps, {currentChannel, isPrivateChannel})(channels);