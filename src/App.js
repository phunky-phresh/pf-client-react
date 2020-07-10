import React, { useState, useEffect, lazy } from 'react';
import _ from 'lodash';

import FirebaseProvider from './Firebase';
import ApolloProvider from './Apollo';
import Services from './services';
import Landing from './pages/Landing';
 


export default function App() {

  const { Auth } = Services;
  const [ auth, setAuth ] = useState({
    authUser: {},
    token: "",
    uid: "",
    isAuthenticating: true,
		isAuthenticated: false,
		updateAuth: payload => setAuth( auth => ({ ...auth, ...payload })),
		signIn: () => {},
		signOut: () => {},
  });

  return (
    <Auth.Provider value={ auth }>
      <ApolloProvider>
      {/* <FirebaseProvider> */}
        <Landing />
      {/* </FirebaseProvider> */}
    </ApolloProvider>
    </Auth.Provider>

  );
}

// export default App;
