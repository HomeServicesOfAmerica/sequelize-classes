import Sequelize from 'sequelize';
import { expect } from 'chai';
import { spy } from 'sinon';
import * as helpers from './../src/helpers';
import './../setenv';

let sequelize, Test, modelSpy;

before( () => {
  sequelize = new Sequelize( process.env.DATABASE, process.env.USERNAME, process.env.PASSWORD, {
    port: process.env.PORT,
    dialect: 'postgres'
  } );
  modelSpy = spy( helpers, 'defineFunctions' );
} );

describe( 'sequelize instance', () => {

  it( 'should be connected and authenticated', done => {
    sequelize.authenticate().then( done ).catch( err => { throw err; } );
  } );

} );

describe( 'importing models from external files', () => {

  before( () => {
    modelSpy.reset();
    Test = sequelize.import( './resources/test.js' );
  } );

  it( 'should have imported the model successfully', () => {
    expect( Test ).to.have.property( 'find' ).that.is.a( 'function' );
  } );

  describe( 'Test Model', () => {

    it( 'should have been defined', () => {
      expect( sequelize.isDefined( 'Test' ) ).to.equal( true );
    } );

    it( 'should be able to be imported again without regenerating the model', () => {
      Test = sequelize.import( './resources/test.js' );
      expect( modelSpy.calledOnce ).to.equal( true );
    } );

  } );

} );