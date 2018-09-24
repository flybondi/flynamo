'use strict';
/**
 * @module Builders
 */

const { ifElse, endsWith, compose, evolve, dropLast, curry } = require('ramda');
const catcon = require('./utils');

/**
 * Returns a function that, when invoked with a set of default values for a dynamo expression,
 * it creates the mandatory UpdateExpression, AttributeNames and AttributeValues needed to build
 * the `action` operations created by the given `operation` function.
 *
 * @see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.UpdateExpressions.html
 * @param {String} action to execute in dynamodb, it can be SET, ADD, DELETE or REMOVE
 * @param {Function} operations that returns an object with the operations to execute and their parameters
 * @returns {Function} that expects an Object to merge the new `UpdateExpression`,
 *  `AttributeNames` and `AttributeValues` generated.
 */
function updateExpression(action, operations) {
  return compose(
    evolve({
      UpdateExpression: ifElse(endsWith(` ${action} `), dropLast(` ${action} `.length), dropLast(2))
    }),
    operations,
    evolve({
      UpdateExpression: catcon(` ${action} `)
    })
  );
}

module.exports = curry(updateExpression);
