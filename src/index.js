import configStore from "./store/configStore";

const store = configStore();

store.dispatch({ type: "x", payload: { message: "This one don cast" } });

store.dispatch((dispatch, getState) => {
  dispatch({ type: "bugsReceived", bugs: [1, 2, 3] });
  console.log(getState());
});
