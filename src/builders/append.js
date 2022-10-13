'use strict';
const { evolve, mergeRight, curry } = require('ramda');
const catcon = require('./catcon');

/**
 * Returns a function that creates the mandatory `UpdateExpression`, `AttributeNames` and `AttributeValues` needed to build
 * an `append` operation and merges everything with the given object containing `UpdateExpression`, `AttributeNames`
 * and `AttributeValues` keys.
 *
 * @memberof module:Builders
 * @see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.UpdateExpressions.html#Expressions.UpdateExpressions.SET.UpdatingListElements
 * @param {String} Attribute array that you want to extend
 * @param {Array} Value to add at the end of the array
 * @returns {Function} Expects an Object to merge the new `UpdateExpression`,
 *  `AttributeNames` and `AttributeValues` generated.
 */
function append(attribute, value) {
  return evolve({
    UpdateExpression: catcon(`#${attribute} = list_append(#${attribute}, :${attribute}), `),
    ExpressionAttributeNames: mergeRight({
      [`#${attribute}`]: attribute
    }),
    ExpressionAttributeValues: mergeRight({
      [`:${attribute}`]: value
    })
  });
}

module.exports = curry(append);
