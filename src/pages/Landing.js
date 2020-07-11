import React, { useState } from 'react';
import SignIn from '../components/signin';
import { useQuery } from '@apollo/react-hooks';
import { GET_USERS } from '../queries';
import _ from 'lodash';

const Landing = ( props) => {
  console.log(props);
  
  const [ firstName, setName ] = useState('');

  const { loading, error, data } = useQuery(GET_USERS);

  const _handleSubmit = (e) => {
    e.preventDefault();
    console.log('ubmit');
  }

  const _handleChange = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    setName(e.target.value);
  }

  if (loading) {
    return <div>Loading....</div>
  }
  const stuff = _.get(data);
  console.log(stuff);
  console.log(data);
  

  return(
    <div>
      <h1>Landing</h1>
     
      <SignIn />
      <form onSubmit={_handleSubmit}>
        <input value={firstName} onChange={_handleChange} placeholder="first name" />
        {/* <input placeholder="last name" /> */}

      <button type="submit" >submit</button>
      </form>
    </div>
  )
};

// const FetchData = () => {

//   const { loading, error, data } = useQuery(GET_USERS);

//   if (loading) {
//     return <div>Loading....</div>
//   }
//   if (error) { 
//     console.log(error);
//    return <div>ERROR!</div>
//   }
//   if (data) {
//     return <Landing stuff={data}/>
//   }
// }

export default Landing;