'use strict';
const createGetter = require('./get');
const createAllGetter = require('./get-all');
const createInserter = require('./insert');
const createQuerier = require('./query');
const createRemover = require('./remove');
const createUpdater = require('./update');
const createCounter = require('./count');
const createWriteBatcher = require('./batch-write-item');
const createGetBatcher = require('./batch-get-item');
const DynamoDBWrapper = require('dynamodb-wrapper');

/**
 * Wraps an AWS DynamoDB `client` and returns Flynamo's API to access
 * its methods. Optionally, a `config` object for `dynamodb-wrapper` may be provided.
 *
 * @see https://github.com/Shadowblazen/dynamodb-wrapper#setup
 * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html
 * @param {import('aws-sdk').DynamoDB} client A DynamoDB client
 * @param {import('dynamodb-wrapper').IDynamoDBWrapperOptions} [config={}]  `DynamoDBWrapper` configuration (optional).
 */
function flynamo(client, config = {}) {
  const clientWrapper = new DynamoDBWrapper(client, config);

  const { get, getFor } = createGetter(clientWrapper);
  const { getAll, getAllFor } = createAllGetter(clientWrapper);
  const { insert, insertFor } = createInserter(clientWrapper);
  const { query, queryFor } = createQuerier(clientWrapper);
  const { remove, removeFor } = createRemover(clientWrapper);
  const { update, updateFor } = createUpdater(clientWrapper);
  const { count, countFor } = createCounter(clientWrapper);
  const { batchWriteFor, batchRemoveFor, batchInsertFor } = createWriteBatcher(clientWrapper);
  const { batchGetFor } = createGetBatcher(clientWrapper);

  function forTable(table) {
    return {
      get: getFor(table),
      getAll: getAllFor(table),
      insert: insertFor(table),
      query: queryFor(table),
      remove: removeFor(table),
      update: updateFor(table),
      count: countFor(table),
      batchWrite: batchWriteFor(table),
      batchInsert: batchInsertFor(table),
      batchRemove: batchRemoveFor(table),
      batchGet: batchGetFor(table)
    };
  }

  return {
    get,
    getFor,
    getAll,
    getAllFor,
    insert,
    insertFor,
    query,
    queryFor,
    remove,
    removeFor,
    update,
    updateFor,
    count,
    countFor,
    batchWriteFor,
    batchRemoveFor,
    batchInsertFor,
    batchGetFor,

    /**
     * Returns a Flynamo API that automatically adds a `TableName` prop
     * to all its requests. This serves as a shorthand for manually adding
     * `TableName` to DynamoDB `request` arguments or using regular `*for` functions in the API
     * (such as `countFor`, `getFor`, etc.). This is how you would typically use those `*for` functions.
     *
     * @function
     * @example
     *
     *  const { get, count } = forTable('SomeTable');
     *  await get(42); // Fetch item of primary key `{id: 42}` from `SomeTable`
     *  await count(); // Count total number of elements in `SomeTable`
     *
     * @param {String} tableName The value of `TableName`
     * @returns {Object} The entire Flynamo's API scoped to a single table. The exported
     *  members contain `get`, `getAll`, `insert`, `query`, `update`, `remove`, `count`, `batchWrite`,
     *  `batchInsert`, `batchRemove`, `batchGetFor`.
     */
    forTable
  };
}

module.exports = flynamo;
