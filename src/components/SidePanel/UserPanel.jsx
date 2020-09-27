import React from 'react';
import {connect} from 'react-redux';
import {unSetUser} from '../Redux/actions';
import { withRouter } from 'react-router-dom';
import {Grid, Header, Icon, Dropdown, Image} from 'semantic-ui-react';
import { auth } from '../firebase/firebase.utils';

class UserPanel extends React.Component {
    
    name = this.props.user.currentUser ? this.props.user.currentUser.displayName : '';
    dropdownOptions = () => {
        return [
            {
                key: 'user',
                text: <span>Signed in as <strong>{this.name}</strong></span>,
                disabled: true
            },
            {
                key: 'avatar',
                text: <span>Change Avatar</span>
            },
            {
                key: 'signout',
                text: <span onClick={this.handleSignOut}>Sign Out</span>
            }
        ]
    }

    handleSignOut = () =>{
        auth.signOut();
        this.props.history.push('/login');
    }
    render(){
        
        return this.props.user.currentUser ? (
            <Grid style={{background: '#4c3c4c'}}>
                <Grid.Column>
                    <Grid.Row style={{ padding: '1.2em', margin: 0}}>
                        <Header inverted floated="left" as="h2">
                            <Icon name="code" />
                            <Header.Content>DevChat</Header.Content>
                        </Header>
                    </Grid.Row>

                    <Header style={{padding: '0.25em'}} as="h4" inverted>
                        <Dropdown trigger={
                            <span>
                                <Image src={this.props.user.currentUser.photoURL} spaced="right" avatar />
                                {this.props.user.currentUser.displayName}
                            </span>
                        } options={this.dropdownOptions()} />
                    </Header>
                </Grid.Column>
            </Grid>
        ) : '';
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.currentUser
    }
}

export default connect(mapStateToProps, {unSetUser})(withRouter(UserPanel));