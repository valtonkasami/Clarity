"use client"
import { PersistGate } from 'redux-persist/integration/react'
import { ReactNode } from "react";
import { store } from "./store";
import { Provider } from "react-redux";
import { persistor } from './store';

export function Providers({children}: {children: ReactNode}) {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
            {children}
            </PersistGate>
        </Provider>
    )
}