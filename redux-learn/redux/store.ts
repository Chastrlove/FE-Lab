//最简单的redux

import { reducer } from "./reducer";

export const createStore=(reducer)=>{
    const listeners= []
    let currentState
    const getState=()=>{
        return currentState
    }


    const dispatch=(action)=>{
       currentState=reducer(currentState,action);
        for(let i =0 ;i<listeners.length;i++){
            listeners[i]()
        }
    }
    const subscribe=(listener)=>{
        listeners.push(listener)
        return function unsubscribe(){
            const index =listeners.indexOf(listener)
            listeners.splice(index,1)
        }
    }
    dispatch({
        type:"@INIT"
    })

    return {
        getState,dispatch,subscribe
    }
}

// const store = createStore(reducer)
//
// store.dispatch({
//     type:"add",
//     payload:{
//         count:1
//     }
// })
// console.log(store.getState())


