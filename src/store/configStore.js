import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";

import logger from "./middleware/logger";
import toast from "./middleware/toast";
import api from "./middleware/api";
import reducer from "./reducer";

export default () => {
  return configureStore({
    reducer,
    middleware: [
      ...getDefaultMiddleware(),
      // logger({ destination: "console" }),
      toast,
      api,
    ],
  });
};
