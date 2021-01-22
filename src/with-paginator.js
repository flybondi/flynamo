'use strict';
const { isNotNilOrEmpty } = require('@flybondi/ramda-land');
const { compose, mergeRight, reduce } = require('ramda');
const { rejectNilOrEmpty } = require('@flybondi/ramda-land');

const DEFAULT_CAPACITY = Object.freeze({
  CapacityUnits: 0,
  ReadCapacityUnits: 0,
  WriteCapacityUnits: 0
});
const mergeWithDefaults = compose(mergeRight(DEFAULT_CAPACITY), rejectNilOrEmpty);

function createCapacities(prev, next) {
  prev = mergeWithDefaults(prev);
  return {
    CapacityUnits: prev.CapacityUnits + next.CapacityUnits,
    ReadCapacityUnits: prev.ReadCapacityUnits + next.ReadCapacityUnits,
    WriteCapacityUnits: prev.WriteCapacityUnits + next.WriteCapacityUnits
  };
}

function aggregateConsumedCapacityForIndexes(prev = {}, next) {
  const result = {};
  for (const key in next) {
    result[key] = createCapacities(prev[key], next[key]);
  }
  return result;
}

function aggregateConsumedCapacity(prev = {}, next) {
  const { Table, LocalSecondaryIndexes, GlobalSecondaryIndexes } = next;
  const capacities = {
    ...createCapacities(prev, next)
  };

  if (isNotNilOrEmpty(Table)) {
    capacities.Table = createCapacities(prev.Table, Table);
  }
  if (isNotNilOrEmpty(LocalSecondaryIndexes)) {
    capacities.LocalSecondaryIndexes = aggregateConsumedCapacityForIndexes(
      prev.LocalSecondaryIndexes,
      LocalSecondaryIndexes
    );
  }
  if (isNotNilOrEmpty(GlobalSecondaryIndexes)) {
    capacities.GlobalSecondaryIndexes = aggregateConsumedCapacityForIndexes(
      prev.GlobalSecondaryIndexes,
      GlobalSecondaryIndexes
    );
  }

  return capacities;
}

function createResponseFrom(responses) {
  return reduce(
    (result, response) => {
      const { Items, Count, ScannedCount, ConsumedCapacity, LastEvaluatedKey } = response;
      if (isNotNilOrEmpty(Items)) {
        result.Items = result.Items || [];
        result.Items.push(...Items);
      }

      if (isNotNilOrEmpty(Count)) {
        result.Count = result.Count || 0;
        result.Count += Count;
      }

      if (isNotNilOrEmpty(ScannedCount)) {
        result.ScannedCount = result.ScannedCount || 0;
        result.ScannedCount += ScannedCount;
      }

      if (isNotNilOrEmpty(LastEvaluatedKey)) {
        // TODO: If the last LastEvaluatedKey from the responses is undefined means that there is no pages
        // left to retrieve. We should not send it back.
        result.LastEvaluatedKey = LastEvaluatedKey;
      }

      if (isNotNilOrEmpty(ConsumedCapacity)) {
        result.ConsumedCapacity = {
          TableName: ConsumedCapacity.TableName,
          ...aggregateConsumedCapacity(result.ConsumedCapacity, ConsumedCapacity)
        };
      }

      return result;
    },
    {},
    responses
  );
}

/**
 *
 * @param {Function} operationFn Any DynamoDB operation method to call.
 * @returns {Function} A helper function that will do the actual request to DynamoDB.
 */
function withPaginator(operationFn) {
  /**
   * Calls the given operation method with the parameters and if the autopagination
   * argument is `true` it will do calls to the operation method until the LastEvaluatedKey value from the
   * method response has a falsy value.
   *
   * @param {Object} input Parameters as expected by DynamoDB operation to use.
   * @returns {Promise} A promise that resolves to the response from DynamoDB.
   */
  return async function autopaginate(input) {
    const responses = [];
    let result = await operationFn(input).promise();
    responses.push(result);

    while (result.LastEvaluatedKey) {
      result = await operationFn({
        ...input,
        ExclusiveStartKey: result.LastEvaluatedKey
      }).promise();
      responses.push(result);
    }

    return createResponseFrom(responses);
  };
}

module.exports = withPaginator;
