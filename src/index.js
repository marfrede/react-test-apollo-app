import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
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

const client = new ApolloClient({
  uri: 'https://localhost:5001/graphql',
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
  .then((result) => console.log(result));