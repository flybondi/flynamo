'use strict';
/**
 * @module Builders
 */

const { evolve, merge } = require('ramda');
const catcon = require('./utils');

/**
 * Returns a function that creates the mandatory `UpdateExpression`, `AttributeNames` and `AttributeValues` needed to build
 * an `append` operation and merges everything with the given object containing `UpdateExpression`, `AttributeNames`
 * and `AttributeValues` keys.
 *
 * @param {String} attribute array that you want to extend
 * @param {Array} value to add at the end of the array
 */
function append(attribute, value) {
  return evolve({
    UpdateExpression: catcon(`#${attribute} = list_append(#${attribute}, :${attribute}), `),
    ExpressionAttributeNames: merge({
      [`#${attribute}`]: attribute
    }),
    ExpressionAttributeValues: merge({
      [`:${attribute}`]: value
    })
  });
}

module.exports = append;
