import React from 'react';
import SignIn from '../components/signin';
const Landing = () => {
  return(
    <div>
      <h1>Landing</h1>
      {/* <a href="http://localhost:3001/auth/google">Google</a> */}
      <SignIn />
    </div>
  )
};

export default Landing;