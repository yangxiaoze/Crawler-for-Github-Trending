const Sequelize = require('sequelize');
const moment = require('moment');
const datasource = require('../datasource');

const { Model } = Sequelize;

class Service extends Model {
  // TODO: Add computed methods here.
}

Service.init(
  {
    // attributes
    recordId: {
      type: Sequelize.INTEGER,
    },
    serviceName: {
      type: Sequelize.STRING,
    },
    kioskName: {
      type: Sequelize.STRING,
    },
    isKioskDefault: { 
      type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false 
    },
    category: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.STRING,
    },
  },
  {
    sequelize: datasource,
    modelName: 'Service',
    // options
  },
);

module.exports = Service;
