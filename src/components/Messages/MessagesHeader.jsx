import React from 'react';
import { Header, Segment, Input, Icon } from 'semantic-ui-react';

class MessagesHeader extends React.Component {
    
    displayChannelName = (channal) => (
        channal ? channal.name : ''
    )

    
    usersInChannel = users => {
        const pluralOrSingular = ' User' + (users > 1 ? 's' : '');
        return users ? users + pluralOrSingular : '';
    }
    render() {
        const {channel, users, handleChange, isPrivateChannel} = this.props;
        return (
            <Segment clearing>
                <Header fluid="true" as="h2" floated="left" style={{marginBottom: 0}} >
                    <span>
                        {isPrivateChannel ? '@' : '#'}
                        {this.displayChannelName(channel)}
                        <Icon name="star outline" color="black" />
                    </span>

                    <Header.Subheader>{this.usersInChannel(users)}</Header.Subheader>
                </Header>

                {/* Channel Search Input */}
                <Header floated="right">
                    <Input 
                        size="mini"
                        icon="search"
                        name="searchTerm"
                        placeholder="Search Messages"
                        onChange={handleChange}
                    />
                </Header>
            </Segment>
        );
    }
}

export default MessagesHeader;