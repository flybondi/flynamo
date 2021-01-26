'use strict';
/**
 * The `BatchGetItem` operation retrieves multiple items from a table in a single call.
 * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchGetItem.html
 * @module BatchGetItem
 */
const { compose, map, curry, prop, objOf, apply, bind } = require('ramda');
const { mapMergeFirstPairOfArgs, overFirst } = require('./map-merge-args');
const generateKey = require('./generate-key');
const castArray = require('./cast-array');

/**
 * Generate an object containing a `Keys` property pointing to an array of
 * DynamoDB wrapped document keys, such as `{ Keys: [{ "name":{"S":"Flynamo"} }] }`.
 *
 * @private
 * @function
 * @param {Array|Object} keys The unwrapped keys to generate the `Keys` from
 * @returns {Object} An object containing a `Keys` property
 */
const generateKeys = compose(
  objOf('Keys'),
  map(
    compose(
      // The `BatchGetItem` expects a `Keys` array where each item
      // represents a document key without a wrapping `Key` property.
      // `generateKey` below returns an object such as `{ Key: { id: 42 } }`,
      // so we strip the `Key` field
      prop('Key'),
      generateKey
    )
  ),
  // Support fetching only one document, without passing in an array
  castArray
);

const createBatchGetFor = curry((batchGetItem, table) =>
  compose(
    request => request.promise(),
    apply(batchGetItem),
    overFirst(compose(objOf('RequestItems'), objOf(table))),
    mapMergeFirstPairOfArgs(generateKeys)
  )
);

/**
 * Creates a function to allow retrieval of several documents in a single batch.
 *
 * @private
 * @param {Object} dynamodb The AWS DynamoDB client
 * @returns {Object}
 */
function createGetBatcher(dynamodb) {
  const batchGetItem = bind(dynamodb.batchGetItem, dynamodb);
  return {
    /**
     * Returns the attributes of one or more items from a table. Requested items are identified by primary key.
     * A key represented by a `Number` or a `String` will be assumed to be named `id`.
     * Items will be fetched from `tableName`. You would typically use this function through {@link forTable}.
     *
     * @public
     * @function
     * @example
     *
     *  // Fetch documents of `id` 42, 33 and 7
     *  await batchGetFor('SomeTable')([42, 33, 7]);
     *
     * @example
     *
     *  // Fetch documents of keys `{ foo: 42 }` and `{ foo: 33 }`
     *  await batchGetFor('SomeTable')([{ foo: 42 }, { foo: 33 }]);
     *
     * @example
     *
     *  // Retrieve only `name` and `age` fields
     *  await batchGetFor('SomeTable')([42, 33], { ProjectionExpression: 'name, age' });
     *
     * @example
     *
     *  // Exported from `forTable`
     *  const { batchGet } = forTable('SomeTable');
     *  await batchGet([42, 33, 7]);
     *
     * @param {string} tableName The name of the DynamoDB table to run the query on
     * @param {Array<*> | *} keys Identifiers of elements to get from `tableName`
     * @returns {Promise} Resolves to the {@link https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchGetItem.html#API_BatchGetItem_ResponseSyntax response from DynamoDB client}.
     */
    batchGetFor: createBatchGetFor(batchGetItem)
  };
}

module.exports = createGetBatcher;
