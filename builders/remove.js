'use strict';
/**
 * @module Builders
 */

const { evolve, merge, curry } = require('ramda');
const catcon = require('./utils');

/**
 * Returns a function that creates the mandatory `UpdateExpression`, `AttributeNames` and `AttributeValues` needed to build
 * a `remove` operation and merges everything with the given object containing `UpdateExpression`, `AttributeNames`
 * and `AttributeValues` keys.
 *
 * @see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.UpdateExpressions.html#Expressions.UpdateExpressions.REMOVE
 * @param {String} attribute that you want to remove
 * @returns {Function} that expects an Object to merge the new `UpdateExpression`,
 *  `AttributeNames` and `AttributeValues` generated.
 */
function remove(attribute) {
  return evolve({
    UpdateExpression: catcon(`#${attribute}, `),
    ExpressionAttributeNames: merge({
      [`#${attribute}`]: attribute
    }),
    ExpressionAttributeValues: merge({})
  });
}

module.exports = curry(remove);
