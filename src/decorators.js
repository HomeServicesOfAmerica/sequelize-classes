/**
 * Decorator that changes the enumerable property on a property.
 * @param {Boolean} value - what value to set property
 * @returns {Function} - Function wrapper
 */
export function enumerable(value) {
  return (...params) => {
    const [ , , descriptor ] = params;
    descriptor.enumerable = value;
    descriptor.death = true;
    return descriptor;
  };
}

/**
 * Decorator to mark a function or property as readOnly (writable = false)
 * @returns {Function}
 */
export function readOnly() {
  return (...params) => {
    const [ , , descriptor ] = params;
    descriptor.writable = false;
    return descriptor;
  };
}

/**
 * Decorator to mark a function as a validator method, add the field to the _validate object
 * @returns {Function}
 */
export function validate() {
  return (target, key, descriptor) => {
    if (typeof descriptor.value !== 'function') {
      throw new Error('Attempted to use a function decorator on a non function');
    }
    target.constructor._validate = target.constructor._validate || {};
    target.constructor._validate[key] = descriptor.value;
    delete target[key];
    delete descriptor.value;
  };
}

/**
 * Decorator to mark a property as being a scope or defaultScope based on the name of the property.
 * @returns {Function}
 */
export function scope() {
  return (target, key, descriptor) => {
    if (typeof descriptor.initializer() !== 'object') {
      throw new Error('Scope must be an object');
    }

    target.constructor._scopes = target.constructor._scopes || {};

    if (key === 'defaultScope') {
      target.constructor._defaultScope = descriptor.initializer();
    } else {
      target.constructor._scopes[key] = descriptor.initializer();
    }

    delete target[key];
    delete descriptor.initializer;
  };
}

/**
 * Mark a function as being a hook and add it to the _hooks config object
 * @param {String} action - the action to hook into
 * @returns {Function}
 */
export function hook(action) {
  return (target, key, descriptor) => {
    if (typeof descriptor.value !== 'function') {
      throw new Error('Attempted to use a function decorator on a non function');
    }
    target._hooks = target._hooks || {};
    target._hooks[key] = {fn: descriptor.value, action};
    delete target[key];
    delete descriptor.value;
  };
}

/**
 * Shortcut to the Hook decorator that defines an addHook hook
 * @returns {Function}
 */
export function addHook() {
  return hook('addHook');
}

/**
 * Shortcut to the Hook decorator that defines an removeHook hook
 * @returns {Function}
 */
export function removeHook() {
  return hook('removeHook');
}

/**
 * Shortcut to the Hook decorator that defines an hasHook hook
 * @returns {Function}
 */
export function hasHook() {
  return hook('hasHook');
}

/**
 * Shortcut to the Hook decorator that defines an beforeValidate hook
 * @returns {Function}
 */
export function beforeValidate() {
  return hook('beforeValidate');
}

/**
 * Shortcut to the Hook decorator that defines an afterValidate hook
 * @returns {Function}
 */
export function afterValidate() {
  return hook('afterValidate');
}

/**
 * Shortcut to the Hook decorator that defines a beforeCreate hook
 * @returns {Function}
 */
export function beforeCreate() {
  return hook('beforeCreate');
}

/**
 * Shortcut to the Hook decorator that defines an afterCreate hook
 * @returns {Function}
 */
export function afterCreate() {
  return hook('afterCreate');
}

/**
 * Shortcut to the Hook decorator that defines an beforeDestroy hook
 * @returns {Function}
 */
export function beforeDestroy() {
  return hook('beforeDestroy');
}

/**
 * Shortcut to the Hook decorator that defines an afterDestroy hook
 * @returns {Function}
 */
export function afterDestroy() {
  return hook('afterDestroy');
}

/**
 * Shortcut to the Hook decorator that defines a beforeUpdate hook
 * @returns {Function}
 */
export function beforeUpdate() {
  return hook('beforeUpdate');
}

/**
 * Shortcut to the Hook decorator that defines a afterUpdate hook
 * @returns {Function}
 */
export function afterUpdate() {
  return hook('afterUpdate');
}

/**
 * Shortcut to the Hook decorator that defines a beforeBulkCreate hook
 * @returns {Function}
 */
export function beforeBulkCreate() {
  return hook('beforeBulkCreate');
}

/**
 * Shortcut to the Hook decorator that defines a afterBulkCreate hook
 * @returns {Function}
 */
