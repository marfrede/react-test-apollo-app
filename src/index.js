import { ApolloClient, HttpLink, InMemoryCache, gql, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

const httpLink = new HttpLink({
  uri: 'https://localhost:5001/graphql',
});

const wsLink = new GraphQLWsLink(createClient({ url: 'wss://localhost:5001/graphql' }));

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

client
  .query({
    query: gql`
      query {
        aliens {
          name,
          planet
        }
      }
    `,
    errorPolicy: 'all'
  })
  .then((result) => console.log('query result :', result))
  .catch((error) => console.log('query error: ', error));

client
  .subscribe({
    query: gql`
      subscription {
        alienChanged {
          name,
        }
      }
    `,
    errorPolicy: 'all'
  }).subscribe({
    next: (result) => console.log('subscription result :', result),
    error: (error) => console.log('subscription error: ', error),
  });