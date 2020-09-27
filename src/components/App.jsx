import React from "react";
import {Grid} from 'semantic-ui-react';
import './App.css';

import ColorPanel from './ColorPanel/ColorPanel';
import SidePanel from './SidePanel/SidePanel';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPanel/MetaPanel';
import Spninner from './Spinner/Spinner';
import { connect } from "react-redux";

class App extends React.Component {
    render(){
        return this.props.isLoading ? <Spninner /> :
                ( <Grid columns="equal" className="app" style={{background: '#eee'}}>
                <ColorPanel />
                <SidePanel />

                <Grid.Column style={{marginLeft: 320}}>
                    <Messages isPrivateChannel={this.props.isPrivateChannel} />
                </Grid.Column>

                <Grid.Column width={4}>
                    <MetaPanel />
                </Grid.Column>
            </Grid>
        )
    }
}

const mapStateToProps = (state) => {
    
    return {
        isLoading: state.currentUser.isLoading,
        isPrivateChannel: state.channel.isPrivateChannel
    }
}
export default connect(mapStateToProps)(App);