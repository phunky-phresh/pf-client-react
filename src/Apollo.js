import React, { useContext } from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-client';
// import { WebSocketLink } from 'apollo-link-ws';
import { HttpLink } from "apollo-link-http";
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';

import Services from './services';

export default function Apollo ({ children }) {
  const { token } = useContext( Services.Auth );

  const httpLink = new HttpLink({
    uri: "https://hasuraql-pf.herokuapp.com/v1/graphql",
    headers: token ? { Authorization: `Bearer ${ token }` } : {},
  });

  const link = split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition( query );
      return kind === "OperationDefinition" && operation === "subscription";
    },
    httpLink
  );

  const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      { children }
    </ApolloProvider>
  );
};