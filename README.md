# Sequelize Six
![travis-ci](https://travis-ci.org/ConciergeAuctions/sequelize-six.svg?branch=master) [![Stories in Ready](https://badge.waffle.io/ConciergeAuctions/sequelize-six.svg?label=ready&title=Ready)](http://waffle.io/ConciergeAuctions/sequelize-six)

#### Overview

Sequelize.js is a fantastic ORM for SQL databases. The one pitfall is that it is not very ES6 friendly in the way you have to declare classes. This library offers some utilities to help make it easy to write your schemas in ES6 syntax with the help of ES7 decorators.

#### Requirements

* Babel.js with --stage 0 flag
* Sequelize.js

#### Class Decoration Syntax

    import { Model } from 'sequelize-six';
    import Sequelize from 'sequelize';
    
    class User extends Model {
      username = { type: Sequelize.STRING };
      firstName = { type: Sequelize.STRING };
      lastName = { type: Sequelize.STRING };
    }
    
    export User.exportModel();
    

#### Instance methods and Class methods

All class instance methods are automatically added to the instance methods of the schema. Methods marked as static will be added to class methods of the schema. 


#### Getters and Setters

Using the get and set syntax is all you need to add getters and setters to your class. If you want to have a getter or setter interact with a specific field, you can prefix the method name with an underscore. Here's an example:

    class Menu extends Model {
      name = { type: Sequelize.STRING };
        
      get _name () {
        return this.getDataValue('name');
      }
        
      set _name ( value ) {
        this.setDataValue('name', value);
      }
    }
    
#### Validations

WIP

#### Hooks

WIP

#### Extending Models

Its common to want to be able to create functionality that is common between multiple models, but that isn't necessarily stored in a single database. A prime example of this would be a location model that stores addresses and latitude and longitudes. Both users and businesses models might need location data. Instead of recreating logic in both models, you can use model extension.

    @extend( Location )
    class User {
      ...
    }
    
All the fields, methods, hooks, validations, etc of the location model are carried down into the User model. User model is the primary model so if you want to overwrite a method for specific class you can redeclare the method in User and it will take precedence over that of Location.

#### Helper Decorators

There is an @enumerable and @readOnly decorator in this library that are only used to prevent the model generator from adding those fields/functions into the final schema. The main purpose of these helpers is to prevent functions of the Model base class from being added to the Schema's that are derived from it. There may be applications for external use so they are included in the library. 


#### Development
We actively encourage developers to participate in helping us make this library better. Please fork this repository and after cloning run npm install. We use eslint to lint our project so if you run gulp lint you'll get the feedback from this. npm test will run our test library.

Make sure you're writing tests to cover your new code additions and then submit a pull request. 

Thanks!
