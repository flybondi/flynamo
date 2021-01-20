'use strict';
const { is, compose, unless, anyPass, isNil, has, objOf } = require('ramda');
const { wrap } = require('./wrapper');

/**
 * Generates an object containing a `Key` property such as the one expected
 * by some `AWS.DynamoDB` API methods from any value.
 * If the value is an object, it will be wrapped around a new object with
 * said property as root.
 * If the value is not an object, a key name of `id` is assumed.
 * If the value is either `undefined` or `null`, it'll be returned as-is.
 *
 * @function
 * @private
 * @example
 *  generateKey({ id: 'xYhd76' });
 *  // -> { Key: { id: 'xYhd76' } }
 *
 *  generateKey(105);
 *  // -> { Key: { id: 105 } }
 *
 *  generateKey({ Key: { id: 'xYhd76' } });
 *  // -> { Key: { id: 'xYhd76' } }
 *
 *  generateKey(undefined);
 *  // -> undefined
 *
 * @returns {Object} An object containing a `Key` property.
 */
const generateKey = unless(
  anyPass([isNil, is(Function), has('Key')]),
  compose(objOf('Key'), wrap, unless(is(Object), objOf('id')))
);

module.exports = generateKey;
