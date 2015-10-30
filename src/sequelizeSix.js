import _ from 'lodash';
import Sequelize from 'sequelize';
export * from './decorators';
export * from './model';

export class SequelizeSix {
  sequelize = null;
  models = [];
  loadedModels = {};

  constructor ( options = { database: '', username: '', pass: '', config: {}}, models = [] ) {
    this.sequelize = new Sequelize( options.database, options.username, options.pass, options.config );
    this.models = models.map( Model => new Model() );
    this.registerModels();
    this.registerRelationships();
  }

  registerModels () {
    for ( let model of this.models ) {
      model.generateOptions();
      let loadedModel = model.registerModel( this.sequelize );
      this.loadedModels[ loadedModel.name ] = loadedModel;
      Object.defineProperty( this, loadedModel.name, {
        get: () => loadedModel
      } );
    }
  }

  registerRelationships () {
    for ( let model of this.models ) {
      this.registerRelationship( model, this.loadedModels[ model.constructor.name ] );
    }
  }

  registerRelationship ( sequelizeSixModel, model ) {
    if ( !sequelizeSixModel.constructor._relationships ) {
      return;
    }
    for ( let relation of sequelizeSixModel.constructor._relationships ) {
      model[ relation.type ]( this.loadedModels[ relation.model ], relation.options );
    }
  }

  get base () {
    return this.sequelize;
  }

  set base ( sequelize ) {
    this.sequelize = sequelize;
  }

  async syncDatabase ( force = false, options = {} ) {
    return await this.sequelize.sync( _.assign( options, { force } ) );
  }

  async query ( query, options = {} ) {
    return await this.sequelize.query( query, options );
  }
}