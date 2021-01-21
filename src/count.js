'use strict';
/**
 * Return the number of elements in a table or a secondary index.
 * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html
 * @module Count
 */
const { curry, compose, bind, prop } = require('ramda');
const addTableName = require('./table-name');
const withPaginatorHelper = require('./with-paginator-helper');

/**
 * @private
 */
const createCount = scan => params => withPaginatorHelper(scan, params, true).then(prop('Count'));

/**
 * @private
 */
const createCountFor = curry((scan, table) => compose(createCount(scan), addTableName(table)));

function createCounter(dynamodb) {
  const scan = bind(dynamodb.scan, dynamodb);
  return {
    /**
     * Return the number of elements in a table or a secondary index. This function
     * uses `Scan` internally and retrieves the returned `Count` attribute from its response.
     *
     * @function
     * @example
     *
     * // Returns the total count of items in `SomeTable`
     * await count({ TableName: 'SomeTable' });
     *
     *
     * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html#API_Scan_RequestSyntax
     * @param {Object} request Parameters as expected by DynamoDB `Scan` operation.
     * @returns {Promise} A promise that resolves to the total number of elements
     */
    count: createCount(scan),

    /**
     * Creates a function that returns the number of elements in a table or a secondary index.
     * This function uses `Scan` internally and retrieves the returned `Count` attribute from its response.
     * The last `request` argument is optional and is only required if any non mandatory attribute
     * needs to be included in the request.
     * You would typically use this function through {@link forTable}.
     *
     * @function
     * @example
     *
     *  // Returns the total count of items in `SomeTable`
     *  await countFor('SomeTable')();
     *
     * @example
     *
     *  // Exported from `forTable`
     *  const { count } = forTable('SomeTable');
     *  await count();
     *
     * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html
     * @param {String} tableName The name of the table to perform the operation on
     * @param {Object=} request Parameters as expected by DynamoDB `Scan` operation.
     * @returns {Promise} A promise that resolves to the total number of elements on `tableName`.
     */
    countFor: createCountFor(scan)
  };
}

module.exports = createCounter;
