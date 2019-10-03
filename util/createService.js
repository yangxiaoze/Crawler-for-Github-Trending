const moment = require('moment');
const {
  random, name, internet, date,
} = require('faker');
const Service = require('../models/service');

module.exports = async (dataOverride) => {
  const fakeData = {
    recordId: random.number(),
    serviceName: name.firstName().toLowerCase(),
    kioskName: name.firstName().toLowerCase(),
    isKioskDefault: false,
    category: name.lastName().toLowerCase(),
    status: name.lastName().toLowerCase(),
  };

  return Service.create({
    ...fakeData,
    ...dataOverride,
  });
};
