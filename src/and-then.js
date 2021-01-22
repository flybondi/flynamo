'use strict';
const { compose, invoker, andThen: RAndThen } = require('ramda');

/**
 * Invokes `promise` on the given object passing
 * in no arguments.
 *
 * @param {object} obj The obj to invoke `promise` on.
 * @returns {Promise.<*>} A `Promise` as returned by a call to `promise`.
 */
const toPromise = invoker(0, 'promise');

/**
 * Returns the result of applying an `fn` function to the value inside a fulfilled promise,
 * after having invoked `promise()` on the target object.
 *
 * @private
 * @see https://ramdajs.com/docs/#andThen
 * @param {Function} fn The function to apply. Can return a value or a promise of a value.
 */
const andThen = fn => compose(RAndThen(fn), toPromise);

module.exports = { toPromise, andThen };
