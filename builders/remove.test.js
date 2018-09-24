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
});
