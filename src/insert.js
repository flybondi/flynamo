'use strict';
/**
 * Create new items, or replace old items with new ones.
 * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html
 * @module PutItem
 */
const { curry, bind, compose, apply } = require('ramda');
const generateItem = require('./generate-item');
const addTableName = require('./table-name');
const { mapMergeFirstPairOfArgs } = require('./map-merge-args');

/**
 * @private
 */
const createInsert = putItem =>
  compose(
    apply(putItem),
    mapMergeFirstPairOfArgs(generateItem)
  );

/**
 * @private
 */
const createInsertFor = curry((putItem, table) =>
  compose(
    apply(putItem),
    mapMergeFirstPairOfArgs(
      compose(
        addTableName(table),
        generateItem
      )
    )
  )
);

function createInserter(dynamoWrapper) {
  const putItem = bind(dynamoWrapper.putItem, dynamoWrapper);
  return {
    /**
     * Creates a new item, or replaces an old item with a new item.
     * If an item that has the same primary key as the new item already exists in the specified table,
     * the new item completely replaces the existing item. This function uses `PutItem` internally.
     *
     * @function
     * @example
     *
     *  await insert({ id: 42, foo: 'bar' }, { TableName: 'SomeTable' });
     *  // Upserts item of primary key `{id: 42}` of `SomTable`
     *
     * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html#API_PutItem_RequestSyntax
     * @param {Object} item The item to insert. Will be converted into a map of DynamoDB attributes.
     * @param {Object} request Parameters as expected by DynamoDB `PutItem` operation. Must contain, at least, `TableName` attribute.
     * @returns {Promise} Resolves to the response from DynamoDB client.
     */
    insert: createInsert(putItem),

    /**
     * Returns a function Creates a new item, or replaces an old item with a new item.
     * If an item that has the same primary key as the new item already exists in the specified table,
     * the new item completely replaces the existing item. This function uses `PutItem` internally.
     * The last `request` argument is optional and is only required if any non mandatory attribute
     * needs to be included in the request.
     * You would typically use this function through {@link forTable}.
     *
     * @function
     * @example
     *
     *  // Upserts item of primary key `{id: 42}` of `SomeTable`
     *  await insertFor('SomeTable')({ id: 42, foo: 'bar' });
     *
     * @example
     *
     *  // Upserts item of primaty key `{id: 42}` as long as `name` is not 'Alice'
     *  await insertFor('SomeTable')(
     *    { id: 42, name: 'Bob' },
     *    { ConditionExpression: 'name <> :f', ExpressionAttributeValues: { ':f': { 'S': 'Alice' } } }
     *  );
     *
     * @example
     *
     *  // Upserts item of primary key `{id: 42}` of `SomeTable`
     *  const { insert } = forTable('SomeTable');
     *  await insert({ id: 42, name: 'Bob' });
     *
     * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html#API_PutItem_RequestSyntax
     * @param {string} tableName The name of the DynamoDB table to run the query on
     * @param {Object} item The item to insert. Will be converted into a map of DynamoDB attributes.
     * @param {Object=} request Parameters as expected by DynamoDB `PutItem` operation. Must contain, at least, `TableName` attribute.
     * @returns {Promise} Resolves to the response from DynamoDB client.
     */
    insertFor: createInsertFor(putItem)
  };
}

module.exports = createInserter;
