'use strict';
/**
 * The `Query` operation finds items based on primary key values.
 * You can query any table or secondary index that has a composite primary key (a partition key and a sort key).
 * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html
 * @module Query
 */
const { bind, curry, compose } = require('ramda');
const { unwrapAll, unwrapOverAll } = require('./wrapper');
const addTableName = require('./table-name');

/**
 * @private
 */
const createQuery = query => (params, options) =>
  query(params, options).then(options && options.raw ? unwrapOverAll('Items') : unwrapAll('Items'));

/**
 * @private
 */
const createQueryFor = curry((query, table) => compose(createQuery(query), addTableName(table)));

function createQuerier(dynamoWrapper) {
  const query = bind(dynamoWrapper.query, dynamoWrapper);
  return {
    /**
     * Finds items based on primary key values.
     *
     * @function
     * @example
     *
     *  // Returns all items in `SomeTable` of `id` `42` and `birthDate` between 1985 and 2019
     *  await query({
     *    TableName: 'SomeTable',
     *    KeyConditionExpression: "id = :identifier AND birthDate BETWEEN :d1 AND :d2",
     *    ExpressionAttributeValues: {
     *      identifier: { N: 42 },
     *      d1: { S: '1985-01-01' },
     *      d2: { S: '2019-01-01' }
     *    }
     *  });
     *
     * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html#API_Query_RequestSyntax
     * @param {Object} request Parameters as expected by DynamoDB `Query` operation. Must contain, at least, `TableName` attribute.
     * @param {Object=} options The configuration options parameters.
     * @param {number=} options.groupDelayMs The delay between individual requests. Defaults to 100 ms.
     * @param {boolean=} options.raw Whether to return the full DynamoDB response object when `true` or just the `Items` property value.
     * @returns {Promise} A promise that resolves to the response from DynamoDB.
     */
    query: createQuery(query),

    /**
     * Creates a function that finds items based on primary key values.
     * You would typically use this function through {@link forTable}.
     *
     * @function
     * @example
     *
     *  // Returns all items in `SomeTable` of `id` `42` and `birthDate` between 1985 and 2019
     *  await queryFor('SomeTable')({
     *    KeyConditionExpression: "id = :identifier AND birthDate BETWEEN :d1 AND :d2",
     *    ExpressionAttributeValues: {
     *      identifier: { N: 42 },
     *      d1: { S: '1985-01-01' },
     *      d2: { S: '2019-01-01' }
     *    }
     *  });
     *
     * @example
     *
     *  // Exported from `forTable`
     *  const { query } = forTable('SomeTable');
     *  await query({
     *    KeyConditionExpression: "id = :identifier AND postedBy BETWEEN :p1 AND :p2",
     *    ExpressionAttributeValues: {
     *      identifier: { N: 42 },
     *      p1: { S: 'Alice' },
     *      p2: { S: 'Dave' }
     *    }
     *  });
     *
     *
     * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html#API_Query_RequestSyntax
     * @param {String} tableName The name of the table to perform the operation on
     * @param {Object=} request Parameters as expected by DynamoDB `Query` operation. A `TableName` attributes specified here will override `tableName` argument.
     * @param {Object=} options The configuration options parameters.
     * @param {number=} options.groupDelayMs The delay between individual requests. Defaults to 100 ms.
     * @param {boolean=} options.raw Whether to return the full DynamoDB response object when `true` or just the `Items` property value.
     * @returns {Promise} A promise that resolves to the response from DynamoDB.
     */
    queryFor: createQueryFor(query)
  };
}

module.exports = createQuerier;
