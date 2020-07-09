import gql from 'graphql-tag';

const GET_USER = gql`
  query  getUser ($uid: String! ) {
    users_by_pk( uid: $uid ) {
      email first_name id
    }
  }
`;

export default {
  auth: {
    getUser: GET_USER
  },
};