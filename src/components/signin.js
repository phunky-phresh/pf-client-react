import React, { useContext, useState } from 'react';
import { TextInputField, Button } from 'evergreen-ui';
import { Formik } from 'formik';
import Firebase from '../Firebase';

import  Services  from '../services';

export default function SignInPanel () {

  const { isAuthenticating, signIn, signOut } = useContext( Services.Auth );
  const [ errors, setErrors ] = useState( null );

	const _handleSubmit = (e) => {
		e.preventDefault();
		signIn();
	};

	const _handle = (e) => {
		e.preventDefault();
		signOut();
	}

  return (
		<div>

			<form onSubmit={_handleSubmit}>
				
				<Button type="submit">Google</Button>
				
			</form> 

			<form onSubmit={_handle}>
				<button type="submit">signout</button>
			</form>
		</div>


  )
}