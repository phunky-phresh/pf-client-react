import { createContext } from 'react';

export const Auth = createContext({
  authUser: {},
  token: '',
  uid: '',
  isAuthentication: false,
  isAuthenticated: false,
  updateAuth: () => {},
  signIn: () => {},
  signOut: () => {}
});

export default {
  Auth
};