import { combineReducer } from "./combineReducer";

const initialState = {
    count: 0
}

export const countReducer = (state = initialState, action) => {
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

const infoInitialState = {
    count: 0
}

export const infoReducer = (state = infoInitialState, action) => {
    switch (action.type) {
        case 'SET_NAME':
            return {
                ...state,
                name: action.name
            }
        case 'SET_DESCRIPTION':
            return {
                ...state,
                description: action.description
            }
        default:
            return state;
    }
}

export const reducer = combineReducer({
    counter:countReducer,
    info:infoReducer
})
