import gql from 'graphql-tag';

const GET_USER = gql`
  query  getUser ($uid: String! ) {
    users_by_pk( uid: $uid ) {
      email first_name id
    }
  }
`;

export const GET_USERS = gql`
  query MyQuery {
  users {
    id
    first_name
    last_name
    email
  }
}
`;

export default {
  auth: {
    getUser: GET_USER,
    getUsers: GET_USERS,
  },
};