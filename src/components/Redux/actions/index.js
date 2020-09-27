export const setUser = (user) => {
    return {
        type: 'SET_USER',
        payload: user
    }
}

export const unSetUser = (user) => {
    return {
        type: 'UNSET_USER'
    }
}

export const currentChannel = (channel) => ({
    type: 'SET_CURRENT_CHANNEL',
    payload: channel
});

export const isPrivateChannel = (privateChannel) => {
    return {
        type: 'SET_PRIVATE_CHANNEL',
        payload: privateChannel
    }
}