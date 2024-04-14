'use strict';
const { evolve, mergeRight, curry } = require('ramda');
const catcon = require('./catcon');

/**
 * Returns a function that creates the mandatory `UpdateExpression`, `AttributeNames` and `AttributeValues` needed to build
 * a `REMOVE` operation and merges everything with the given object containing `UpdateExpression`, `AttributeNames`
 * and `AttributeValues` keys.
 *
 * @memberof module:Builders
 * @see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.UpdateExpressions.html#Expressions.UpdateExpressions.REMOVE
 * @param {String} attribute Attribute to be removed.
 * @returns {Function} Expects an `Object` to merge with the new `UpdateExpression`,
 *  `AttributeNames` and `AttributeValues` generated.
 */
function remove(attribute) {
  return evolve({
    UpdateExpression: catcon(`#${attribute}, `),
    ExpressionAttributeNames: mergeRight({
      [`#${attribute}`]: attribute
    }),
    ExpressionAttributeValues: mergeRight({})
  });
}

module.exports = curry(remove);
