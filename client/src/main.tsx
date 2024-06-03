import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import ApolloProviders from './AppoloProvider.tsx'
import { Provider } from 'react-redux'
import { store, persistor } from './toolkit/store.ts';
import { PersistGate } from 'redux-persist/lib/integration/react';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ApolloProviders />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)
