import React, { useContext, useEffect, useState } from 'react';
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

 export default function Firebase () {
  const apolloClient = useApolloClient();
  const { updateAuth, authUser, uid, isAuthenticated } = useContext( Services.Auth );
  // const [ uToken, setToken ] = useState('');

  // const signIn = () => {
  //   firebase.auth().signInWithPopup(provider).then(function(result) {
  //   const token = result.credential.accessToken;
  //   console.log(result);
  //   // setToken(token);
  //   const user = result.user;
  // }).catch(function(error) {
  //   console.log(error);
  // });
  // }

  useEffect(() => {
    console.log("this");
    
    ( async () => {
      const authUserUid = _.get( authUser, "uid");
      if ( uid && uid !== authUserUid ) {
        const userRes = await apolloClient.query({ query: Queries.auth.getUser, variables: { uid }});
        const authUser = _.get(userRes, " data.users_by_pk");
        updateAuth({ authUser, isAuthenitcating: false });
      }
      if ( !uid ) updateAuth({ authUser: {} });
    })();
  }, [ uid ]);

  useEffect(() => {
    updateAuth({
      signIn: async () => await firebase.auth().signInWithPopup(provider),
      signOut: () => firebase.auth().signOut(),
    });

    firebase.auth().onAuthStateChanged( async user => {
      updateAuth({ isAuthenitcating: true });
      if ( user ) {
        const token = await user.getIdToken();
        const idTokenResult = await user.getIdTokenResult();
        const hasuraClaim = idTokenResult.claims[ "https://hasura.io/jwt/claims" ];
        console.log(token);
        
        if ( hasuraClaim ) updateAuth({ token, uid: user.uid });
      } else {
        updateAuth({ authUser: {}, token: null, uid: "", isAuthenitcating: false });
      }
    });
  }, []);

  return(
    <div>
      
    </div>
  );
} 



// export function SignOut() {
//   const signOut = firebase.auth().signOut().then(function() {
//     console.log('sign out');

//   }).catch( function(error) {
//     console.log(error);
    
//   })
// }