'use strict';
/**
 * @module Builders
 */

const { evolve, merge } = require('ramda');
const catcon = require('./utils');

/**
 * Returns a function that creates the mandatory `UpdateExpression`, `AttributeNames` and `AttributeValues` needed to build
 * a `remove` operation and merges everything with the given object containing `UpdateExpression`, `AttributeNames`
 * and `AttributeValues` keys.
 *
 * @param {String} attribute that you want to remove
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

module.exports = remove;
