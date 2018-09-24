'use strict';
/**
 * A DynamoDB expression builder that simplifies update items requests.
 * Let your AWS DynamoDB client take off ✈!
 *
 * @see https://flybondi.github.io/flynamo/
 */

const updateExpression = require('./update-expression');
const put = require('./update-expression');
const append = require('./update-expression');
const remove = require('./update-expression');

module.exports = {
  updateExpression,
  put,
  append,
  remove
};
