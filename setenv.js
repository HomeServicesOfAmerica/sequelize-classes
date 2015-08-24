import dotenv from 'dotenv';

let envPath = `.${process.env.NODE_ENV}`;

if ( envPath === 'production' ) {
  envPath = '';
}

dotenv.config( { path: `./config/.env${envPath}` } );
