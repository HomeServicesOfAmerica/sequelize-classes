import Sequelize from 'sequelize';
import { expect } from 'chai';
import { spy } from 'sinon';
import * as helpers from './../src/helpers';
import './../setenv';

let sequelize, Test, modelSpy;

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
      expect( modelSpy.calledOnce ).to.be.true;
    } );

    it( 'should have a build method', done => {
      let test = Test.build();
      expect( test ).to.have.property( 'name' ).that.is.undefined;
      test.name = 'Brad';
      test.save().then( () => done() ).catch( done );
    } );

    it( 'should be able to be found', done => {
      Test.findOne( { where: { name: 'Brad' }} ).then( obj => {
        expect( obj ).to.have.property( 'name' ).that.equals( 'Brad' );
        return done();
      } );
    } );

  } );

} );
