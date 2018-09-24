'use strict';

const { append, updateExpression, put, remove } = require('./update-expression');

describe('the `append` function', () => {
  test('should generate the update expression to append a list', () => {
    const operation = append('myAttribute', 'myValue');
    expect(
      operation({
        UpdateExpression: '',
        ExpressionAttributeNames: {},
        ExpressionAttributeValues: {}
      })
    ).toEqual({
      UpdateExpression: '#myAttribute = list_append(#myAttribute, :myAttribute), ',
      ExpressionAttributeNames: {
        '#myAttribute': 'myAttribute'
      },
      ExpressionAttributeValues: {
        ':myAttribute': 'myValue'
      }
    });
  });
});

describe('the `put` function', () => {
  test('should generate the update expression to update a value', () => {
    const operation = put('myAttribute', 'myValue');
    expect(
      operation({
        UpdateExpression: '',
        ExpressionAttributeNames: {},
        ExpressionAttributeValues: {}
      })
    ).toEqual({
      UpdateExpression: '#myAttribute = :myAttribute, ',
      ExpressionAttributeNames: {
        '#myAttribute': 'myAttribute'
      },
      ExpressionAttributeValues: {
        ':myAttribute': 'myValue'
      }
    });
  });
});

describe('the `remove` function', () => {
  test('should return an expression to remove the attribute', () => {
    const operation = remove('myAttribute');
    expect(
      operation({
        UpdateExpression: '',
        ExpressionAttributeNames: {},
        ExpressionAttributeValues: {}
      })
    ).toEqual({
      UpdateExpression: '#myAttribute, ',
      ExpressionAttributeNames: {
        '#myAttribute': 'myAttribute'
      },
      ExpressionAttributeValues: {}
    });
  });
});

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
