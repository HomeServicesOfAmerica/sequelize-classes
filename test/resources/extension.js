import { Model } from './../../src/model';
import { hook, validate } from './../../src/decorators';
import {ENUM, STRING} from 'sequelize';

export default class Extension extends Model {
  @hook('beforeCreate')
  static setValueToColor(extension) {
    if (!extension.changed('color')) {
      return;
    }
    extension.value = extension.color;
  }

  /* eslint-disable new-cap */
  value = {type: STRING, validate: {isLowercase: true}};
  color = {type: ENUM('blue', 'red', 'green')};
  /* eslint-enable new-cap */

  @validate()
  colorShouldBeGreen() {
    if (this.color !== 'green') {
      throw new Error('Color should be green');
    }
  }

}

