const Sequelize = require('sequelize');
const moment = require('moment');
const datasource = require('../datasource');

const { Model } = Sequelize;

class User extends Model {
  // TODO: Add computed methods here.
}

User.init(
  {
    // attributes
    recordId: {
      type: Sequelize.INTEGER,
    },
    userName: {
      type: Sequelize.STRING,
    },
    fullName: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.STRING,
    },
  },
  {
    sequelize: datasource,
    modelName: 'User',
    // options
  },
);

module.exports = User;
