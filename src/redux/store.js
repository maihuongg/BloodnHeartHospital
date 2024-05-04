import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userReducer from "./userSlice";
import eventReducer from "./eventSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "@react-native-async-storage/async-storage";

const persistConfig = {
  key: "root",
  storage
};
//const rootReducer = combineReducers({ auth: authReducer});
//const rootReducer = combineReducers({ auth: authReducer, user: userReducer});
const rootReducer = combineReducers({ auth: authReducer, user: userReducer, event: eventReducer });
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export let persistor = persistStore(store);
// import { configureStore, combineReducers, getDefaultMiddleware } from "@reduxjs/toolkit";
// import { persistStore, persistReducer } from "redux-persist";
// import storage from "@react-native-async-storage/async-storage";
// import authReducer from "./authSlice";
// import userReducer from "./userSlice";

// const persistConfig = {
//   key: "root",
//   storage,
// };

// const rootReducer = combineReducers({ auth: authReducer, user: userReducer });
// const persistedReducer = persistReducer(persistConfig, rootReducer);

// const middleware = getDefaultMiddleware({
//   serializableCheck: {
//     ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//   },
// });

// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware,
// });

// export const persistor = persistStore(store);
