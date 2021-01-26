'use strict';

const withPaginator = require('./with-paginator');

describe('the `withPaginator` function', () => {
  test('should return a function', () => {
    expect(withPaginator()).toBeInstanceOf(Function);
  });

  test('should call given fn only once with the given parameters', async () => {
    const mockRequest = {
      promise: jest.fn().mockResolvedValue({
        Items: [{ id: { S: 'foo' } }, { id: { S: 'bar' } }]
      })
    };
    const mockFn = jest.fn().mockReturnValue(mockRequest);
    const result = await withPaginator(mockFn)({ TableName: 'foo' });

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenLastCalledWith({ TableName: 'foo' });
    expect(result).toEqual({
      Items: [{ id: { S: 'foo' } }, { id: { S: 'bar' } }]
    });
  });

  test('should call given fn multiple times with the given parameters', async () => {
    const mockRequest = {
      promise: jest
        .fn()
        .mockResolvedValueOnce({
          Items: [{ id: { S: 'foo' } }],
          LastEvaluatedKey: { id: { S: 'foo' } },
          Count: 1,
          ScannedCount: 1
        })
        .mockResolvedValueOnce({ Items: [{ id: { S: 'bar' } }], Count: 1, ScannedCount: 1 })
    };
    const mockFn = jest.fn().mockReturnValue(mockRequest);

    const result = await withPaginator(mockFn)({ TableName: 'foo' });

    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenNthCalledWith(1, { TableName: 'foo' });
    expect(mockFn).toHaveBeenNthCalledWith(2, {
      TableName: 'foo',
      ExclusiveStartKey: { id: { S: 'foo' } }
    });
    expect(result).toHaveProperty('Items', [{ id: { S: 'foo' } }, { id: { S: 'bar' } }]);
    expect(result).toHaveProperty('Count', 2);
    expect(result).toHaveProperty('ScannedCount', 2);
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

    const result = await withPaginator(mockFn)({ TableName: 'foo' });

    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenNthCalledWith(1, { TableName: 'foo' });
    expect(mockFn).toHaveBeenNthCalledWith(2, {
      TableName: 'foo',
      ExclusiveStartKey: { id: { S: 'foo' } }
    });
    expect(result).toHaveProperty('Items', [{ id: { S: 'foo' } }]);
  });

  test('should aggregate the consumed capacities from multiple responses', async () => {
    const mockRequest = {
      promise: jest
        .fn()
        .mockResolvedValueOnce({
          Items: [{ id: { S: 'foo' } }],
          LastEvaluatedKey: { id: { S: 'foo' } },
          Count: 1,
          ScannedCount: 1,
          ConsumedCapacity: {
            CapacityUnits: 1,
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
            TableName: 'foo',
            Table: {
              CapacityUnits: 1,
              ReadCapacityUnits: 1,
              WriteCapacityUnits: 1
            }
          }
        })
        .mockResolvedValueOnce({
          Items: [{ id: { S: 'bar' } }],
          Count: 1,
          ScannedCount: 1,
          ConsumedCapacity: {
            CapacityUnits: 1,
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
            TableName: 'foo',
            Table: {
              CapacityUnits: 1,
              ReadCapacityUnits: 1,
              WriteCapacityUnits: 1
            }
          }
        })
    };
    const mockFn = jest.fn().mockReturnValue(mockRequest);

    const result = await withPaginator(mockFn)({ TableName: 'foo' });

    expect(result).toHaveProperty('ConsumedCapacity', {
      CapacityUnits: 2,
      ReadCapacityUnits: 2,
      Table: { CapacityUnits: 2, ReadCapacityUnits: 2, WriteCapacityUnits: 2 },
      TableName: 'foo',
      WriteCapacityUnits: 2
    });
  });

  test('should aggregate the consumed capacities from multiple responses on Local indexes', async () => {
    const mockRequest = {
      promise: jest
        .fn()
        .mockResolvedValueOnce({
          Items: [{ id: { S: 'foo' } }],
          LastEvaluatedKey: { id: { S: 'foo' } },
          Count: 1,
          ScannedCount: 1,
          ConsumedCapacity: {
            CapacityUnits: 1,
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
            TableName: 'foo',
            Table: {
              CapacityUnits: 1,
              ReadCapacityUnits: 1,
              WriteCapacityUnits: 1
            },
            LocalSecondaryIndexes: {
              'foo-local-index': {
                CapacityUnits: 1,
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1
              },
              'bar-local-index': {
                CapacityUnits: 1,
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1
              }
            }
          }
        })
        .mockResolvedValueOnce({
          Items: [{ id: { S: 'bar' } }],
          Count: 1,
          ScannedCount: 1,
          ConsumedCapacity: {
            CapacityUnits: 1,
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
            TableName: 'foo',
            Table: {
              CapacityUnits: 1,
              ReadCapacityUnits: 1,
              WriteCapacityUnits: 1
            },
            LocalSecondaryIndexes: {
              'foo-local-index': {
                CapacityUnits: 1,
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1
              },
              'bar-local-index': {
                CapacityUnits: 1,
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1
              }
            }
          }
        })
    };
    const mockFn = jest.fn().mockReturnValue(mockRequest);

    const result = await withPaginator(mockFn)({ TableName: 'foo' });

    expect(result).toHaveProperty('ConsumedCapacity.LocalSecondaryIndexes', {
      'bar-local-index': {
        CapacityUnits: 2,
        ReadCapacityUnits: 2,
        WriteCapacityUnits: 2
      },
      'foo-local-index': {
        CapacityUnits: 2,
        ReadCapacityUnits: 2,
        WriteCapacityUnits: 2
      }
    });
  });

  test('should aggregate the consumed capacities from multiple responses on Global indexes', async () => {
    const mockRequest = {
      promise: jest
        .fn()
        .mockResolvedValueOnce({
          Items: [{ id: { S: 'foo' } }],
          LastEvaluatedKey: { id: { S: 'foo' } },
          Count: 1,
          ScannedCount: 1,
          ConsumedCapacity: {
            CapacityUnits: 1,
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
            TableName: 'foo',
            Table: {
              CapacityUnits: 1,
              ReadCapacityUnits: 1,
              WriteCapacityUnits: 1
            },
            GlobalSecondaryIndexes: {
              'foo-local-index': {
                CapacityUnits: 1,
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1
              },
              'bar-local-index': {
                CapacityUnits: 1,
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1
              }
            }
          }
        })
        .mockResolvedValueOnce({
          Items: [{ id: { S: 'bar' } }],
          Count: 1,
          ScannedCount: 1,
          ConsumedCapacity: {
            CapacityUnits: 1,
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
            TableName: 'foo',
            Table: {
              CapacityUnits: 1,
              ReadCapacityUnits: 1,
              WriteCapacityUnits: 1
            },
            GlobalSecondaryIndexes: {
              'foo-local-index': {
                CapacityUnits: 1,
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1
              },
              'bar-local-index': {
                CapacityUnits: 1,
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1
              }
            }
          }
        })
    };
    const mockFn = jest.fn().mockReturnValue(mockRequest);

    const result = await withPaginator(mockFn)({ TableName: 'foo' });

    expect(result).toHaveProperty('ConsumedCapacity.GlobalSecondaryIndexes', {
      'bar-local-index': {
        CapacityUnits: 2,
        ReadCapacityUnits: 2,
        WriteCapacityUnits: 2
      },
      'foo-local-index': {
        CapacityUnits: 2,
        ReadCapacityUnits: 2,
        WriteCapacityUnits: 2
      }
    });
  });
});
