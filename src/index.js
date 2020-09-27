import React from 'react';
import ReactDOM from 'react-dom';
import {Provider, connect} from 'react-redux';
import store from './components/Redux';
import { setUser,unSetUser } from './components/Redux/actions';

import 'semantic-ui-css/semantic.min.css';
import App from './components/App';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

import { BrowserRouter as Router, Switch, Route, withRouter } from 'react-router-dom';
import { auth, createUserProfile } from './components/firebase/firebase.utils';
 
class Root extends React.Component{
    state = {
        currentUser: null
    }

    unsubscribeFromAuth = null;

    componentDidMount(){
        this.unsubscribeFromAuth = auth.onAuthStateChanged(async currentUser => {
            if(currentUser) {
                
                const userRef = await createUserProfile(currentUser, {name: currentUser.displayName, photoURL: currentUser.photoURL});

                await userRef.onSnapshot(snapshot => {
                    this.setState({
                        currentUser: {
                        id: snapshot.id,
                        ...snapshot.data()
                    }});

                    this.props.setUser(this.state.currentUser);
                    
                    this.props.history.push('/')
                    
                })
            } else {
                this.props.unSetUser();
                this.setState({currentUser: null});
                console.log(this.state.currentUser);
                this.props.history.push('/login');
            }

        })
    }


    render(){
        return(
                <Switch>
                    <Route exact path="/" component={App} />
                    <Route path="/login" component={Login}></Route>
                    <Route path="/register" component={Register}></Route>
                </Switch>
        );
    }
}



const ConnectedRoot = withRouter(connect(null, {setUser, unSetUser})(Root));

ReactDOM.render(
<Provider store={store}>
    <Router>
        <ConnectedRoot />
    </Router>
</Provider>
, document.getElementById('root'));