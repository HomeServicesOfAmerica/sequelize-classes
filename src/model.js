/**
 * @file Defines a class Model for extending other Sequelize Models from.
 * @author Brad Decker <brad.decker@conciergeauctions.com>
 */

import {readOnly, enumerable} from './decorators';
import {defineFunctions, getProperties} from './helpers';
import Sequelize from 'sequelize';
import lodash from 'lodash';

// Array of members in which to clean from the constructor.
const constructorCleanup = ['_validate', '_hooks', '_defaultScope', '_scopes'];
const relatedModels = {};

/**
 * @class Model
 */
export class Model {

  // Fields object for declaring model/table fields
  @enumerable(false) _fields = {};

  // Object for storing instance methods
  @enumerable(false) _instanceMethods = {};

  // Object for storing class methods
  @enumerable(false) _classMethods = {};

  // Object for declaring getters for fields
  @enumerable(false) _getterMethods = {};

  // Object for declaring setters for fields
  @enumerable(false) _setterMethods = {};

  // Object for declaring validators
  @enumerable(false) _validate = {};

  // Object for declaring model hooks
  @enumerable(false) _hooks = {};

  // Array of indexes to create on the schema
  @enumerable(false) _indexes = [];

  // Boolean to track status of the model.
  @enumerable(false) _generated = false;

  // Object for declaring scopes.
  @enumerable(false) _scopes = {};

  // Object to declare base scope.
  @enumerable(false) _defaultScope = {};

  // Object Model Options
  @enumerable(false) _options = {};

  /**
   * @constructor
   * builds the model and calls the cleanConstructor method.
   */
  constructor() {
    this.cleanConstructor();
  }

  /**
   * Clean up the constructor object by moving externally defined items back into the instance and removing
   * them from the original constructor object.
   */
  cleanConstructor() {
    constructorCleanup.forEach(item => {
      this[item] = this.constructor[item] || {};
      delete this.constructor[item];
    });
    const cleanup = this.constructor._cleanup || [];
    cleanup.forEach(item => {
      delete this.constructor[item];
    });
    delete this.constructor._cleanup;
    this._indexes = this.constructor._indexes || [];
    delete this.constructor._indexes;
  }

  /**
   * Replace all occurrences of known string dataTypes with real dataTypes
   * @param dataTypes
   */
  @readOnly()
  declareTypes(dataTypes = Sequelize) {
    // TODO: Collect member variables and replace string data types with true data types.
    if (this._fields.length === 0) {
      this.generateOptions();
    }

    Object.keys(this._fields).forEach(key => {
      let definition = this._fields[key];
      console.log(definition);
      if (typeof definition === 'object') {
        definition.type = dataTypes[definition.type];
      } else {
        definition = dataTypes[definition];
      }
      this._fields[key] = definition;
    });
  }

  /**
   * Loop through the hooks declared in _hooks and add them to the model schema through the addHook method.
   * @param {Object} model - instance of the model
   */
  @readOnly()
  declareHooks(model) {
    if (!model.addHook) {
      throw new Error('declareHooks called before model generated');
    }

    Object.keys(this._hooks).forEach(key => {
      const hook = this._hooks[key];
      model.addHook(hook.action, key, hook.fn);
    });
  }

  /**
   * Loop through all of the extensions added into this model and inherit all of the extension methods and fields.
   */
  @readOnly()
  runExtensions() {
    if (!this.constructor._extensions) {
      return;
    }

    const fields = [
      '_fields',
      '_validate',
      '_indexes',
      '_classMethods',
      '_instanceMethods',
      '_hooks',
      '_getterMethods',
      '_setterMethods',
      '_defaultScope',
      '_scopes'
    ];

    for (const field of fields) {
      this[field] = lodash.merge(...lodash.map(this.constructor._extensions, field), this[field]);
    }
  }

  /**
   * Sequelize-Six requires all of the configuration level fields to be defined prior to registering a model schema
   * this function generates all of these options, and assigns function definitions to the appropriate configuration
   * object. If it is called more than once it will not regenerate options, to aid in performance.
   */
  @readOnly()
  generateOptions() {
    if (!this._generated) {
      this._fields = getProperties(this);
      defineFunctions(this);
      this.runExtensions();
      this._generated = true;
    }
  }

  /**
   * This is a shortcut to call sequelize.define. It adds in all of the configuration options that are built with
   * the Sequelize-Six library. Returns the model returned from the define call.
   * @returns {Model}
   */
  registerModel(sequelize) {
    const model = sequelize.define(this.constructor.name, this._fields, {
      instanceMethods: this._instanceMethods,
      indexes: this._indexes,
      classMethods: this._classMethods,
      getterMethods: this._getterMethods,
      setterMethods: this._setterMethods,
      validate: this._validate,
      ...this._options
    });

    this.declareHooks(model);
    // this.declareRelations( model, sequelize );
    return model;
  }

  declareRelations(model, sequelize) {
    if (!this.constructor._relationships) {
      return;
    }

    for (const relation of this.constructor._relationships) {
      if (typeof relatedModels[relation.model] === 'undefined') {
        relatedModels[relation.model] = sequelize.import(relation.file);
      }
      model[relation.type](relatedModels[relation.model], relation.options);
    }
  }

  /**
   * Sequelize allows you to create a export function in which you define your models. This function allows you to
   * export Sequelize-Six Models without creating an instance or manually building these functions. Simply do
   * export default Model.exportModel();
   *
   * @returns {Function}
   */
  static exportModel() {
    return sequelize => {
      const model = new this();
      model.generateOptions();
      return model.registerModel(sequelize);
    };
  }

}
