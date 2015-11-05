# Sequelize Six
![travis-ci](https://travis-ci.org/ConciergeAuctions/sequelize-six.svg?branch=master) [![Stories in Ready](https://badge.waffle.io/ConciergeAuctions/sequelize-six.svg?label=ready&title=Ready)](http://waffle.io/ConciergeAuctions/sequelize-six)

## Overview

This package serves to assist in the creation of sequelize models via ES7 class syntax. 

## Requirements

* Babel.js with --stage 0 flag OR using the stage 0 plugin for babel 6.0+
* Sequelize.js

## Extending from the Model Class

Lets start with an example of what a model could look like with Sequelize classes.

```
import {Model, hasMany} from 'sequelize-classes';
import {STRING} from 'sequelize';

@hasMany('Post', {as: 'posts', foreignKey: 'authorId'})
export default class User extends Model {
    username = {type: STRING, allowNull: false, unique: true};
    email: {type: STRING, allowNull: false, unique: true};
    firstName: {type: STRING};
    lastName: {type: STRING};
    
    get name() {
        return `${this.firstName} ${this.lastName}`;
    }
}
```

Note that this class is just a class, not a sequelize model at this point. The purpose of the Model class is to set up 
your classes in such a way so that the Builder tool can create your sequelize model definitions properly. 

## Using Builder to create your sequelize connection and define models

```
 import {Builder} from 'sequelize-classes';
 import {User} from './models/user';
 
 // Normal sequelize options.
 const options = {
   database: process.env.DB_NAME,
   username: process.env.DB_USER,
   pass: process.env.DB_PASS,
   config: {
     host: process.env.DB_HOST,
     port: process.env.DB_PORT,
     logging: false,
     dialect: 'postgres'
   }
 };
 
 // Pass sequelize connection options and an array of Classes extended from Model.
 const database = new Builder(options, [User]);
 
 // You can now access your sequelize instance via database.base and access all your models by name - database.User
```