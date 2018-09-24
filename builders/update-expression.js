'use strict';
/**
 * Edit an existing item's attributes, or add a new item to a table if it does not already exist.
 * You can put or add attribute values.
 * @module Builders
 */

const { ifElse, endsWith, compose, evolve, concat, dropLast, merge, flip } = require('ramda');

/**
 * because original concat sucks
 * @private
 */
const catcon = flip(concat);

/**
 * Returns a function that, when invoked with a set of default values for a dynamo expression,
 * it creates the mandatory UpdateExpression, AttributeNames and AttributeValues needed to build
 * the `action` operations created by the given `operation` function.
 *
 * @function
 * @param {String} action to execute in dynamodb, it can be SET, ADD, DELETE or REMOVE
 * @param {Function} operations that returns an object with the operations to execute and their parameters
 */
const updateExpression = (action, operations) =>
  compose(
    evolve({
      UpdateExpression: ifElse(endsWith(` ${action} `), dropLast(` ${action} `.length), dropLast(2))
    }),
    operations,
    evolve({
      UpdateExpression: catcon(` ${action} `)
    })
  );

/**
 * Returns a function that creates the mandatory `UpdateExpression`, `AttributeNames` and `AttributeValues` needed to build
 * a `put` operation and merges everything with the given object containing `UpdateExpression`, `AttributeNames`
 * and `AttributeValues` keys
 *
 * @function
 * @param {String} attribute
 * @param {String} value
 */
const put = (attribute, value) =>
  evolve({
    UpdateExpression: catcon(`#${attribute} = :${attribute}, `),
    ExpressionAttributeNames: merge({
      [`#${attribute}`]: attribute
    }),
    ExpressionAttributeValues: merge({
      [`:${attribute}`]: value
    })
  });

/**
 * Returns a function that creates the mandatory `UpdateExpression`, `AttributeNames` and `AttributeValues` needed to build
 * an `append` operation and merges everything with the given object containing `UpdateExpression`, `AttributeNames`
 * and `AttributeValues` keys
 *
 * @function
 * @param {String} attribute
 * @param {Array} value
 */
const append = (attribute, value) =>
  evolve({
    UpdateExpression: catcon(`#${attribute} = list_append(#${attribute}, :${attribute}), `),
    ExpressionAttributeNames: merge({
      [`#${attribute}`]: attribute
    }),
    ExpressionAttributeValues: merge({
      [`:${attribute}`]: value
    })
  });

/**
 * Returns a function that creates the mandatory `UpdateExpression`, `AttributeNames` and `AttributeValues` needed to build
 * a `remove` operation and merges everything with the given object containing `UpdateExpression`, `AttributeNames`
 * and `AttributeValues` keys
 *
 * @function
 * @param {String} attribute
 */
const remove = attribute =>
  evolve({
    UpdateExpression: catcon(`#${attribute}, `),
    ExpressionAttributeNames: merge({
      [`#${attribute}`]: attribute
    }),
    ExpressionAttributeValues: merge({})
  });

module.exports = {
  append,
  updateExpression,
  put,
  remove
};
