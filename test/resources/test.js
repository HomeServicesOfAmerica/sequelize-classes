import Model from './../../src/model';
import Sequelize from 'sequelize';

class Test extends Model {
  name = { type: Sequelize.STRING };
  type = { type: Sequelize.ENUM( 'test', 'production', 'development' ) };
};

export default Test.exportModel();
