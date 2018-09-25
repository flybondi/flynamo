'use strict';
/**
 * @module Builders
 */

const { evolve, merge, curry } = require('ramda');
const catcon = require('./utils');

/**
 * Returns a function that creates the mandatory `UpdateExpression`, `AttributeNames` and `AttributeValues` needed to build
 * a `put` operation and merges everything with the given object containing `UpdateExpression`, `AttributeNames`
 * and `AttributeValues` keys.
 *
 * @see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.UpdateExpressions.html#Expressions.UpdateExpressions.SET.ModifyingAttributes
 * @param {String} attribute name that you want to set
 * @param {Array} value of the attribute
 * @returns {Function} that expects an Object to merge the new `UpdateExpression`,
 *  `AttributeNames` and `AttributeValues` generated.
 */
function put(attribute, value) {
  return evolve({
    UpdateExpression: catcon(`#${attribute} = :${attribute}, `),
    ExpressionAttributeNames: merge({
      [`#${attribute}`]: attribute
    }),
    ExpressionAttributeValues: merge({
      [`:${attribute}`]: value
    })
  });
}

module.exports = curry(put);
