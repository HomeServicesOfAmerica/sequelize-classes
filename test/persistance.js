import Sequelize from 'sequelize';
import { expect } from 'chai';
import { spy } from 'sinon';
import * as helpers from './../src/helpers';
import './../setenv';

let sequelize, Test, modelSpy, test;

before( () => {
  sequelize = new Sequelize( process.env.DATABASE, process.env.USERNAME, process.env.PASSWORD, {
    port: process.env.PORT,
    logging: false,
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

  before( done => {
    modelSpy.reset();
    Test = sequelize.import( './resources/test.js' );
    Test.sync( { force: true } ).then( () => done() ).catch( done );
  } );

  it( 'should have imported the model successfully', () => {
    expect( Test ).to.have.property( 'find' ).that.is.a( 'function' );
  } );

  describe( 'Test Model', () => {

    it( 'should have been defined', () => {
      expect( sequelize.isDefined( 'Test' ) ).to.be.true;
    } );

    it( 'should be able to be imported again without regenerating the model', () => {
      Test = sequelize.import( './resources/test.js' );
      expect( modelSpy.calledThrice ).to.be.true;
    } );

    it( 'should have a build method', () => {
      expect( Test ).to.have.property( 'build' ).that.is.a( 'function' );
      test = Test.build();
    } );

    it( 'should have all fields from model and extension', () => {
      expect( test ).to.have.property( 'name' ).that.is.undefined;
      expect( test ).to.have.property( 'value' ).that.is.undefined;
    } );

    it( 'should be able to save an instance to the database', done => {
      test.name = 'Brad';
      test.color = 'green';
      test.save().then( () => done() ).catch( done );
    } );

    it( 'should be able to be found', done => {
      Test.findOne( { where: { name: 'Brad' }} ).then( obj => {
        expect( obj ).to.have.property( 'name' ).that.equals( 'Brad' );
        expect( obj ).to.have.property( 'value' ).that.equals( 'green' );
        return done();
      } ).catch( done );
    } );

    it( 'should not allow a color other then green', done => {
      test.color = 'blue';
      test.save().then( () => done( new Error( 'Allowed save' ) ) ).catch( () => done() );
    } );

    it( 'should not allow a uppercase character in value', done => {
      test.value = 'Green';
      test.save().then( () => done( new Error( 'Allowed save' ) ) ).catch( () => done() );
    } );

  } );

} );
