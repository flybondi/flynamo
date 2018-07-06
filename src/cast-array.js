'use strict';
const { unless, is, of } = require('ramda');

/**
 * Wraps any value in an `Array` if it's not already one.
 *
 * @private
 * @param {*} value The value to wrap
 * @returns {Array} An `Array` containing the given `value`
 *  or the same given input if it was already an `Array`.
 */
const castArray = unless(is(Array), of);

module.exports = castArray;
