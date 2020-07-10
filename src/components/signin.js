import React, { useContext, useState } from 'react';
import { TextInputField, Button } from 'evergreen-ui';
import { Formik } from 'formik';
// import Firebase from '../firebaseAuth';
import Firebase from '../Firebase';
// import { SignIn, SignOut } from '../Firebase';

import  Services  from '../services';

export default function SignInPanel () {

  const { isAuthenticating, signIn } = useContext( Services.Auth );
  const [ errors, setErrors ] = useState( null );



  return (
  	<Formik
			initialValues={{}}
			onSubmit={  () => {
        console.log('submit');
        
				// setErrors( null );
				// try {
					 signIn();
					
        // } 
        // catch ( error ) {
				// 	console.error( error );
				// 	setErrors( error.message );
				// }
			}}
		>{
				({ values, handleChange, handleSubmit, isSubmitting }) => {
					return (
						<form onSubmit={handleSubmit}>
							{/* <TextInputField
								label="Email"
								type="email"
								name="email"
								onChange={ handleChange }
								autoFocus
							/>
							<TextInputField
								label="Password"
								type="password"
								name="password"
								onChange={ handleChange }
							/> */}
							{/* <Button  disabled={ !values.email || !values.password } onClick={ handleSubmit }>Log In</Button> */}
              <Button type="submit">Google</Button>
							{ errors && <p>{ errors }</p>}
						</form> );
				}}
		</Formik>

  )
}