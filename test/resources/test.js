import { Model } from './../../src/model';
import {STRING, ENUM} from 'sequelize';
import Extension from './extension';
import { extend, hasOne, option, bulkify, beforePersisted } from './../../src/decorators';

@hasOne( 'RelatedModel', {} )
@extend( Extension )
@option( 'schema', 'test' )
/* eslint-disable new-cap */
class Test extends Model {
  name = { type: STRING };
  type = { type: ENUM( 'test', 'production', 'development' ) };

  @beforePersisted()
  @bulkify()
  static bigTestHook(test) {
    test.name = test.name + ' done';
  }
}
/* eslint-enable new-cap */

export default Test;
