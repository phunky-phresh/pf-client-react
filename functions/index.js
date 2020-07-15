const functions = require('firebase-functions');
const firebase = require('firebase')
const admin = require('firebase-admin');
const _ = require('lodash');
const fetch = require('node-fetch');

admin.initializeApp( functions.config().firebase );

console.log(functions);
console.log(functions.config());

const API_HOST = "https://hasuraql-pf.herokuapp.com/v1/graphql";
const HASURA_GRAPHQL_ADMIN_SECRET = functions.config().hasura.adminsecret;

const CREATE_USER = `
	mutation createUser( $objects: [users_insert_input!]!, on_conflict: { constraint: users_email_key, update_columns: uid }) {
		insert_users( objects: $objects ) {
			returning { id }
		}
	}
`;

exports.processSignUp = functions.auth.user().onCreate( async user => {
  console.log(HASURA_GRAPHQL_ADMIN_SECRET);
  
  const { uid, email } = user;

  const res = await doQuery( CREATE_USER, { objects: [{ uid, email }]});
  const id = _.get( res, "data.insert_users.returning[0].id");

  const customClaims = {
    "http://hasura.io/jwt/claims": {
      "x-hasura-default-role": "user",
			"x-hasura-allowed-roles": [ "user" ],
			"x-hasura-user-id": id,
    },
  };

  await admin.auth().setCustomUserClaims( user.id, customClaims )
    .then(() => {
      const metadataRef = admin.database().ref( "metadata/"+ uid );
      return metadataRef.set({ refreshTime: new Date().getTime() });
    }).catch( error => console.log(error));

    return `Created user: ${ id }`;
});

async function doQuery( query, variables ) {
  const response = await fetch( API_HOST, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-hasura-admin-secret": HASURA_GRAPHQL_ADMIN_SECRET,
    },
    body: JSON.stringify({ query, variables })
  });
  return response.json();
}

exports.updateUserRoles = functions.https.onRequest( async ( req, res ) => {
  try {
    const admin_secret = _.get( req, "headers.admin.secret" );
    if (admin_secret !== HASURA_GRAPHQL_ADMIN_SECRET ) {
      return res.status( 403 ).json({ error: "Unauthorized - Missing or incorrect admin token." });
    } else {
        const event = _.get( req, "body.event" );
        const id = _.get( event, "data.new.id" );
        const uid = _.get( event, "data.new.uid" );
        const role = _.get( event, "data.new.role" );

        const customClaims = {
          "https://hasura.io/jwt/claims": {
            "x-hasura-default-role": role,
            "x-hasura-allowed-roles": [ role ],
            "x-hasura-user-id": id,
        },
    };

    await admin.auth().setCustomUserClaims( id, customClaims );
    return res.status( 200 ).send( "success" );
  }
  } catch (error) {
    console.error( error );
    return res.status( 500 ).json({ error: "Server Error" });
    
  }
});
