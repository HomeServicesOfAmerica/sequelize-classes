import {
  validate,
  index,
  beforeCreate,
  beforeUpdate,
  beforeBulkCreate,
  beforeBulkUpdate,
  multipleHooks,
  extend,
  bulkify,
  scope
} from './../../src/decorators';
import {Model} from './../../src/builder';
import SimpleExtension from './simpleExtension';

/**
 * This is a simple test class to test some of the most basic features of the module
 * @class Simple
 */
@extend(SimpleExtension)
export default class Simple extends Model {
  name = 'STRING';
  type = 'STRING';

  @scope() defaultScope = {type: 'test'};

  @scope() withoutTest = {type: {$nin: ['test']}};

  @index()
  uniqueName = {unique: true, fields: ['email']};

  static staticTest() {
    console.log('static');
  }

  test() {
    console.log(this.name);
  }

  get cool() {
    return this.type;
  }

  set cool(value) {
    this.type = value;
  }

  get _name() {
    return this.name;
  }

  set _name(value) {
    this.name = value;
  }

  @validate()
  nameCantBeType() {
    if (this.name === this.type) {
      throw new Error('Name cannot be the same as type');
    }
  }

  @multipleHooks(['beforeUpdate', 'beforeCreate'])
  static nameToLower(simple) {
    simple.name = simple.name.toLowerCase();
  }

  @beforeCreate()
  @beforeUpdate()
  @beforeBulkCreate()
  @beforeBulkUpdate()
  @bulkify()
  static typeToUpper(simple) {
    simple.type = simple.type.toUpperCase();
  }

  @bulkify()
  static bulkifiedMethod(item) {
    return item * 2;
  }
}
