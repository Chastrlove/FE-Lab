export const combineReducer = (reducers: { [key: string]: any }) => {
  const keys = Object.keys(reducers);
  return (state={}, action) => {
    const newState ={}
     for(let key of keys){
       const reducer = reducers[key];
       const prevState = state[key];
       newState[key] = reducer(prevState,action)
     }
     return newState
  };
};
