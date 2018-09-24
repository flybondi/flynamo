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

  test('should accept a `null` value as `attribute` and convert it to a string', () => {
    const operation = append(null, 'myValue');
    expect(
      operation({
        UpdateExpression: '',
        ExpressionAttributeNames: {},
        ExpressionAttributeValues: {}
      })
    ).toEqual({
      UpdateExpression: '#null = list_append(#null, :null), ',
      ExpressionAttributeNames: {
        '#null': null
      },
      ExpressionAttributeValues: {
        ':null': 'myValue'
      }
    });
  });

  test('should accept a `null` value as `value`', () => {
    const operation = append('myAttribute', null);
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
        ':myAttribute': null
      }
    });
  });

  test('should accept an `undefined` value as `attribute` and convert it to a string', () => {
    const operation = append(undefined, 'myValue');
    expect(
      operation({
        UpdateExpression: '',
        ExpressionAttributeNames: {},
        ExpressionAttributeValues: {}
      })
    ).toEqual({
      UpdateExpression: '#undefined = list_append(#undefined, :undefined), ',
      ExpressionAttributeNames: {
        '#undefined': undefined
      },
      ExpressionAttributeValues: {
        ':undefined': 'myValue'
      }
    });
  });

  test('should accept an `undefined` value as `value`', () => {
    const operation = append('myAttribute', undefined);
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
        ':myAttribute': undefined
      }
    });
  });

  test('should accept an empty value as `attribute` and convert it to a string', () => {
    const operation = append('', 'myValue');
    expect(
      operation({
        UpdateExpression: '',
        ExpressionAttributeNames: {},
        ExpressionAttributeValues: {}
      })
    ).toEqual({
      UpdateExpression: '# = list_append(#, :), ',
      ExpressionAttributeNames: {
        '#': ''
      },
      ExpressionAttributeValues: {
        ':': 'myValue'
      }
    });
  });

  test('should accept an empty value as `value`', () => {
    const operation = append('myAttribute', '');
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
        ':myAttribute': ''
      }
    });
  });
});
