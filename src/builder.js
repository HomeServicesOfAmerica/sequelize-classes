import lodash from 'lodash';
import Sequelize from 'sequelize';
export * from './decorators';
export * from './model';

const defaultOptions = {database: '', databaseUrl: '', username: '', pass: '', config: {}};

export class Builder {
  sequelize = null;
  models = [];
  loadedModels = {};

  constructor(options = defaultOptions, models = []) {
    let sequelizeArguments = [];
    if (options.databaseUrl) sequelizeArguments.push(options.databaseUrl);
    if (!options.databaseUrl && options.database) {
      sequelizeArguments = [options.database, options.username, options.pass];
    }
    sequelizeArguments.push(options.config);
    this.sequelize = new Sequelize(...sequelizeArguments);
    this.models = models.map(Model => new Model());

    this.models.forEach(model => {
      model.generateOptions();
      const loadedModel = model.registerModel(this.sequelize);
      this.loadedModels[loadedModel.name] = loadedModel;
      Object.defineProperty(this, loadedModel.name, {
        get: () => loadedModel
      });
    });

    this.models.forEach(model => {
      this.registerRelationship(model, this.loadedModels[model.constructor.name]);
      this.registerScopes(model, this.loadedModels[model.constructor.name]);
    });
  }

  registerRelationship(sequelizeClass, model) {
    if (!sequelizeClass.constructor._relationships) {
      return;
    }
    sequelizeClass.constructor._relationships.forEach(relation => {
      model[relation.type](this.loadedModels[relation.model], relation.options);
    });
  }

  replaceIncludeModels(scope) {
    return scope.include.map(include => {
      if (typeof include.model === 'string') {
        include.model = this.loadedModels[include.model];
      }
      return include;
    });
  }

  registerScopes(sequelizeClass, model) {
    if (sequelizeClass._defaultScope) {
      if (sequelizeClass._defaultScope.include) {
        sequelizeClass._defaultScope.include = this.replaceIncludeModels(sequelizeClass._defaultScope);
      }
      model.addScope('defaultScope', sequelizeClass._defaultScope, {override: true});
    }

    if (sequelizeClass._scopes) {
      Object.keys(sequelizeClass._scopes).forEach(scopeName => {
        let scope = sequelizeClass._scopes[scopeName];
        if (scope.include) {
          scope = this.replaceIncludeModels(scope);
        }
        model.addScope(scopeName, scope);
      });
    }
  }

  get base() {
    return this.sequelize;
  }

  set base(sequelize) {
    this.sequelize = sequelize;
  }

  async syncDatabase(force = false, options = {}) {
    return await this.sequelize.sync(lodash.assign(options, {force}));
  }

  async query(query, options = {}) {
    return await this.sequelize.query(query, options);
  }
}
