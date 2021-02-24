import store from "./store";
import { bugAdded, bugRemoved, bugResolved } from "./actions";

console.log(store);

const unsubscribe = store.subscribe(() =>
  console.log("Store changed", store.getState())
);

store.dispatch(bugAdded("Bug1"));
store.dispatch(bugResolved(1, "Bug1"));

unsubscribe();

store.dispatch(bugRemoved());

console.log(store.getState());
