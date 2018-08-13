'use strict';
const {
  compose,
  unapply,
  concat,
  of,
  converge,
  lensIndex,
  reduce,
  mergeDeepLeft,
  over,
  take,
  drop,
  partial,
  map,
  call,
  head,
  last,
  zip
} = require('ramda');
const castArray = require('./cast-array');

/**
 * Returns deeply merged object by merging all objects in a passed list. Merging is applied from the left.
 *
 * @private
 * @see https://ramdajs.com/docs/#mergeDeepLeft
 * @param {Array} list Array of objects
 * @returns {Object} Merged object
 *
 * @example
 * 		const a = { fooA: { bar: 'a' }, shared: { baz: 1 } };
 * 		const b = { fooB: { bar: 'b' }, shared: { baz: 2 } };
 * 		const c = { fooC: { bar: 'c' }, shared: { baz: 3 } };
 *
 * 		mergeDeepAll([a, b, c])
 * 		// {
 * 	 	// 	fooA: { bar: 'a' },
 * 		// 	fooB: { bar: 'b' },
 * 		// 	fooC: { bar: 'c' },
 * 		// 	shared: { baz: 1 },
 * 		// }
 */
const mergeDeepAll = reduce(mergeDeepLeft, {});

/**
 * Takes the first N elements of an array and deep merge them
 * together, while leaving the rest untouched.
 *
 * @private
 * @example
 *
 *  mergeN(2)([{ foo: 'bar' }, { baz: 'db' }, 42]);
 *  // -> [{ foo: 'bar', baz: 'db' }, 42]
 *
 */
const mergeN = n =>
  converge(concat, [
    compose(
      of,
      mergeDeepAll,
      take(n)
    ),
    drop(n)
  ]);

/**
 * Updates the first element of the input array and returns a new array
 * with the modifications.
 *
 * @private
 * @example
 *
 *  overFirst(R.add(2))([1, 2, 4]);
 *  // -> [3, 2, 4]
 *
 *
 * @param {Function} fn The function to execute on first element of array
 */
const overFirst = fn => over(lensIndex(0), fn);

/**
 * Applies a list of functions to a list of values with corresponding indices
 * and returns the resulting list. Any values that do not have a matching mapping
 * function (i.e.: there are more values than functions), are returned as is.
 *
 * @private
 * @example
 *
 *  overAll([R.add(1), R.add(2)])([2, 3, 4])
 *  // -> [3, 5, 4]
 *
 * @param {Array<Function>} fns A list of functions to apply to list of values
 */
const overAll = fns =>
  converge(concat, [
    compose(
      map(converge(call, [head, last])),
      zip(fns),
      take(fns.length)
    ),
    drop(fns.length)
  ]);

/**
 * Returns a variadic function that expects arbitrary arguments and map those one by one
 * by applying functions in `fns` (first function in `fns` transforms first argument, etc.)
 * and collecting them in an array.
 * After that, the first `n` elements of the resulting array are shallowly merged. All
 * remaining elements are returned as-is.
 *
 * @private
 * @example
 *
 *  mapMergeNArgs(2, [R.pick(['foo']), R.pick(['bar'])])({foo: 42, bar: false}, { foo: 101, bar: true }, { baz: 33 })
 *  // -> [{ foo: 42, bar: true }, { baz: 33 }]
 *
 * @param {Number} n The number elements to merge
 * @param {Function} fns A list of mapping function to apply to input.
 */
const mapMergeNArgs = (n, fns) =>
  unapply(
    compose(
      mergeN(n),
      overAll(castArray(fns))
    )
  );

/**
 * Returns a function that passes its first argument to `fn`. The result of `fn`
 * is, then, merged with the second argument of the original function which is then call
 * with it.
 *
 * @private
 * @param {Function} fn The mapping function to apply to the first argument
 */
const mapMergeFirstPairOfArgs = partial(mapMergeNArgs, [2]);

module.exports = {
  overFirst,
  overAll,
  mapMergeFirstPairOfArgs,
  mapMergeNArgs
};
