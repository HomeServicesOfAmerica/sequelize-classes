import { Model } from './../../src/model';
import { hook, validate } from './../../src/decorators';
import Sequelize from 'sequelize';

export default class Extension extends Model {
  value = { type: Sequelize.STRING, validate:{ isLowercase: true }};
  color = { type: Sequelize.ENUM( 'blue', 'red', 'green' ) };

  @hook( 'beforeCreate' )
  static setValueToColor ( extension ) {
    if ( !extension.changed( 'color' ) ) {
      return;
    }

    extension.value = extension.color;
  }

  @validate()
  colorShouldBeGreen () {
    if ( this.color !== 'green' ) {
      throw new Error( 'Color should be green' );
    }
  }

}

