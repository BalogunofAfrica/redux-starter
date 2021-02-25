import reducer from "./reducer";

function createStore(reducer) {
  let state;
  let listeners = [];

  const dispatch = (action) => {
    state = reducer(state, action);
    for (let i = 0; i < listeners.length; i++) listeners[i]();
  };

  const getState = () => state;

  const subscribe = (listener) => listeners.push(listener);
  return {
    dispatch,
    getState,
    subscribe,
  };
}

export default createStore(reducer);
