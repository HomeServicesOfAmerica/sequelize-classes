/**
 * Decorator that changes the enumerable property on a property.
 * @param {Boolean} value - what value to set property
 * @returns {Function} - Function wrapper
 */
export function enumerable ( value ) {
  return ( ...params ) => {
    let [ , , descriptor ] = params;
    descriptor.enumerable = value;
    descriptor.death = true;
    return descriptor;
  };
}

/**
 * Decorator to mark a function or property as readOnly (writable = false)
 * @returns {Function}
 */
export function readOnly ( ) {
  return ( ...params ) => {
    let [ , , descriptor ] = params;
    descriptor.writable = false;
    return descriptor;
  };
}

/**
 * Decorator to mark a function as a validator method, add the field to the _validate object
 * @returns {Function}
 */
export function validate () {
  return ( target, key, descriptor ) => {
    if ( typeof descriptor.value !== 'function' ) {
      throw new Error( 'Attempted to use a function decorator on a non function' );
    }
    target.constructor._validate = target.constructor._validate || {};
    target.constructor._validate[ key ] = descriptor.value;
    delete target[ key ];
    delete descriptor.value;
  };
}

/**
 * Decorator to mark a property as being a scope or defaultScope based on the name of the property.
 * @returns {Function}
 */
export function scope ( ) {
  return ( target, key, descriptor ) => {
    if ( typeof descriptor.initializer() !== 'object' ) {
      throw new Error( 'Scope must be an object' );
    }

    target.constructor._scopes = target.constructor._scopes || {};

    if ( key === 'defaultScope' ) {
      target.constructor._defaultScope = descriptor.initializer();
    } else {
      target.constructor._scopes[ key ] = descriptor.initializer();
    }

    delete target[ key ];
    delete descriptor.initializer;
  };
}

/**
 * Mark a function as being a hook and add it to the _hooks config object
 * @param {String} action - the action to hook into
 * @returns {Function}
 */
export function hook ( action ) {
  return ( target, key, descriptor ) => {
    if ( typeof descriptor.value !== 'function' ) {
      throw new Error( 'Attempted to use a function decorator on a non function' );
    }
    target._hooks = target._hooks || {};
    target._hooks[ key ] = { fn: descriptor.value, action };
    delete target[ key ];
    delete descriptor.value;
  };
}

/**
 * Shortcut to the Hook decorator that defines a beforeCreate hook
 * @returns {Function}
 */
export function beforeCreate () {
  return hook( 'beforeCreate' );
}

/**
 * Shortcut to the Hook decorator that defines a beforeUpdate hook
 * @returns {Function}
 */
export function beforeUpdate () {
  return hook( 'beforeUpdate' );
}

/**
 * Add an extension onto the model, which will inherit all of the extensions' methods and fields
 * @param {Model} Extension - The Class extended from Model that will be integrated into this Model
 * @returns {Function}
 */
export function extend ( Extension ) {
  return target => {
    target._extensions = target._extensions || [];
    let extension = new Extension();
    extension.generateOptions();
    target._extensions.push( extension );
  };
}

/**
 * Marks a property as being an index and addes it to the _indexes array.
 * @param {object} options - configuration object
 * @returns {Function}
 */
export function index ( options = { noName: false } ) {
  return ( target, key, descriptor ) => {
    target.constructor._indexes = target.constructor._indexes || [];

    let item = descriptor.initializer();

    // Use the name of the property for the index, unless the noName option is passed.
    if ( !options.noName ) {
      item.name = key;
    }

    target.constructor._indexes.push( item );

    delete target[ key ];
    delete descriptor.initializer;
  };
}