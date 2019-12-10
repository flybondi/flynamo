'use strict';
const { unless, has, assoc, defaultTo, compose } = require('ramda');

/**
 * Sets a `ReturnValues` attribute to an object pointint to `value`.
 *
 * @private
 * @param {String} value The value to be assigned to `ReturnValues` attribute.
 * @returns {Function}
 */
const addReturnValues = value =>
  compose(unless(has('ReturnValues'), assoc('ReturnValues', value)), defaultTo({}));

module.exports = addReturnValues;
