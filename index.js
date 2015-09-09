var decorators = require( './lib/decorators' );
var _ = require( 'lodash' );

module.exports = _.merge( { Model: require( './lib/model' ) }, decorators );
