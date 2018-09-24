'use strict';

const updateExpression = require('./update-expression');

describe('the `updateExpression` function', () => {
  test('should generate a full dynamo expression for the given operation', () => {
    const customExpression = updateExpression('SET', ({ UpdateExpression }) => ({
      UpdateExpression: `${UpdateExpression}myCustom = :myValue, `,
      ExpressionAttributeNames: { custom: 'custom' },
      ExpressionAttributeValues: { custom: 'values' }
    }));

    expect(
      customExpression({
        UpdateExpression: '',
        ExpressionAttributeNames: {},
        ExpressionAttributeValues: {}
      })
    ).toEqual({
      UpdateExpression: ' SET myCustom = :myValue',
      ExpressionAttributeNames: { custom: 'custom' },
      ExpressionAttributeValues: { custom: 'values' }
    });
  });

  test('should omit the expression generation when the operations return empty expressions', () => {
    const emptyExpression = updateExpression('SET', ({ UpdateExpression }) => ({
      UpdateExpression: `${UpdateExpression}`,
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {}
    }));

    expect(
      emptyExpression({
        UpdateExpression: '',
        ExpressionAttributeNames: {},
        ExpressionAttributeValues: {}
      })
    ).toEqual({
      UpdateExpression: '',
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {}
    });
  });
});
