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

  test('should accept a `null` value as action and convert it to a string', () => {
    const emptyExpression = updateExpression(null, ({ UpdateExpression }) => ({
      UpdateExpression: `${UpdateExpression} #myCustomOp = :myCustomOp, `,
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
      UpdateExpression: ' null  #myCustomOp = :myCustomOp',
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {}
    });
  });

  test('should accept an `undefined` value as action and convert it to a string', () => {
    const emptyExpression = updateExpression(undefined, ({ UpdateExpression }) => ({
      UpdateExpression: `${UpdateExpression} #myCustomOp = :myCustomOp, `,
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
      UpdateExpression: ' undefined  #myCustomOp = :myCustomOp',
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {}
    });
  });

  test('should accept an empty value as action and convert it to a string', () => {
    const emptyExpression = updateExpression('', ({ UpdateExpression }) => ({
      UpdateExpression: `${UpdateExpression} #myCustomOp = :myCustomOp, `,
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
      UpdateExpression: '   #myCustomOp = :myCustomOp',
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {}
    });
  });
});
