const Sequelize = require('sequelize');
const moment = require('moment');
const datasource = require('../datasource');

const { Model } = Sequelize;

class Queue extends Model {
  // TODO: Add computed methods here.
}

Queue.init(
  {
    // attributes
    recordId: {
      type: Sequelize.INTEGER,
    },
    queueName: {
      type: Sequelize.STRING,
    },
    queueType: {
      type: Sequelize.STRING,
    },
    location: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.STRING,
    },
  },
  {
    sequelize: datasource,
    modelName: 'Queue',
    // options
  },
);

module.exports = Queue;
