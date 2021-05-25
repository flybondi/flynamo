'use strict';
/**
 * Edit an existing item's attributes, or add a new item to a table if it does not already exist.
 * You can put or add attribute values.
 * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateItem.html
 * @module UpdateItem
 */
const {
  apply,
  applyTo,
  bind,
  compose,
  curry,
  ifElse,
  is,
  pipeP,
  unless,
  has,
  map,
  fromPairs,
  adjust,
  toPairs,
  zipObj,
  evolve,
  keys,
  flip
} = require('ramda');
const { getUpdateExpression } = require('dynamodb-update-expression');
const { unwrapProp, wrapOver } = require('./wrapper');
const { mapMergeNArgs } = require('./map-merge-args');
const addTableName = require('./table-name');
const addReturnValues = require('./return-values');
const generateKey = require('./generate-key');
const camelCase = require('lodash.camelcase');

/**
 * @private
 */
const updateAndUnwrapAttributes = updateItem => pipeP(apply(updateItem), unwrapProp('Attributes'));

/**
 * @private
 */
const mapKeys = curry((fn, obj) => fromPairs(map(adjust(0, fn), toPairs(obj))));

/**
 * @private
 */
const zipObjWithValues = flip(zipObj);

/**
 * @private
 */
const generateUpdateExpression = unless(
  has('UpdateExpression'),
  // Generate an `UpdateExpression`, `ExpressionAttributeNames` and
  // `ExpressionAttributeValues` objects
  // The `original` argument is assumed to be an empty object so only `SET`
  // expressions are supported by default
  // @see https://github.com/4ossiblellc/dynamodb-update-expression/blob/master/README.md#usage
  compose(wrapOver('ExpressionAttributeValues'), params => {
    return evolve(
      {
        ExpressionAttributeNames: compose(
          // NOTE: DynamoDB doesn't support special charecters in the `UpdateExpression` string and the `dynamodb-update-expression` doesn't handle this cases,
          // in order to support, at least, camel-cases object key is necessary to transform them into camelCase instead.
          zipObjWithValues(Object.keys(params)),
          keys
        )
      },
      getUpdateExpression({}, mapKeys(camelCase, params))
    );
  })
);

/**
 * @private
 */
const runHelper = compose(
  wrapOver('ExpressionAttributeValues'),
  applyTo({
    UpdateExpression: '',
    ExpressionAttributeNames: {},
    ExpressionAttributeValues: {}
  })
);

/**
 * @private
 */
const runHelperOrGenerateUpdateExpression = ifElse(
  is(Function),
  runHelper,
  generateUpdateExpression
);

/**
 * @private
 */
const createUpdate = updateItem =>
  compose(
    updateAndUnwrapAttributes(updateItem),
    mapMergeNArgs(3, [
      // First argument is `id` -> generate `"Key"` from it and extend it with
      // a `"ReturnValues"` attribute valued `'ALL_NEW'`
      compose(addReturnValues('ALL_NEW'), generateKey),
      // Second argument is actual update payload -> generate `"UpdateExpression"` from it
      runHelperOrGenerateUpdateExpression
    ])
  );

const createUpdateFor = curry((updateItem, table) =>
  compose(
    updateAndUnwrapAttributes(updateItem),
    mapMergeNArgs(3, [
      // First argument is `id` -> generate `"Key"` from it and add both `"TableName"`
      // and`"ReturnValues"`
      compose(addReturnValues('ALL_NEW'), addTableName(table), generateKey),
      // Second argument is actual update payload -> generate `"UpdateExpression"` from it
      runHelperOrGenerateUpdateExpression
    ])
  )
);

function createUpdater(dynamoWrapper) {
  const updateItem = bind(dynamoWrapper.updateItem, dynamoWrapper);
  return {
    /**
     * Edits an existing item's attributes, or adds a new item to the table if it does not
     * already exist by its primary key. The primary key name defaults to `id` if not explicitly provided.
     * Returns the `Attributes` value from the DynamoDB response. By default, it sets `ReturnValues` to `ALL_NEW`
     * so it returns all of the attributes of the item, as they appear after the update operation. This function
     * uses the `UpdateItem` operation internally.
     *
     * @function
     * @example
     *
     *  // Updates item with primary key `{id: 42}` in `SomeTable`.
     *  await update(42, { foo: 'bar' }, { TableName: 'SomeTable' });
     *
     * @example
     *
     *  // Updates item with primary key `{ customId: 42}` in `SomeTable`.
     *  await update({ customId: 42 }, { foo: 'bar' }, { TableName: 'SomeTable' });
     *
     * @example
     *
     *  // Updates item and returns the previous attributes
     *  await update(42, { foo: 'bar' }, { TableName: 'SomeTable', ReturnValues: 'ALL_OLD' });
     *
     * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateItem.html#API_UpdateItem_RequestSyntax
     * @param {*} key The primary key value.
     * @param {Object|Function} itemOrBuilder Either an update expression builder function or the partial item that will be merged with the existing item in `AWS.DynamoDB`. An appropriate
     *  `UpdateExpression` will be automatically created from this argument. While you can `null` them or replace them,
     *  removing attributes from an item is only supported through manually defining an `UpdateExpression` using the `request` argument.
     * @param {Object} request Parameters as expected by DynamoDB `UpdateItem` operation. Must include, at least, a `TableName` attribute.
     * @returns {Promise} A promise that resolves to the `Attributes` property of the DynamoDB response.
     */
    update: createUpdate(updateItem),

    /**
     * Returns a function that edits an existing item's attributes, or adds a new item to the table if it does not
     * already exist by its primary key. The primary key name defaults to `id` if not explicitly provided.
     * Returns the `Attributes` value from the DynamoDB response. By default, it sets `ReturnValues` to `ALL_NEW`
     * so it returns all of the attributes of the item, as they appear after the update operation. This function
     * uses the `UpdateItem` operation internally.
     * You would typically use this function through {@link forTable}.
     *
     * @function
     * @example
     *
     *  // Updates item with primary key `{id: 42}` in `SomeTable`.
     *  await updateFor('SomeTable')(42, { foo: 'bar' });
     *
     * @example
     *
     *  // Exported from `forTable`
     *  const { update } = forTable('SomeTable');
     *  await update(42, { foo: 'bar' });
     *
     * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateItem.html#API_UpdateItem_RequestSyntax
     * @param {*} key The primary key value.
     * @param {Object} payload The update payload that will be merged with the item present in DynamoDB. An appropriate
     *  `UpdateExpression` will be automatically created from this argument. While you can `null` them or replace them,
     *  removing attributes from an item is only supported through manually defining an `UpdateExpression` on `request`.
     * @param {Object=} request Parameters as expected by DynamoDB `UpdateItem` operation.
     * @returns {Promise} A promise that resolves to the `Attributes` property of the DynamoDB response.
     */
    updateFor: createUpdateFor(updateItem)
  };
}

module.exports = createUpdater;
