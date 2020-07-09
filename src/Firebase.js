import React, { useContext, useEffect } from 'react';
import firebase from 'firebase/app';
import "firebase/auth";
import _ from 'lodash';
import { useApolloCLient } from '@apollo/react-hooks';

import Services from "./services";
import Queries from "./queries";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DB_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  // storageBucket: "oauthpf.appspot.com",
  // messagingSenderId: "513366750547",
  // appId: "1:513366750547:web:f813fff6540dab3ea85da6",
  // measurementId: "G-GZVKKZNPMS"
};
  
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default function Firebase ({ children }) {

  const apolloCLient = useApolloCLient();
  const { updateAuth, authUser, uid, isAuthenticated } = useContext(Services.Auth)

  useEffect(() => {
    (async () => {
      const authUserUid = _.get( authUser, "uid" );
      if (uid && uid !== authUserUid ) {
        const userRes = await apolloCLient.query({ query: Queries.auth.getUser, variables: { uid }});
        const authUser = _.get( userRes, "data.users_by_pk");
        updateAuth({ authUser, isAuthentication: false });
      }
      if ( !uid ) updateAuth({ authUser: {}});
    })();
  }, [ uid ]);

  useEffect(() => {
    if (_.isEmpty( authUser ) && isAuthenticated !== false ) updateAuth({ isAuthenticated: false });
    if (!_.isEmpty( authUser ) && isAuthenticated !== true ) updateAuth({ isAuthenticated: true });
  }, [ authUser ]);

  return (
    <>
      { children && children }
    </>
  );


}