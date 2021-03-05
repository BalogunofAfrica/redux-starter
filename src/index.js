import configStore from "./store/configStore";
import { loadBugs, resolveBug } from "./store/bugs";

const store = configStore();

store.dispatch(loadBugs());
setTimeout(() => store.dispatch(resolveBug(2)), 2000);
