'use strict';

const append = require('./append');

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
