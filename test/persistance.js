import Sequelize from 'sequelize';
import { expect } from 'chai';
import './../setenv';

let sequelize;

before( () => {
  sequelize = new Sequelize( process.env.DATABASE, process.env.USERNAME, process.env.PASSWORD, {
    port: process.env.PORT,
    dialect: 'postgres'
  } );
} );

describe( 'sequelize instance', () => {

  it( 'should be connected and authenticated', done => {
    sequelize.authenticate().then( done ).catch( err => { throw err; } );
  } );

} );

describe( 'importing models', () => {



} );