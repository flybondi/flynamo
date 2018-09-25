'use strict';
/**
 * A DynamoDB expression builder that simplifies generating update items requests
 * by composing small functions. Functions from this module can be imported from the
 * `@flybondi/flynamo/builders` namespace.
 *
 * Let your AWS DynamoDB client take off ✈!
 *
 * @example
 *  updateExpression('SET',
 *    compose(
 *      put('availableSeats', 42),
 *      put('pnr', '2LWJRW'),
 *    )
 * );
 *
 * @see https://flybondi.github.io/flynamo/
 * @module Builders
 */

const updateExpression = require('./src/builders/update-expression');
const put = require('./src/builders/update-expression');
const append = require('./src/builders/update-expression');
const remove = require('./src/builders/update-expression');

module.exports = {
  updateExpression,
  put,
  append,
  remove
};
