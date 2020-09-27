const INITIAL_STATE = {
    currentUser: null,
    isLoading: true
}

const authReducers = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case 'SET_USER':
            return {...state, currentUser: action.payload, isLoading: false};
        case 'UNSET_USER':
            return {...INITIAL_STATE, isLoading: false };
        default:
            return state;
    }
}

export default authReducers;