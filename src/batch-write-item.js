'use strict';
/**
 * The `BatchWriteItem` operation puts or deletes multiple items in one table.
 * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html
 * @module BatchWriteItem
 */
const {
  curry,
  bind,
  compose,
  over,
  lensProp,
  map,
  objOf,
  values,
  unnest,
  apply,
  when,
  has
} = require('ramda');
const generateKey = require('./generate-key');
const generateItem = require('./generate-item');
const { mapMergeFirstPairOfArgs } = require('./map-merge-args');
const castArray = require('./cast-array');

/**
 * Expects an object with a `remove` property containing an `Array` of
 * either integer ids or DynamoDB `Key` objects and generate valid `DeleteRequest`
 * params as required by `BatchWriteItem`
 *
 * @private
 * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html
 * @param {Object} params An object with a `remove` prop
 * @returns {Object}
 */
const generateDeleteRequests = when(
  // Make sure `remove` is present in request to avoid creating
  // empty `DeleteRequest` requests
  has('remove'),
  over(
    lensProp('remove'),
    compose(
      map(
        compose(
          // Wrap `Key` in a `DeleteRequest` object
          objOf('DeleteRequest'),
          // For each item, generate a wrapped `Key` object
          generateKey
        )
      ),
      // Generate an array of keys if it's not one already
      // (support sending only one item)
      castArray
    )
  )
);

const generatePutRequests = when(
  // Make sure `insert` is present in request to avoid creating
  // empty `PutRequest` requests
  has('insert'),
  over(
    lensProp('insert'),
    compose(
      map(
        compose(
          // Wrap `Item` in a `PutRequest` object
          objOf('PutRequest'),
          // For each item, generate a DynamoDB `Item` object
          generateItem
        )
      ),
      // Generate an array of keys if it's not one already
      // (support sending only one item)
      castArray
    )
  )
);

const generateRequestItems = table =>
  compose(
    objOf('RequestItems'),
    objOf(table),
    // `generatePutRequests` and `generateDeleteRequests` return an
    // object containing `{ insert: [Item, ...], remove: [Key, ...]}`
    // so we pick the values (both arrays on object above) and flatten
    // the resulting array to obtain a single array of requests containing both types
    unnest,
    values,
    generatePutRequests,
    generateDeleteRequests
  );

const createBatchWriteFor = curry((batchWriteItem, table) =>
  compose(apply(batchWriteItem), mapMergeFirstPairOfArgs(generateRequestItems(table)))
);

const createBatchRequestFor = curry((batchWriteItem, requestType, table) =>
  compose(
    apply(batchWriteItem),
    mapMergeFirstPairOfArgs(compose(generateRequestItems(table), objOf(requestType)))
  )
);

/**
 * Creates functions to allow removal and insertions of documents in a single batch.
 *
 * @private
 * @param {Object} dynamoWrapper The AWS DynamoDB client
 * @returns {Object}
 */
function createWriteBatcher(dynamoWrapper) {
  const batchWriteItem = bind(dynamoWrapper.batchWriteItem, dynamoWrapper);
  return {
    /**
     * Returns a function that puts or deletes multiple items in a table. It expects a single
     * object argument containing `insert` and/or `remove` array properties. Each describe
     * items that will be inserted or deleted from `tableName`. Each element in these arrays
     * can be thought of as inputs to corresponding `insert` or `remove` Flynamo functions.
     * You would typically use this function through {@link forTable}.
     *
     * @public
     * @function
     * @example
     *
     *  // Inserts two items in `SomeTable`
     *  await batchWriteFor('SomeTable')({ insert: [{ foo: 'bar' }, { foo: 'baz' }] });
     *
     * @example
     *
     *  // Inserts one item and remove item with Key 42 is `SomeTable`
     *  await batchWriteFor('SomeTable')({ insert: [{ foo: 'bar' }], remove: [42] });
     *
     * @example
     *
     *  // Exported from `forTable`
     *  const { batchWrite } = forTable('SomeTable');
     *  await batchWrite({ insert: [{ foo: 'bar' }], remove: [42] });
     *
     * @param {string} tableName The name of the DynamoDB table to run the query on
     * @param {Object} items An object containing `insert` and/or `remove` properties.
     * @returns {Promise} Resolves to the response from DynamoDB client.
     */
    batchWriteFor: createBatchWriteFor(batchWriteItem),

    /**
     * Returns a function that puts items in a table in a single batch.
     * It expects an array of arbitrary items to insert in `tableName`. It also supports
     * inserting a single element (i.e.: not passing in an array).
     * You would typically use this function through {@link forTable}.
     *
     * @public
     * @function
     * @example
     *
     *  // Inserts two items in `SomeTable`
     *  await batchInsertFor('SomeTable')([{ foo: 'bar' }, { foo: 'baz' }]);
     *
     * @example
     *
     *  // Exported from `forTable`
     *  const { batchInsert } = forTable('SomeTable');
     *  batchInsert([{ foo: 'bar' }, { foo: 'baz' }]);
     *
     * @param {string} tableName The name of the DynamoDB table to run the query on
     * @param {Array.<Object> | Object} items Items to insert into `tableName`
     * @returns {Promise} Resolves to the response from DynamoDB client.
     */
    batchInsertFor: createBatchRequestFor(batchWriteItem, 'insert'),

    /**
     * Returns a functin that deletes multitple items from a table in a single batch.
     * It expects an array of `Key` values to delete. If no name is specified for the `Key`,
     * a name of `id` will be assumed.
     * You would typically use this function through {@link forTable}.
     *
     * @public
     * @function
     * @example
     *
     *  // Removes a document with Key `{ foo: 'bar' }`
     *  await batchRemoveFor('SomeTable')([{ Key: { foo: 'bar' } }]);
     *
     * @example
     *
     *  // Removes three documents with Keys `{id: 33}`, `{id: 42}` and `{id: 7}`
     *  await batchRemoveFor('SomeTable')([33, 42, 7]);
     *
     * @example
     *
     *  // Exported from `forTable`
     *  const { batchRemove } = forTable('SomeTable');
     *  await batchRemove([33, 42, 7]);
     *
     *
     * @param {string} tableName The name of the DynamoDB table to run the query on
     * @param {Array<*> | *} keys Identifiers of elements to delete from `tableName`
     * @returns {Promise} Resolves to the response from DynamoDB client.
     */
    batchRemoveFor: createBatchRequestFor(batchWriteItem, 'remove')
  };
}

module.exports = createWriteBatcher;
