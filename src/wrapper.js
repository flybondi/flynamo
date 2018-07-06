'use strict';
const { compose, prop, map, unless, when, isNil, over, lensProp } = require('ramda');
const { AttributeValue, AttributeValueUpdate } = require('dynamodb-data-types');

/**
 * Naive implementation of object deep cloning using `JSON.stringify` + `JSON.parse`.
 * This removes functions, `RegExp` and `Date` from original object.
 *
 * @private
 * @param {Object} obj The object to clone
 * @returns {Object} A deep clone of the given object
 */
const deepClone = compose(
  JSON.parse,
  JSON.stringify
);

/**
 * Deep clones an object (using `JSON.stringify` + `JSON.parse`) only if its prototype
 * is `null`. This is, for example, case of objects created by means of `Object.create(null)`.
 *
 * @private
 * @see deepClone
 * @param {Object} obj The object to clone
 * @returns {Object} A deep clone of the given object or the same object as was given, if
 *  it's prototype is not `null`.
 */
const deepCloneIfNilPrototype = when(
  compose(
    isNil,
    Object.getPrototypeOf
  ),
  deepClone
);

/**
 * Wraps attribute values and converts them into DynamoDB representations.
 * Useful for generating `UpdateItem` requests.
 *
 * @private
 * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_AttributeValueUpdate.html
 * @param {Object} attrs The attributes to convert to DynamoDB `AttributeValueUpdate`.
 * @returns {Object} The `AttributeValueUpdate` object
 */
const safelyWrapUpdatePut = unless(
  isNil,
  compose(
    AttributeValueUpdate.put,
    // Force all objects on input to be instances of `Object`.
    // This ensures that `AttributeValueUpdate.put` works even on
    // objects created using `Object.create(null)`
    // @see https://github.com/kayomarz/dynamodb-data-types/blob/7e4afb360e8aa61a0812709a8d5e64cbb400f192/lib/AttributeValue.js#L134
    deepCloneIfNilPrototype
  )
);

/**
 * Unwraps a DynamoDB object unless it's `undefined` or `null`, in which
 * case returns the value as-is.
 *
 * @private
 * @see https://www.npmjs.com/package/dynamodb-data-types
 */
const safelyUnwrap = unless(isNil, AttributeValue.unwrap);

/**
 * Wraps an object to convert it to a DynamoDB representation, unless
 * it's `null` or `undefined`, in which case returns the value as-is.
 *
 * @private
 * @see https://www.npmjs.com/package/dynamodb-data-types
 */
const safelyWrap = unless(
  isNil,
  compose(
    AttributeValue.wrap,
    // Force all objects on input to be instances of `Object`.
    // This ensures that `AttributeValue.wrap` works even on
    // objects created using `Object.create(null)`
    // @see https://github.com/kayomarz/dynamodb-data-types/blob/7e4afb360e8aa61a0812709a8d5e64cbb400f192/lib/AttributeValue.js#L134
    deepCloneIfNilPrototype
  )
);

/**
 * Extracts an `Items` property containing an array or items aand unwraps all of them
 * by means of `AttributeValue.unwrap`.
 * If `Items` if either `null` or `undefined`, it returns the value as-is.
 *
 * @private
 * @see https://www.npmjs.com/package/dynamodb-data-types#quick-example
 */
const unwrapAll = key =>
  compose(
    unless(isNil, map(safelyUnwrap)),
    prop(key)
  );

/**
 * Returns a function that updates an object under a `key` property with
 * its DynamoDB representation. It does not mutate the original object.
 *
 * @private
 * @param {String} key The name of the prop to update
 */
const wrapOver = key => over(lensProp(key), safelyWrap);

/**
 * Returns a function that extracts a property from an object and creates
 * a DynamoDB attribute representation out of it.
 *
 * @private
 * @param {String} key The name of the prop to wrap
 * @returns {Function}
 */
const wrapProp = key =>
  compose(
    safelyWrap,
    prop(key)
  );

/**
 * Returns a function that unwraps an object under a `key` property.
 * It does not mutate the original object.
 *
 * @private
 * @param {String} key The name of the prop to update
 * @returns {Function}
 */
const unwrapOver = key => over(lensProp(key), safelyUnwrap);

const unwrapProp = key =>
  compose(
    safelyUnwrap,
    prop(key)
  );

module.exports = {
  wrap: safelyWrap,
  unwrap: safelyUnwrap,
  unwrapProp,
  wrapProp,
  unwrapAll,
  wrapOver,
  wrapUpdatePut: safelyWrapUpdatePut,
  unwrapOver
};
