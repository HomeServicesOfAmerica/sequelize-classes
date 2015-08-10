import { expect } from 'chai';
import Model from './../src/model.js';

let instance;

/**
 * This is a simple test class to test some of the most basic features of the module
 * @class Simple
 * @augments mongoose.Model
 * @inheritdoc mongoose.Model
 */
class Simple extends Model {
  name = 'STRING';
  type = 'STRING';

  static staticTest () {
    console.log( 'static' );
  }

  test () {
    console.log( this.name );
  }

  get cool () {
    return this.type;
  }

  set cool ( value ) {
    this.type = value;
  }
}


describe( 'Basic Functionality', () => {

  it( 'should allow an instance to be created', () => {
    instance = new Simple();
    expect( instance.constructor.name ).to.equal( 'Simple' );
  } );

  it( 'should have generate options properly', () => {
    expect( instance ).to.have.property( 'generateOptions' ).that.is.a( 'function' );
    instance.generateOptions();
  } );

  it( 'should collect field declarations into the _fields object', () => {
    expect( instance._fields ).to.have.property( 'name' ).that.is.a( 'string' );
    expect( instance._fields ).to.have.property( 'type' ).that.is.a( 'string' );
  } );

  it( 'should collect static functions into the _classMethods object', () => {
    expect( instance._classMethods ).to.have.property( 'staticTest' ).that.is.a( 'function' );
  } );

  it( 'should collect member methods into the _instanceMethods object', () => {
    expect( instance._instanceMethods ).to.have.property( 'test' ).that.is.a( 'function' );
  } );

  it( 'should collect getter methods into the _getterMethods object', () => {
    expect( instance._getterMethods ).to.have.property( 'cool' ).that.is.a( 'function' );
  } );

  it( 'should collect setter methods into the _setterMethods object', () => {
    expect( instance._setterMethods ).to.have.property( 'cool' ).that.is.a( 'function' );
  } );


} );
