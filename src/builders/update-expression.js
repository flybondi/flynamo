'use strict';
const { ifElse, endsWith, compose, evolve, dropLast, curry } = require('ramda');
const catcon = require('./catcon');

/**
 * Returns a function that, when invoked with a set of default values for a dynamo expression,
 * it creates the mandatory UpdateExpression, AttributeNames and AttributeValues needed to build
 * the `action` operations created by the given `operation` function.
 *
 * @memberof module:Builders
 * @see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.UpdateExpressions.html
 * @param {String} Action to execute in DynamoDB, it can be `SET`, `ADD`, `DELETE` or `REMOVE`.
 * @param {Function} Operations that returns an object with the operations to execute and their parameters.
 * @returns {Function} Expects an Object to merge the new `UpdateExpression`,
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
