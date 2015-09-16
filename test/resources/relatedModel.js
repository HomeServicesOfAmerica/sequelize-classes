import { Model } from './../../src/model';
import Sequelize from 'sequelize';

class RelatedModel extends Model {
  newField = { type: Sequelize.STRING };
}

export default RelatedModel;
