/**
 * @file
 * @author Brad Decker <brad.decker@conciergeauctions.com>
 */

import { readOnly, enumerable } from './decorators';
import { getMemberFunctions, getStaticFunctions, getProperties, entries, getFunctionsOfType } from './helpers';

import Sequelize from 'sequelize';
import _ from 'lodash';

/**
 * @class Model
 */
export default class Model {

  // Fields object for declaring model/table fields
  @enumerable( false )
  _fields = {};

  // Object for storing instance methods
  @enumerable( false )
  _instanceMethods = {};

  // Object for storing class methods
  @enumerable( false )
  _classMethods = {};

  // Object for declaring getters for fields
  @enumerable( false )
  _getterMethods = {};

  // Object for declaring setters for fields
  @enumerable( false )
  _setterMethods = {};

  // Object for creating validation functions
  @enumerable( false )
  _validate = {};

  // Object for creating hooks
  @enumerable( false )
  _hooks = {};

  // Array for creating table indexes
  @enumerable( false )
  _indexes = [];

  /**
   * Replace all occurrences of known string dataTypes with real dataTypes
   * @param dataTypes
   */
  @readOnly()
  declareTypes ( dataTypes = null ) {
    if ( !dataTypes ) {
      dataTypes = Sequelize;
    }
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
  generateOptions () {
    this._fields = getProperties( this );
    this._instanceMethods = getMemberFunctions( this );
    this._classMethods = getStaticFunctions( this );
    this._getterMethods = getFunctionsOfType( this, 'get' );
    this._setterMethods = getFunctionsOfType( this, 'set' );
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