export function afterBulkCreate() {
  return hook('afterBulkCreate');
}

/**
 * Shortcut to the Hook decorator that defines a beforeBulkDestroy hook
 * @returns {Function}
 */
export function beforeBulkDestroy() {
  return hook('beforeBulkDestroy');
}

/**
 * Shortcut to the Hook decorator that defines a afterBulkDestroy hook
 * @returns {Function}
 */
export function afterBulkDestroy() {
  return hook('afterBulkDestroy');
}

/**
 * Shortcut to the Hook decorator that defines a beforeBulkUpdate hook
 * @returns {Function}
 */
export function beforeBulkUpdate() {
  return hook('beforeBulkUpdate');
}

/**
 * Shortcut to the Hook decorator that defines a afterBulkUpdate hook
 * @returns {Function}
 */
export function afterBulkUpdate() {
  return hook('afterBulkUpdate');
}

/**
 * Shortcut to the Hook decorator that defines a beforeFind hook
 * @returns {Function}
 */
export function beforeFind() {
  return hook('beforeFind');
}

/**
 * Shortcut to the Hook decorator that defines a beforeFindAfterExpandIncludeAll hook
 * @returns {Function}
 */
export function beforeFindAfterExpandIncludeAll() {
  return hook('beforeFindAfterExpandIncludeAll');
}

/**
 * Shortcut to the Hook decorator that defines a beforeFindAfterOptions hook
 * @returns {Function}
 */
export function beforeFindAfterOptions() {
  return hook('beforeFindAfterOptions');
}

/**
 * Shortcut to the Hook decorator that defines a afterFind hook
 * @returns {Function}
 */
export function afterFind() {
  return hook('afterFind');
}

/**
 * Shortcut to the Hook decorator that defines a beforeDefine hook
 * @returns {Function}
 */
export function beforeDefine() {
  return hook('beforeDefine');
}

/**
 * Shortcut to the Hook decorator that defines a afterDefine hook
 * @returns {Function}
 */
export function afterDefine() {
  return hook('afterDefine');
}

/**
 * Shortcut to the Hook decorator that defines a beforeInit hook
 * @returns {Function}
 */
export function beforeInit() {
  return hook('beforeInit');
}
/**
 * Shortcut to the Hook decorator that defines a afterInit hook
 * @returns {Function}
 */
export function afterInit() {
  return hook('afterInit');
}

export function relationship(type, model, options = {}) {
  return target => {
    if (['belongsTo', 'hasOne', 'hasMany', 'belongsToMany'].indexOf(type) === -1) {
      throw new Error('That relation is not supported');
    }
    target._relationships = target._relationships || [];
    target._relationships.push({type, model, options});
  };
}

export function belongsTo(model, options = {}) {
  return relationship('belongsTo', model, options);
}

export function hasOne(model, options = {}) {
  return relationship('hasOne', model, options);
}

export function hasMany(model, options = {}) {
  return relationship('hasMany', model, options);
}

export function belongsToMany(model, options = {}) {
  return relationship('belongsToMany', model, options);
}

/**
 * Add an extension onto the model, which will inherit all of the extensions' methods and fields
 * @param {Model} Extension - The Class extended from Model that will be integrated into this Model
 * @returns {Function}
 */
export function extend(Extension) {
  return target => {
    target._extensions = target._extensions || [];
    const extension = new Extension();
    extension.generateOptions();
    target._extensions.push(extension);
  };
}

/**
 * Decorator to mark a function or property as readOnly (writable = false)
 * @returns {Function}
 */
export function option(opt, value) {
  return target => {
    target._options = target._options || {};
    target._options[opt] = value;
  };
}

export function schema(value) {
  return option('schema', value);
}

export function paranoid(value = true) {
  return option('paranoid', value);
}

/**
 * Marks a property as being an index and addes it to the _indexes array.
 * @param {object} options - configuration object
 * @returns {Function}
 */
export function index(options = {noName: false}) {
  return (target, key, descriptor) => {
    target.constructor._indexes = target.constructor._indexes || [];

    const item = descriptor.initializer();

    // Use the name of the property for the index, unless the noName option is passed.
    if (!options.noName) {
      item.name = key;
    }

    target.constructor._indexes.push(item);

    delete target[key];
    delete descriptor.initializer;
  };
}
