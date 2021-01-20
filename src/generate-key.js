'use strict';
const { is, compose, unless, isNil, has, objOf, either, propIs, prop, when } = require('ramda');
const { wrapOver } = require('./wrapper');

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
 *  // -> { Key: { id: { S: 'xYhd76' } } }
 *
 *  generateKey(105);
 *  // -> { Key: { id: { N: '105' } } }
 *
 *  generateKey({ Key: { id: 'xYhd76' } });
 *  // -> { Key: { id: { S: 'xYhd76' } } }
 *
 *  generateKey(undefined);
 *  // -> undefined
 *
 * @returns {Object} An object containing a `Key` property.
 */
const generateKey = unless(
  either(isNil, is(Function)),
  compose(
    wrapOver('Key'),
    unless(
      propIs(Object, 'Key'),
      compose(objOf('Key'), unless(is(Object), objOf('id')), when(has('Key'), prop('Key')))
    )
  )
);

module.exports = generateKey;
