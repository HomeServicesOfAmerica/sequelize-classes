
const ignore = [
  'constructor',
  'Model',
  'length',
  'name',
  'arguments',
  'caller',
  'prototype'
];

export function* entries ( obj ) {
  for ( let key of Object.keys( obj ) ) {
    yield [ key, obj[ key ]];
  }
}

export function getProperties ( model ) {
  let propertyNames = Object.keys( model );
  let properties = {};

  for ( let name of propertyNames ) {
    properties[ name ] = model[ name ];
  }

  return properties;
}

export function defineFunctions ( model ) {

  for ( let [ target, name, method ] of findFunctions( model ) ) {
    model[ target ][ name ] = method;
  }

}

/** helpers **/

function addToDefinition ( field, method, type = 'get' ) {
  if ( typeof field !== 'object' ) {
    field = { type: field };
  }

  if ( method.get ) field.get = method.get;
  if ( method.set ) field.set = method.set;

  return field;
}

function* findFunctions ( model ) {

  let prototype = Object.getPrototypeOf( model );
  let constructor = model.constructor;

  let staticFunctions = getFunctions( constructor, true );
  let memberFunctions = getFunctions( prototype );

  for ( let method of staticFunctions.filter( filterFunction ) ) {
    for ( let result of parseFunction( method, model ) ) {
      yield result;
    }
  }

  for ( let method of memberFunctions.filter( filterFunction ) ) {
    for ( let result of parseFunction( method, model ) ) {
      yield result;
    }
  }
}

function* parseFunction ( method, model ) {

  if ( method.get || method.set ) {

    if ( !isField( method.name, model ) ) {

      if ( method.get ) yield [ '_getterMethods', method.name, method.get ];
      if ( method.set ) yield [ '_setterMethods', method.name, method.set ];

    }

    let field = fieldName( method.name );
    model._fields[ field ] = addToDefinition( model._fields[ field ], method );

  }

  let target = '_instanceMethods';

  if ( method.isStatic === true ) {
    target = '_classMethods';
  }

  yield [ target, method.name, method.value ];
}

function filterFunction ( method ) {

  if ( ignore.indexOf( method.name ) >= 0 ) {
    return false;
  }

  if ( method.writable && typeof method.value === 'function' ) {
    return true;
  }

  return ( ( method.get && typeof method.get === 'function' ) || ( method.set && typeof method.set === 'function' ) );

}

function getFunctions ( object, isStatic = false ) {
  let names = Object.getOwnPropertyNames( object );
  let funcs = [];

  for ( let name of names ) {
    let descriptor = Object.getOwnPropertyDescriptor( object, name );
    descriptor.name = name;
    descriptor.isStatic = isStatic;
    funcs.push( descriptor );
  }

  return funcs;
}

function fieldName ( name ) {
  return name.replace( /^_/, '' );
}

function isField ( name, object ) {
  return name.startsWith( '_' ) && object._fields[ fieldName( name ) ];
}