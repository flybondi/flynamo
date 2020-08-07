'use strict';
/**
 * The `DescribeTable` operation returns information about the table.
 * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DescribeTable.html
 * @module DescribeTable
 */
const { bind, curry, compose } = require('ramda');
const addTableName = require('./table-name');

/**
 * @private
 */
const createDescribeTableFor = curry((describeTable, table) =>
  compose(describeTable, addTableName(table))
);

function createDescribers(dynamoWrapper) {
  const describeTable = bind(dynamoWrapper.describeTable, dynamoWrapper);
  return {
    /**
     * Retrieves information about the table.
     *
     * @function
     * @example
     *
     *  // Returns information about the table, including the current status of the table, when it was created, the primary key schema, and any indexes on the table.
     *  await describeTable({
     *    TableName: 'SomeTable'
     *  });
     *
     * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DescribeTable.html#API_DescribeTable_RequestParameters
     * @param {Object} request Parameters as expected by DynamoDB `DescribeTable` operation. Must contain, at least, `TableName` attribute.
     * @returns {Promise} A promise that resolves to the response from DynamoDB.
     */
    describeTable,

    /**
     * Creates a function that describe given table.
     * You would typically use this function through {@link forTable}.
     *
     * @function
     * @example
     *
     *  // Returns information about the table, including the current status of the table, when it was created, the primary key schema, and any indexes on the table.
     *  await describeTableFor('SomeTable')
     *
     * @example
     *
     *  // Exported from `forTable`
     *  const { describeTable } = forTable('SomeTable');
     *  await describeTable();
     *
     *
     * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DescribeTable.html#API_DescribeTable_RequestParameters
     * @param {String} tableName The name of the table to perform the operation on
     * @param {Object=} request Parameters as expected by DynamoDB `DescribeTable` operation. A `TableName` attributes specified here will override `tableName` argument.
     * @returns {Promise} A promise that resolves to the response from DynamoDB.
     */
    describeTableFor: createDescribeTableFor(describeTable)
  };
}

module.exports = createDescribers;
