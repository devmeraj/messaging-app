const INITIAL_STATE = {
    currentChannel: null
}
const channelReducer = (state = INITIAL_STATE, action) => {
    switch( action.type ) {
        case 'SET_CURRENT_CHANNEL':
            return { ...state , currentChannel: action.payload };
        case 'SET_PRIVATE_CHANNEL':
            return {...state, isPrivateChannel: action.payload}
        default:
            return state;
    }
}

export default channelReducer;