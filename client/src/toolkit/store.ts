import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user";
import videoReducer from "./videos";
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
import storage from "redux-persist/lib/storage";
import persistCombineReducers from "redux-persist/es/persistCombineReducers";
//import {PersistGate} from 'redux-persist/integration/react'
//import persistCombineReducers from 'redux-persist/es/persistCombineReducers';
const persistConfig = {
    key: "root",
    version: 1,
    storage,
};
const rootReducer=persistCombineReducers(persistConfig,{user:userReducer,video:videoReducer})
const persistReducers = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistReducers,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});
export const persistor = persistStore(store);
