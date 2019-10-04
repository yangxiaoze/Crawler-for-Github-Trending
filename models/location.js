const Sequelize = require('sequelize');
const moment = require('moment');
const datasource = require('../datasource');

const { Model } = Sequelize;

class Location extends Model {
  // TODO: Add computed methods here.
}

Location.init(
  {
    // attributes
    recordId: {
      type: Sequelize.INTEGER,
    },
    locationName: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.STRING,
    },
  },
  {
    sequelize: datasource,
    modelName: 'Location',
    // options
  },
);

module.exports = Location;
