import configStore from "./store/configStore";
import { projectAdded } from "./store/projects";

const store = configStore();

store.subscribe(() => console.log("Store Changed!"));

// store.dispatch(actions.bugAdded({ description: "Bug 1" }));
// store.dispatch(actions.bugAdded({ description: "Bug 2" }));
// store.dispatch(actions.bugAdded({ description: "Bug 3" }));
// store.dispatch(actions.bugResolved({ id: 1 }));
store.dispatch(projectAdded({ name: "Project 1" }));

console.log(store.getState());
