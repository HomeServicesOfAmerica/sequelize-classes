var decorators = require( './lib/decorators' );

module.exports = {
  Model: require( './lib/model' ),
  validate: decorators.validate,
  index: decorators.index,
  hook: decorators.hook
};
