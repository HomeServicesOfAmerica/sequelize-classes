// Array of method names to ignore/prevent from being added into our models
const ignore = [
  'constructor',
  'Model',
  'length',
  'name',
  'arguments',
  'caller',
  'prototype'
];


/**
 * Get the properties on the model, loops over Object.keys and thus skips over non-enumerable properties
 * @param {object} model - Model instance
 * @returns {Object}
 */
export function getProperties(model) {
  const properties = {};
  Object.keys(model).forEach(name => {
    properties[name] = model[name];
  });
  return properties;
}

/**
 * Responsible for looping through all functions on the model and assigning them to the appropriate configuration
 * object
 * @param {object} model - instance of our model
 */
export function defineFunctions(model) {
  for (const [target, name, method] of findFunctions(model)) {
    // noinspection JSUnusedAssignment
    model[target][name] = method;
  }
}

/** helpers **/

/**
 * Adds getter and/or setter methods to a field definition.
 * @param {String|Object} field - the field declaration
 * @param {Object} method - function descriptor
 * @returns {Object} - Field declaration
 */
function addToDefinition(field, method) {
  let fieldTarget = field;
  if (typeof field !== 'object') {
    fieldTarget = {type: field};
  }

  if (method.get) fieldTarget.get = method.get;
  if (method.set) fieldTarget.set = method.set;

  return fieldTarget;
}

/**
 * Gets a array of functions that belong to object.
 * @param {object} object
 * @param {Boolean} isStatic - when true, object is the constructor of the model
 * @returns {Array}
 */
function getFunctions(object, isStatic = false) {
  return Object.getOwnPropertyNames(object).map(name => ({
    ...Object.getOwnPropertyDescriptor(object, name),
    name,
    isStatic
  }));
}

/**
 * Iterator function that lets us loop through a model's functions
 * @param {object} model - Model instance
 */
function* findFunctions(model) {
  const staticFunctions = getFunctions(model.constructor, true);
  const memberFunctions = getFunctions(Object.getPrototypeOf(model));

  for (const method of staticFunctions.filter(filterFunction)) {
    for (const result of parseFunction(method, model)) {
      yield result;
    }
  }

  for (const method of memberFunctions.filter(filterFunction)) {
    for (const result of parseFunction(method, model)) {
      yield result;
    }
  }
}

/**
 * Helper function to get field name from a getter or setter name.
 * @param {String} name
 * @returns {String}
 */
function fieldName(name) {
  return name.replace(/^_/, '');
}

/**
 * Helper function to test if a string matches a field in object
 * @param {String} name
 * @param {object} object - object to test
 * @returns {boolean}
 */
function isField(name, object) {
  return name.startsWith('_') && object._fields[fieldName(name)];
}

/**
 * Determines which configuration object to add the function to based on it's descriptor's properties
 * @param {object} method - function descriptor
 * @param {object} model - model instance
 */
function* parseFunction(method, model) {
  if (method.get || method.set) {
    if (!isField(method.name, model)) {
      if (method.get) yield ['_getterMethods', method.name, method.get];
      if (method.set) yield ['_setterMethods', method.name, method.set];
    }
    const field = fieldName(method.name);
    model._fields[field] = addToDefinition(model._fields[field], method);
  }
  let target = '_instanceMethods';
  if (method.isStatic === true) {
    target = '_classMethods';
  }
  yield [target, method.name, method.value];
}

/**
 * filter function to filter out functions we aren't interested in.
 * @param {object} method - function descriptor
 * @returns {Boolean}
 */
function filterFunction(method) {
  if (ignore.indexOf(method.name) >= 0) {
    return false;
  }

  if (method.writable && typeof method.value === 'function') {
    return true;
  }

  return ((method.get && typeof method.get === 'function') || (method.set && typeof method.set === 'function'));
}
