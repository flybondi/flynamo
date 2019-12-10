'use strict';
/**
 * Deletes a single item in a table by primary key.
 * You can perform a conditional delete operation that deletes the item if it exists,
 * or if it has an expected attribute value.
 *
 * @module DeleteItem
 * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteItem.html
 */
const { apply, bind, compose, curry, pipeP } = require('ramda');
const { unwrapProp } = require('./wrapper');
const addTableName = require('./table-name');
const { mapMergeFirstPairOfArgs } = require('./map-merge-args');
const generateKey = require('./generate-key');
const addReturnValues = require('./return-values');

/**
 * @private
 */
const removeAndUnwrapAttributes = deleteItem => pipeP(apply(deleteItem), unwrapProp('Attributes'));

/**
 * @private
 */
const createRemove = deleteItem =>
  compose(
    removeAndUnwrapAttributes(deleteItem),
    mapMergeFirstPairOfArgs(compose(addReturnValues('ALL_OLD'), generateKey))
  );

/**
 * @private
 */
const createRemoveFor = curry((deleteItem, table) =>
  compose(
    removeAndUnwrapAttributes(deleteItem),
    mapMergeFirstPairOfArgs(compose(addReturnValues('ALL_OLD'), addTableName(table), generateKey))
  )
);

function createRemover(dynamoWrapper) {
  const deleteItem = bind(dynamoWrapper.deleteItem, dynamoWrapper);
  return {
    /**
     * Deletes a single item in a table by primary key. Returns the `Attributes` present in the
     * DynamoDB response, which, by default, will contain the attributes returned by setting `ReturnValues` to `ALL_OLD`.
     * This function uses `DeleteItem` operation internally.
     *
     * @function
     * @example
     *
     *  // Deletes an item of primary key `{id: 2}` in `SomeTable`
     *  await remove(42, { TableName: 'SomeTable' });
     *
     * @param {*} key The primary key value of the item to delete.
     * @param {Object} request Parameters as expected by DynamoDB `DeleteItem` operation. Must include, at least, a `TableName` attribute.
     * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteItem.html#API_DeleteItem_RequestSyntax
     * @returns {Promise} A promise that resolves to the `Attributes` property of the DynamoDB response. Unless, `ReturnValues` has
     *  been explicitly set, this will match all attributes of the recently deleted element.
     */
    remove: createRemove(deleteItem),

    /**
     * Returns a function that deletes a single item in a table by primary key. Returns the `Attributes` present in the
     * DynamoDB response, which, by default, will contain the attributes returned by setting `ReturnValues` to `ALL_OLD`.
     * This function uses `DeleteItem` operation internally. You would typically use this function through {@link forTable}.
     *
     * @function
     * @example
     *
     *  // Deletes an item of primary key `{id: 2}` in `SomeTable`
     *  await removeFor('SomeTable')(42, { TableName: 'SomeTable' });
     *
     * @example
     *
     *  // Exported from `forTable`
     *  const { remove } = forTable('SomeTable');
     *  await remove(42);
     *
     * @param {String} tableName The name of the table to perform the operation on
     * @param {*} key The primary key value of the item to delete.
     * @param {Object=} request Parameters as expected by DynamoDB `DeleteItem` operation (optional).
     *  Any `Key` or `TableName` attributes specified here will override primary key value in `key` or `tableName` arguments.
     * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteItem.html#API_DeleteItem_RequestSyntax
     * @returns {Promise} A promise that resolves to the `Attributes` property of the DynamoDB response. Unless, `ReturnValues` has
     *  been explicitly set, this will match all attributes of the recently deleted element.
     */
    removeFor: createRemoveFor(deleteItem)
  };
}

module.exports = createRemover;
