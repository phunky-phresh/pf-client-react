import React, { useContext, useEffect } from 'react';
import PropTypes from "prop-types";
import firebase from 'firebase/app';
import "firebase/auth";
import _ from 'lodash';
import { useApolloClient } from '@apollo/react-hooks';

import Services from "./services";
import Queries from "./queries";
import firebaseConfig from './firebase.config';

  
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
  const provider = new firebase.auth.GoogleAuthProvider();

 export default function Firebase ({ children }) {
  const apolloClient = useApolloClient();
  const { updateAuth, authUser, uid, isAuthenticated } = useContext( Services.Auth );
  
  console.log( uid, authUser )

  useEffect(() => {
    console.log("this");
    
    ( async () => {
      const authUserUid = _.get( authUser, "uid");
      console.log( authUserUid )
      if ( uid && uid !== authUserUid ) {
        console.log( "here")
        const userRes = await apolloClient.query({ query: Queries.auth.getUser, variables: { uid }});
        console.log( userRes )
        const authUser = _.get(userRes, "data.users_by_pk");
        console.log(authUser);
        updateAuth({ authUser, isAuthenticating: false });
      }
      if ( !uid ) updateAuth({ authUser: {} });
    })();
  // eslint-disable-next-line
  }, [ uid ]);

  useEffect(() => {    
    updateAuth({
      signIn: async () => await firebase.auth().signInWithPopup(provider),
      signOut: () => firebase.auth().signOut(),
    });

    firebase.auth().onAuthStateChanged( async user => {
      updateAuth({ isAuthenticating: true });
      if ( user ) {
        const token = await user.getIdToken();
        const idTokenResult = await user.getIdTokenResult();
        const hasuraClaim = idTokenResult.claims[ "https://hasura.io/jwt/claims" ];      
        if ( hasuraClaim ) {          
          updateAuth({ token, uid: user.uid });
        }
      } else {
        updateAuth({ authUser: {}, token: null, uid: "", isAuthenticating: false });
      }
    });
  // eslint-disable-next-line
  }, []);

  useEffect(() => { 
		if ( _.isEmpty( authUser ) && isAuthenticated !== false ) updateAuth({ isAuthenticated: false });
		if ( !_.isEmpty( authUser ) && isAuthenticated !== true ) updateAuth({ isAuthenticated: true });
	// eslint-disable-next-line
	}, [ authUser ]);

  return(
    <>
      { children && children }
    </>
  );
}; 

Firebase.propTypes = {
	children: PropTypes.node,
};

