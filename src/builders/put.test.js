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

  test('should accept a `null` value as `attribute` and convert it to a string', () => {
    const operation = put(null, 'myValue');
    expect(
      operation({
        UpdateExpression: '',
        ExpressionAttributeNames: {},
        ExpressionAttributeValues: {}
      })
    ).toEqual({
      UpdateExpression: '#null = :null, ',
      ExpressionAttributeNames: {
        '#null': null
      },
      ExpressionAttributeValues: {
        ':null': 'myValue'
      }
    });
  });

  test('should accept a `null` value as `value`', () => {
    const operation = put('myAttribute', null);
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
        ':myAttribute': null
      }
    });
  });

  test('should accept an `undefined` value as `attribute` and convert it to a string', () => {
    const operation = put(undefined, 'myValue');
    expect(
      operation({
        UpdateExpression: '',
        ExpressionAttributeNames: {},
        ExpressionAttributeValues: {}
      })
    ).toEqual({
      UpdateExpression: '#undefined = :undefined, ',
      ExpressionAttributeNames: {
        '#undefined': undefined
      },
      ExpressionAttributeValues: {
        ':undefined': 'myValue'
      }
    });
  });

  test('should accept an `undefined` value as `value`', () => {
    const operation = put('myAttribute', undefined);
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
        ':myAttribute': undefined
      }
    });
  });

  test('should accept an empty value as `attribute` and convert it to a string', () => {
    const operation = put('', 'myValue');
    expect(
      operation({
        UpdateExpression: '',
        ExpressionAttributeNames: {},
        ExpressionAttributeValues: {}
      })
    ).toEqual({
      UpdateExpression: '# = :, ',
      ExpressionAttributeNames: {
        '#': ''
      },
      ExpressionAttributeValues: {
        ':': 'myValue'
      }
    });
  });

  test('should accept an empty value as `value`', () => {
    const operation = put('myAttribute', '');
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
        ':myAttribute': ''
      }
    });
  });
});
