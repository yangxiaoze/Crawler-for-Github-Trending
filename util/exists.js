const {
  isUndefined, isNil, isArrayLike, isObjectLike, isEmpty,
} = require('lodash');

module.exports = value => !isUndefined(value)
  && !isNil(value)
  && ((!isArrayLike(value) && !isObjectLike(value)) || !isEmpty(value));
