import Sequelize from 'sequelize';
import { expect } from 'chai';
import { spy } from 'sinon';
import { Builder } from '../src/builder';
import TestModel from './resources/test';
import RelatedModel from './resources/relatedModel';
import * as helpers from '../src/helpers';
import '../setenv';

let sequelize, Test, modelSpy, test;

before( () => {
  var options = {
    database: process.env.DATABASE,
    username: process.env.USERNAME,
    pass: process.env.PASSWORD,
    config: {
      port: process.env.PORT,
      logging: false,
      dialect: 'postgres'
    }
  }
  let sequelizeSix = new Builder( options, [ TestModel, RelatedModel ] );
  sequelize = sequelizeSix.base;
  Test = sequelizeSix.Test;
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
    Test.sync( { force: true } ).then( () => done() ).catch( done );
  } );

  it( 'should have imported the model successfully', () => {
    expect( Test ).to.have.property( 'find' ).that.is.a( 'function' );
  } );

  describe( 'Test Model', () => {

    it( 'should have been defined', () => {
      expect( sequelize.isDefined( 'Test' ) ).to.be.true;
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
