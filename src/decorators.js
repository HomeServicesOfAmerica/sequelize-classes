
export function enumerable ( value ) {
  return ( ...params ) => {
    let [ , , descriptor ] = params;
    descriptor.enumerable = value;
    descriptor.death = true;
    return descriptor;
  };
}

export function readOnly ( ) {
  return ( ...params ) => {
    let [ , , descriptor ] = params;
    descriptor.writable = false;
    return descriptor;
  };
}

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

export function beforeCreate () {
  return hook( 'beforeCreate' );
}

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