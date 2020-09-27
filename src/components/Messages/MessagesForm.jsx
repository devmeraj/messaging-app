import React from 'react';
import {connect} from 'react-redux';
import { Segment, Input, Button,} from 'semantic-ui-react';
import firebase, { storage, addMessages } from '../firebase/firebase.utils';
import FileModal from './FileModal';
import ProgressBar from './ProgressBar';

class MessageForm extends React.Component {
    state = {
        messages: '',
        modal: false,
        errors: [],
        percentage: 0,
        isUploading: false,
        imageURL: ''
    }

    handleChange = e => {
        this.setState({[e.target.name]: e.target.value});
    }

    sendMessage = ({messages, imageURL}) => {

        const publishTime = firebase.firestore.FieldValue.serverTimestamp();
        const {user, currentChannel} = this.props;
        const message = {
            user,
            published: publishTime
        };

        if(imageURL){
            message.image = imageURL; 
            this.setState({imageURL: ''});
        } else if (messages) {
            message.content = messages;
            this.setState({messages: ''});
        }
        addMessages(message, currentChannel);
        
    }
    
    
    handleSubmit = e => {
        e.preventDefault();
        const {messages, errors} = this.state;
        if(messages){
            this.sendMessage(this.state);
        } else {
            this.setState({errors: errors.concat("Add Messages")});
        }
    }

    
    uploadFile = (file) => {
        if(file) {
            const storageRef = storage.ref();
            const mediaUrl = this.props.isPrivateChannel ? `private-${this.props.currentChannel.id}` : 'public';

            const uploadTask = storageRef.child(`chat/${mediaUrl}/${file.name}`).put(file);
            uploadTask.on('state_changed', (snapshot) => {
                this.setState({isUploading: true});

                const percent = ( snapshot.bytesTransferred / snapshot.totalBytes ) * 100;
                this.setState({percentage: percent});
            }, (error) => {
                console.error(error);
                this.setState({errors: this.state.error.concat(error)});
            }, () => {
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    this.setState({
                        imageURL: downloadURL,
                    });
                    
                    this.setState({isUploading: false});
                    this.sendMessage(this.state);
                }).catch((error) => {
                    console.error(error);
                    this.setState({errors: this.state.error.concat(error)});

                })
            });
            
        }

        
        
    }

    openModal = () => this.setState({modal: true});

    closeModal = () => this.setState({modal: false});
    
    getFile = (file) => {
        if(!file) return;
        this.uploadFile(file);
    }
    

    render(){
        const {messages} = this.state;
        return (
            <Segment className="messages__form">
                <Input
                    fluid
                    name="messages"
                    style={{ marginBottom: '0.7em'}}
                    label={<Button icon={'add'} />}
                    labelPosition="left"
                    placeholder="Write your message"
                    value={messages}
                    onChange={this.handleChange}
                />
                <FileModal modal={this.state.modal} closeModal={this.closeModal} getFile={this.getFile} />
                <Button.Group icon widths="2">
                    <Button
                        color="orange"
                        content="Add Reply"
                        labelPosition="left"
                        icon="edit"
                        onClick={this.handleSubmit}
                    />

                    <Button
                        color="teal"
                        content="Upload Media"
                        labelPosition="right"
                        icon="cloud upload"
                        onClick={this.openModal}
                    />
                </Button.Group>
                <ProgressBar percentage={this.state.percentage} uploading={this.state.isUploading} />
            </Segment>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.currentUser.currentUser,
        currentChannel: state.channel.currentChannel,
        isPrivateChannel: state.channel.isPrivateChannel
    }
}
export default connect(mapStateToProps)(MessageForm);