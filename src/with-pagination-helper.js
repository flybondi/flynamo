'use strict';

async function withPaginationHelper(method, params, pagination) {
  const items = [];
  let result = await method(params).promise();
  items.push(...result.Items);

  if (pagination) {
    while (result.LastEvaluatedKey) {
      result = await method({ ...params, ExclusiveStartKey: result.LastEvaluatedKey }).promise();
      items.push(...result.Items);
    }
  }

  result.Items = items;

  return result;
}

module.exports = withPaginationHelper;
