'use strict';

const withPaginatorHelper = require('./with-paginator-helper');

describe('the `withPaginatorHelper` function', () => {
  test('should call given fn only once with the given parameters', async () => {
    const mockRequest = {
      promise: jest.fn().mockResolvedValue({
        Items: [{ id: { S: 'foo' } }, { id: { S: 'bar' } }],
        LastEvaluatedKey: { id: { S: 'bar' } }
      })
    };
    const mockFn = jest.fn().mockReturnValue(mockRequest);
    const result = await withPaginatorHelper(mockFn, { TableName: 'foo' });

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenLastCalledWith({ TableName: 'foo' });
    expect(result).toEqual({
      Items: [{ id: { S: 'foo' } }, { id: { S: 'bar' } }],
      LastEvaluatedKey: { id: { S: 'bar' } }
    });
  });

  test('should call given fn multiple times with the given parameters', async () => {
    const mockRequest = {
      promise: jest
        .fn()
        .mockResolvedValueOnce({
          Items: [{ id: { S: 'foo' } }],
          LastEvaluatedKey: { id: { S: 'foo' } }
        })
        .mockResolvedValueOnce({ Items: [{ id: { S: 'bar' } }] })
    };
    const mockFn = jest.fn().mockReturnValue(mockRequest);

    const result = await withPaginatorHelper(mockFn, { TableName: 'foo' }, true);

    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenNthCalledWith(1, { TableName: 'foo' });
    expect(mockFn).toHaveBeenNthCalledWith(2, {
      TableName: 'foo',
      ExclusiveStartKey: { id: { S: 'foo' } }
    });
    expect(result).toHaveProperty('Items', [{ id: { S: 'foo' } }, { id: { S: 'bar' } }]);
  });

  test('should return a single object with all the responses Items', async () => {
    const mockRequest = {
      promise: jest
        .fn()
        .mockResolvedValueOnce({
          Items: [{ id: { S: 'foo' } }],
          LastEvaluatedKey: { id: { S: 'foo' } }
        })
        .mockResolvedValueOnce({ Items: [] })
    };
    const mockFn = jest.fn().mockReturnValue(mockRequest);

    const result = await withPaginatorHelper(mockFn, { TableName: 'foo' }, true);

    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenNthCalledWith(1, { TableName: 'foo' });
    expect(mockFn).toHaveBeenNthCalledWith(2, {
      TableName: 'foo',
      ExclusiveStartKey: { id: { S: 'foo' } }
    });
    expect(result).toHaveProperty('Items', [{ id: { S: 'foo' } }]);
  });
});
