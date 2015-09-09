import Model from './../../src/model';
import Sequelize from 'sequelize';
import Extension from './extension';
import { extend, hasOne } from './../../src/decorators';

@hasOne( 'RelatedModel', __dirname +  '/relatedModel.js', {} )
@extend( Extension )
class Test extends Model {
  name = { type: Sequelize.STRING };
  type = { type: Sequelize.ENUM( 'test', 'production', 'development' ) };
}

export default Test.exportModel();
