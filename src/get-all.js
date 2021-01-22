'use strict';
/**
 * The `Scan` operation returns one or more items and item attributes by accessing every item in a table or a secondary index. To have DynamoDB return fewer items, you can provide a FilterExpression operation.
 * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html
 * @module Scan
 */
const { curry, bind, compose, mergeRight } = require('ramda');
const { rejectNilOrEmpty } = require('@flybondi/ramda-land');
const { unwrapAll, unwrapOverAll } = require('./wrapper');
const addTableName = require('./table-name');
const withPaginator = require('./with-paginator');

const DEFAULT_OPTIONS = Object.freeze({
  autopagination: true,
  raw: false
});
const mergeWithDefaults = compose(mergeRight(DEFAULT_OPTIONS), rejectNilOrEmpty);

/**
 * @private
 */
const createGetAll = scan => (params, options = {}) => {
  const { raw, autopagination } = mergeWithDefaults(options);
  const scanFn = autopagination ? withPaginator(scan) : scan;
  return scanFn(params).then(raw ? unwrapOverAll('Items') : unwrapAll('Items'));
};

/**
 * @private
 */
const createGetAllFor = curry((scan, table) => compose(createGetAll(scan), addTableName(table)));

function createAllGetter(dynamodb) {
  const scan = bind(dynamodb.scan, dynamodb);
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
     * @param {Object} [options] The configuration options parameters.
     * @param {boolean} [options.autopagination=true] Wheter to return all the DynamoDB response pages or just one page.
     * @param {boolean} [options.raw=false] Whether to return the full DynamoDB response object when `true` or just the `Items` property value.
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
     * @param {Object} [options] The configuration options parameters.
     * @param {boolean} [options.autopagination=true] Wheter to return all the DynamoDB response pages or just one page.
     * @param {boolean} [options.raw=false] Whether to return the full DynamoDB response object when `true` or just the `Items` property value.
     * @returns {Promise} A promise that resolves to an array of `Items` returned by the DynamoDB response
     */
    getAllFor: createGetAllFor(scan)
  };
}

module.exports = createAllGetter;
