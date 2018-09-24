'use strict';
/**
 * @module Builders
 */

const { evolve, merge } = require('ramda');
const catcon = require('./utils');

/**
 * Returns a function that creates the mandatory `UpdateExpression`, `AttributeNames` and `AttributeValues` needed to build
 * a `put` operation and merges everything with the given object containing `UpdateExpression`, `AttributeNames`
 * and `AttributeValues` keys.
 *
 * @see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.UpdateExpressions.html#Expressions.UpdateExpressions.SET.ModifyingAttributes
 * @param {String} attribute name that you want to set
 * @param {Array} value of the attribute
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

module.exports = put;
