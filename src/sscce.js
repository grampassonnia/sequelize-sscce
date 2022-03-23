'use strict';
// test only for postgres dialect
if (process.env.DIALECT !== "postgres") return;

// Require the necessary things from Sequelize
const { Sequelize, Op, Model, DataTypes } = require('sequelize');

// This function should be used instead of `new Sequelize()`.
// It applies the config for your SSCCE to work on CI.
const createSequelizeInstance = require('./utils/create-sequelize-instance');

// This is an utility logger that should be preferred over `console.log()`.
const log = require('./utils/log');

// You can use sinon and chai assertions directly in your SSCCE if you want.
const sinon = require('sinon');
const { expect } = require('chai');

// Your SSCCE goes inside this function.
module.exports = async function() {
  const sequelize = createSequelizeInstance({
    
    logQueryParameters: true,
    benchmark: true,
    logging: (...msg) => console.log(msg), // Displays all log function call parameters
    define: {
      timestamps: false // For less clutter in the SSCCE
    }
  });
  
  / NOTE: internally, sequelize. define calls Model.init 
  // so it's equivalent to the class extension approach
  const User = sequelize.define('User', {
    // Model attributes are defined here
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataType.STRING,
      // allowNull defualts to true
    }
  }, {
    // other model options go here, like providing the table name directly, etc.
  });

  // `sequelize define` also returns the model
  console.log(User === sequelize.models.User); // true
  
  // This checks what is the current state of the table in the database (which columns
  // it has, what are their data types, etc), and then performs the necessary changes in
  // the table to make it match the model
  User.sync({ alter: true });
  
  //DROP a table referred to a model. to run methods on all models (like sync() or drop()) type `sequelize.<methodname>();`
  //await User.drop();
  //console.log("User table dropped!");
  
  // This will run .sync() only if database name ends with '_test'
  // sequelize.sync({ force: true, match: /_test$/ });
  
  // can be destructive operations. Therefore, they are not recommended for
  // production-level software. Instead, synchronization should be done with
  // the advanced concept of Migrations, with the help of the Sequelize CLI.
  
  const spy = sinon.spy();
  sequelize.afterBulkSync(() => spy());
  await sequelize.sync();
  expect(spy).to.have.been.called;

  log(await Foo.create({ name: 'foo' }));
  expect(await Foo.count()).to.equal(1);
};
