'use strict';
/**
 * The `GetItem` operation returns a set of attributes for the item with the given primary key.
 * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html
 * @module GetItem
 */
const { curry, bind, compose, apply } = require('ramda');
const { unwrapProp } = require('./wrapper');
const { mapMergeFirstPairOfArgs } = require('./map-merge-args');
const { andThen } = require('./and-then');
const generateKey = require('./generate-key');
const addTableName = require('./table-name');

/**
 * @private
 */
const getUnwrappedItem = getItem => compose(andThen(unwrapProp('Item')), apply(getItem));

/**
 * @private
 */
const createGet = getItem =>
  compose(getUnwrappedItem(getItem), mapMergeFirstPairOfArgs(generateKey));

/**
 * @private
 */
const createGetFor = curry((getItem, table) =>
  compose(
    getUnwrappedItem(getItem),
    mapMergeFirstPairOfArgs(compose(addTableName(table), generateKey))
  )
);

function createGetter(dynamodb) {
  const getItem = bind(dynamodb.getItem, dynamodb);
  return {
    /**
     * Returns a set of attributes for the item with the given primary key.
     * If there is no matching item, it returns `undefined`. The name of the `key` defaults
     * to `id` if it's not specified. The `Key` attribute (as expected by DynamoDB request)
     * can be omitted.
     *
     * @function
     * @example
     *
     *  await get(42, { TableName: 'SomeTable' });
     *  // Will return the item with an primary key of `{id: 42}` from `SomeTable`
     *
     * @example
     *
     *  await get({ customId: 'foo' }, { TableName: 'SomeTable' });
     *  // Will return the item with an primary key of `{customId: 'foo'}` from `SomeTable`
     *
     * @example
     *
     *  await get({ Key: { id: 42 } }, { TableName: 'SomeTable' });
     *  // Will return the item with an primary key of `{id: 42}` from `SomeTable`
     *
     * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html#API_GetItem_RequestSyntax
     * @param {*} key The primary key value.
     * @param {Object} request Parameters as expected by DynamoDB `GetItem` operation. Any `Key` attribute
     *  specified here will override primary key value in `key`.
     * @returns {Promise} A promise that resolves to the item returned by DynamoDB response or `undefined` if it
     *  does not exist.
     */
    get: createGet(getItem),

    /**
     * Returns a function that returns a set of attributes for the item with the given primary key.
     * If there is no matching item, it returns `undefined`. The name of the `key` defaults
     * to `id` if it's not specified. The `Key` attribute (as expected by DynamoDB request)
     * can be omitted. The last `request` argument is optional and is only required if any non
     * mandatory attribute needs to be included in the request.
     * You would typically use this function through {@link forTable}.
     *
     * @function
     * @example
     *
     *  await getFor('TableName')(42);
     *  // Will return the item with an primary key of `{id: 42}` from `SomeTable`
     *
     * @example
     *
     *  await getFor('SomeTable')({ customId: 'foo' });
     *  // Will return the item with an primary key of `{customId: 'foo'}` from `SomeTable`
     *
     * @example
     *
     *  await getFor('SomeTable')({ Key: { id: 42 } });
     *  // Will return the item with an primary key of `{id: 42}` from `SomeTable`
     *
     * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html#API_GetItem_RequestSyntax
     * @param {String} tableName The name of the table to perform the operation on
     * @param {*} key The primary key value.
     * @param {Object=} request Parameters as expected by DynamoDB `GetItem` operation (optional).
     *  Any `Key` or `TableName` attributes specified here will override primary key value in `key` or `tableName` arguments.
     * @returns {Promise} A promise that resolves to the item returned by DynamoDB response or `undefined` if it
     *  does not exist.
     */
    getFor: createGetFor(getItem)
  };
}

module.exports = createGetter;
