import React from 'react';

import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
// import  { HttpLink } from 'apollo-link-http';
import { ApolloProvider } from '@apollo/react-hooks';
import { gql, HttpLink } from 'apollo-boost';
import Landing from './pages/Landing';


// const client = new ApolloClient ({
//   uri: 'https://hasuraql-pf.herokuapp.com/v1/graphql',
// });



const createApolloClient = (authToken) => {
  return new ApolloClient({
    link: new HttpLink({
      uri: 'https://hasuraql-pf.herokuapp.com/v1/graphql',
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    }),
    cache: new InMemoryCache(),
  });
 };

 const client = createApolloClient();

 


function App() {
  return (
    <ApolloProvider client={client}>
      <div>
        <Landing />
      </div>
    </ApolloProvider>
  );
}

export default App;
