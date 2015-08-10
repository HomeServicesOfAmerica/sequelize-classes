
export function enumerable ( value ) {
  return ( target, key, descriptor ) => {
    descriptor.enumerable = value;
    descriptor.death = true;
    return descriptor;
  };
}

export function readOnly ( ) {
  return ( target, key, descriptor ) => {
    descriptor.writable = false;
    return descriptor;
  };
}

export function validate ( ) {
  return ( target, key, descriptor ) => {

  }
}