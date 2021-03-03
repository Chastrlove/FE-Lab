const initialState = {
    count: 0
}

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'add':
            return {
                ...state,
                count: state.count+1
            }
        default:
            return state
    }
}
