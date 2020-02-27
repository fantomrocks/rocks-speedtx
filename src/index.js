import React from 'react';
import {render} from 'react-dom';
import ApolloClient from 'apollo-boost';
import {ApolloProvider} from '@apollo/react-hooks';
// import * as serviceWorker from './serviceWorker';

// static content
import './style/normalize.css';

// components
import App from './App';

// create the Apollo Client
const client = new ApolloClient({
    uri: 'https://fantom.rocks/api',
});

// render the app encapsulated with the client so we can use the GraphQL API
render((
    <ApolloProvider client={client}>
        <App client={client}/>
    </ApolloProvider>
), document.getElementById('root'));

// un-register from offline use
// serviceWorker.unregister();
