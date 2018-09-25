'use strict';
/**
 * A DynamoDB expression builder that simplifies generating update items requests
 * by composing small functions. Functions from this module can be imported from the
 * `@flybondi/flynamo/builders` namespace. You can feed the result of `updateExpression`
 * to the `payload` argument of [update]{@link module:UpdateItem~update} or [updateFor]{@link module:UpdateItem~updateFor}.
 *
 * @example
 *  const { updateExpression, put } = require('@flybondi/flynamo/builders');
 *
 *  const expression = updateExpression('SET',
 *    compose(
 *      put('availableSeats', 42),
 *      put('pnr', '2LWJRW'),
 *    )
 *  );
 *
 *  await update(42, expression, { TableName: 'SomeTable' });
 *
 * @see https://flybondi.github.io/flynamo/
 * @module Builders
 */

const updateExpression = require('./update-expression');
const put = require('./put');
const append = require('./append');
const remove = require('./remove');

module.exports = {
  updateExpression,
  put,
  append,
  remove
};
