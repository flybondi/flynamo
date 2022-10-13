'use strict';
/**
 * The `Scan` operation returns one or more items and item attributes by accessing every item in a table or a secondary index. To have DynamoDB return fewer items, you can provide a FilterExpression operation.
 * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html
 * @module Scan
 */
const { curry, bind, pipeWith, andThen, compose } = require('ramda');
const { unwrapAll } = require('./wrapper');
const addTableName = require('./table-name');
const pipeP = pipeWith(andThen);

/**
 * @private
 */
const createGetAll = scan => pipeP([scan, unwrapAll('Items')]);

/**
 * @private
 */
const createGetAllFor = curry((scan, table) => compose(createGetAll(scan), addTableName(table)));

function createAllGetter(dynamoWrapper) {
  const scan = bind(dynamoWrapper.scan, dynamoWrapper);
  return {
    /**
     * Returns all items in a table or a secondary index. This uses `Scan` internally.
     *
     * @function
     * @example
     *
     *  await getAll({ TableName: 'SomeTable' });
     *  // Will return all items in `SomeTable`
     *
     * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html#API_Scan_RequestSyntax
     * @param {Object} request Parameters as expected by DynamoDB `Scan` operation.
     * @returns {Promise} A promise that resolves to an array of `Items` returned by the DynamoDB response
     */
    getAll: createGetAll(scan),
    /**
     * Returns a function that returns all items in a table or a secondary index. This uses `Scan` internally.
     * You would typically use this function through {@link forTable}.
     *
     * @function
     * @example
     *
     *  await getAllFor('SomeTable')({ Limit: 10 });
     * // Will return first 10 items in `SomeTable`
     *
     * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html#API_Scan_RequestSyntax
     * @param tableName The name of the table to perform the operation on. This will override any `TableName`
     *  attribute set on `request`.
     * @param {Object=} request Parameters as expected by DynamoDB `Scan` operation.
     * @returns {Promise} A promise that resolves to an array of `Items` returned by the DynamoDB response
     */
    getAllFor: createGetAllFor(scan)
  };
}

module.exports = createAllGetter;
