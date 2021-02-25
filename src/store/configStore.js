import { configureStore } from "@reduxjs/toolkit";
import reducer from "./projects";

export default () => {
  return configureStore({ reducer });
};
