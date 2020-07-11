import React, { useContext, useState } from 'react';
import { TextInputField, Button } from 'evergreen-ui';
import { Formik } from 'formik';
import Firebase from '../Firebase';

import  Services  from '../services';

export default function SignInPanel () {

  const { isAuthenticating, signIn, signOut } = useContext( Services.Auth );
  const [ errors, setErrors ] = useState( null );

	const _handle = (e) => {
		e.preventDefault();
		signOut();
	}

  return (
		<div>
			<Formik
				initialValues={{}}
				onSubmit={  () => {
					console.log('submit');
						signIn();      
				}}
			>{
					({ values, handleChange, handleSubmit, isSubmitting }) => {
						return (
							<form onSubmit={handleSubmit}>
								
								<Button type="submit">Google</Button>
								{ errors && <p>{ errors }</p>}
							</form> );
					}}
			</Formik>
			<form onSubmit={_handle}>
				<button type="submit">signout</button>
			</form>
		</div>


  )
}