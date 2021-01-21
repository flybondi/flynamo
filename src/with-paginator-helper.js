'use strict';

/**
 * Calls the given operation method with the parameters and if the autopagination
 * argument is `true` it will do calls to the operation method until the LastEvaluatedKey value from the
 * method response has a falsy value.
 *
 * @param {Function} methodFn Any DynamoDB operation method to call.
 * @param {Object} params Parameters as expected by DynamoDB operation to use.
 * @param {boolean} autopagination Whether to return all the records from DynamoDB or just the first batch of records.
 * @returns {Promise} A promise that resolves to the response from DynamoDB.
 */
async function withPaginatorHelper(methodFn, params, autopagination) {
  const items = [];
  let result = await methodFn(params).promise();
  result.Items && result.Items.length >= 0 && items.push(...result.Items);

  if (autopagination) {
    while (result.LastEvaluatedKey) {
      result = await methodFn({ ...params, ExclusiveStartKey: result.LastEvaluatedKey }).promise();
      result.Items && result.Items.length >= 0 && items.push(...result.Items);
    }
  }

  result.Items = items;

  return result;
}

module.exports = withPaginatorHelper;
