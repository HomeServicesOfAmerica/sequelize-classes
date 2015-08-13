/**
 * @file
 * @author Brad Decker <brad.decker@conciergeauctions.com>
 */

import { readOnly, enumerable } from './decorators';
import { defineFunctions, getProperties, entries } from './helpers';

import Sequelize from 'sequelize';
import _ from 'lodash';

let model;

/**
 * @class Model
 */
export default class Model {

  // Fields object for declaring model/table fields
  @enumerable( false ) _fields = {};

  // Object for storing instance methods
  @enumerable( false ) _instanceMethods = {};

  // Object for storing class methods
  @enumerable( false )_classMethods = {};

  // Object for declaring getters for fields
  @enumerable( false ) _getterMethods = {};

  // Object for declaring setters for fields
  @enumerable( false ) _setterMethods = {};

  @enumerable( false ) _validate = {};

  @enumerable( false ) _hooks = {};

  @enumerable( false ) _indexes = [];

  constructor () {
    // Just need to get rid of the added values on the constructor and inherit them to the instance.
    this._validate = this.constructor._validate || {};
    this._indexes = this.constructor._indexes || [];
    this._hooks = this.constructor._hooks || {};
    delete this.constructor._validate;
    delete this.constructor._hooks;
    delete this.constructor._indexes;
  }

  /**
   * Replace all occurrences of known string dataTypes with real dataTypes
   * @param dataTypes
   */
  @readOnly()
  declareTypes ( dataTypes = Sequelize ) {

    // TODO: Collect member variables and replace string data types with true data types.
    if ( this._fields.length === 0 ) {
      this.generateOptions();
    }

    for ( let [ field, definition ] of entries( this._fields ) ) {
      if ( typeof definition === 'object' ) {
        definition.type = dataTypes[ definition.type ];
      } else {
        definition = dataTypes[ definition ];
      }
      this._fields[ field ] = definition;
    }

  }

  @readOnly()
  declareHooks () {
    if ( !model.hasOwnProperty( 'addHook' ) ) {
      throw new Error( 'declareHooks called before model generated' );
    }

    for ( let [ name, hook ] of this._hooks ) {
      model.addHook( hook.action, name, hook.fn );
    }
  }

  /**
   * Run through all the extensions for this model and inherit from them.
   */
  @readOnly()
  runExtensions () {
    if ( !this.constructor._extensions ) {
      return;
    }

    let fields = [
      '_fields',
      '_validate',
      '_indexes',
      '_classMethods',
      '_instanceMethods',
      '_hooks',
      '_getterMethods',
      '_setterMethods'
    ];

    for ( let field of fields ) {
      this[ field ] = _.merge( ..._.map( this.constructor._extensions, field ), this[ field ] );
    }

  }

  /**
   * Split out the functions attached to this
   */
  @readOnly()
  generateOptions () {
    this._fields = getProperties( this );
    defineFunctions( this );
    this.runExtensions();
  }

  static registerModel () {
    // TODO: Return sequelize.define this model.
  }

  static exportModel () {
    return ( sequelize, dataTypes ) => {
      this.declareTypes( dataTypes );
    };
  }

}