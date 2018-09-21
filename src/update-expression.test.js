'use strict';

const { append, updateExpression, put } = require('./update-expression');

describe('the `append` function', () => {
  test('should translate the given paramaters to a dynamo expression with parameters placeholders', () => {
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
  test('should translate the given paramaters to a dynamo expression with parameters placeholders', () => {
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

describe('the `updateExpression` function', () => {
  test('should translate the given action and operations to a dynamo expression', () => {
    const customExpression = updateExpression('SET', () => ({
      UpdateExpression: 'myCustom = :myValue',
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
      UpdateExpression: 'myCustom = :myValue',
      ExpressionAttributeNames: { custom: 'custom' },
      ExpressionAttributeValues: { custom: 'values' }
    });
  });
});
