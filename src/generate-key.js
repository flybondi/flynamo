'use strict';
const { is, compose, unless, anyPass, isNil, has, objOf } = require('ramda');
const { wrap } = require('./wrapper');

/**
 * Generates an object containg a `Key` property such as the one expected
 * by some DynamoDB API methods from any value.
 * If the value is an object, it will wrap it around a new object with
 * said property as root.
 * If the value is not an object, a key name of `id` is assumed.
 * If the value is `undefined` or `null`, it's returned as-is.
 *
 * @private
 * @example
 *   generateKey({ id: 'xYhd76' });
 *   // -> { Key: { id: 'xYhd76' } }
 *
 *   generateKey(105);
 *   // -> { Key: { id: 105 } }
 *
 *   generateKey(undefined);
 *   // -> undefined
 *
 * @returns {Object} An Object containing a `Key` property
 */
const generateKey = unless(
  anyPass([isNil, is(Function), has('Key')]),
  compose(objOf('Key'), wrap, unless(is(Object), objOf('id')))
);

module.exports = generateKey;
