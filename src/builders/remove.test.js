'use strict';

const remove = require('./remove');

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

  test('should accept a `null` value as `attribute` and convert it to a string', () => {
    const operation = remove(null);
    expect(
      operation({
        UpdateExpression: '',
        ExpressionAttributeNames: {},
        ExpressionAttributeValues: {}
      })
    ).toEqual({
      UpdateExpression: '#null, ',
      ExpressionAttributeNames: {
        '#null': null
      },
      ExpressionAttributeValues: {}
    });
  });

  test('should accept an `undefined` value as `attribute` and convert it to a string', () => {
    const operation = remove(undefined);
    expect(
      operation({
        UpdateExpression: '',
        ExpressionAttributeNames: {},
        ExpressionAttributeValues: {}
      })
    ).toEqual({
      UpdateExpression: '#undefined, ',
      ExpressionAttributeNames: {
        '#undefined': undefined
      },
      ExpressionAttributeValues: {}
    });
  });

  test('should accept an empty value as `attribute` and convert it to a string', () => {
    const operation = remove('');
    expect(
      operation({
        UpdateExpression: '',
        ExpressionAttributeNames: {},
        ExpressionAttributeValues: {}
      })
    ).toEqual({
      UpdateExpression: '#, ',
      ExpressionAttributeNames: {
        '#': ''
      },
      ExpressionAttributeValues: {}
    });
  });
});
