const moment = require('moment');
const {
  random, name, internet, date,
} = require('faker');
const User = require('../models/user');

module.exports = async (dataOverride) => {
  const fakeData = {
    recordId: random.number(),
    givenName: name.firstName().toLowerCase(),
    middleName: name.firstName().toLowerCase(),
    surName: name.lastName().toLowerCase(),
    email: internet.email(),
    birthDate: moment(date.past(50, '2000-01-01'), 'YYYY-MM-DD'),
    lastFourSSN: random.number({
      min: 1000,
      max: 9999,
    }),
    license: random.number({
      min: 10000,
      max: 99999,
    }),
  };

  return User.create({
    ...fakeData,
    ...dataOverride,
  });
};
