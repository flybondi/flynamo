'use strict';

const put = require('./put');

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
