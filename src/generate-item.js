'use strict';
const {
  compose,
  objOf,
  has,
  either,
  both,
  unless,
  ifElse,
  is,
  isNil,
  propSatisfies
} = require('ramda');
const { wrapOver, wrap } = require('./wrapper');

/**
 * Returns `true` if the specified object property satisfies the given predicate;
 * `false` otherwise. It also returns `false` if given `obj` is not an `Object`.
 *
 * @private
 * @see https://ramdajs.com/docs/#propSatisfies
 * @param {Function} pred Predicate to assert
 * @param {String} name Property name
 * @returns {Boolean}
 */
const safePropSatisfies = (pred, name) => both(is(Object), propSatisfies(pred, name));

/**
 * Generates an object containg an `Item` property such as the one expected
 * by some DynamoDB API methods from any value.
 * If the value is an object, it will wrap it around a new object with
 * said property as root.
 * If the value is `undefined` or `null`, it's returned as-is.
 *
 * @private
 * @example
 *
 *   generateItem({ foo: 'bar' });
 *   // -> { Item: { foo: { S: 'bar' } } }
 *
 *   generateItem(105);
 *   // -> { Item: { N: 105 } }
 *
 *   generateItem({ Item: { foo: 'bar' } });
 *   // -> { Item: { foo: { S: 'bar' } } }
 *
 *   generateItem(undefined);
 *   // -> undefined
 *
 * @returns {Object} An Object containing an `Item` property
 */
const generateItem = compose(
  ifElse(safePropSatisfies(is(Object), 'Item'), wrapOver('Item'), wrap),
  unless(either(isNil, has('Item')), objOf('Item'))
);

module.exports = generateItem;
