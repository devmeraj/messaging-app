import { combineReducers } from 'redux';
import authReducers from './auth.reducer';
import channelReducer from './channalReducer'

export default combineReducers({
    currentUser: authReducers,
    channel: channelReducer
});