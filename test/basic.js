import should from 'should';
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
}


describe( 'Basic Functionality', () => {
  it( 'should allow an instance to be created', () => {
    instance = new Simple();
  } );

  it( 'should have two fields', () => {
    instance.generateOptions();
    instance._fields.should.have.property( 'name' );
  } );
} );
