const Sequelize = require('sequelize');
const moment = require('moment');
const datasource = require('../datasource');

const { Model } = Sequelize;

class Customer extends Model {
  // TODO: Add computed methods here.
}

Customer.init(
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
    modelName: 'Customer',
    // options
  },
);

module.exports = Customer;
