import { configureStore } from "@reduxjs/toolkit";

import { accesstockenSlice } from "./redux-slice";

export const store = configureStore({
  reducer: {
    accessTocken: accesstockenSlice,
  },
});
