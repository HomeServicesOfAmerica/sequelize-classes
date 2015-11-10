/* eslint-disable no-unused-expressions */
import {expect} from './utils/chai';
import {describe, it, before} from 'mocha';
import { spy } from 'sinon';
import { Builder } from '../src/builder';
import TestModel from './resources/test';
import RelatedModel from './resources/relatedModel';
import * as helpers from '../src/helpers';
import '../setenv';

let sequelize;
let Test;
let modelSpy;
let test;

before(() => {
  const options = {
    database: process.env.DATABASE,
    username: process.env.USERNAME,
    pass: process.env.PASSWORD,
    config: {
      port: process.env.PORT,
      logging: false,
      dialect: 'postgres'
    }
  };
  const sequelizeClasses = new Builder(options, [TestModel, RelatedModel]);
  sequelize = sequelizeClasses.base;
  Test = sequelizeClasses.Test;
  modelSpy = spy(helpers, 'defineFunctions');
});

describe('sequelize instance', () => {
  it('should be connected and authenticated', () => {
    return expect(sequelize.authenticate()).to.be.fulfilled;
  });
});

describe('importing models from external files', () => {
  before(() => {
    modelSpy.reset();
    return expect(Test.sync({force: true})).to.be.fulfilled;
  });

  it('should have imported the model successfully', () => {
    expect(Test).to.have.property('find').that.is.a('function');
  });

  describe('Test Model', () => {
    it('should have been defined', () => {
      expect(sequelize.isDefined('Test')).to.be.true;
    });

    it('should have a build method', () => {
      expect(Test).to.have.property('build').that.is.a('function');
      test = Test.build();
    });

    it('should have all fields from model and extension', () => {
      expect(test).to.have.property('name').that.is.undefined;
      expect(test).to.have.property('value').that.is.undefined;
    });

    it('should be able to save an instance to the database', done => {
      test.name = 'Brad';
      test.color = 'green';
      test.save().then(() => done()).catch(done);
    });

    it('should be able to be found', () => {
      return expect(Test.findOne({where: {name: 'Brad done'}})).to.eventually.have.property('name').that.equals('Brad done');
    });

    it('should not allow a color other then green', () => {
      test.color = 'blue';
      return expect(test.save()).to.be.rejected;
    });

    it('should not allow a uppercase character in value', () => {
      test.value = 'Green';
      return expect(test.save()).to.be.rejected;
    });
  });
});
