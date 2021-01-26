'use strict';
const createWriteBatcher = require('./batch-write-item');

describe('the `batchWriteFor` function', () => {
  test('should generate valid `RequestItems` with mixed `PutRequest` and `DeleteRequest` from given input', async () => {
    const mockRequest = { promise: jest.fn().mockResolvedValue({}) };
    const mockBatchWriteItem = jest.fn().mockReturnValue(mockRequest);
    const { batchWriteFor } = createWriteBatcher({ batchWriteItem: mockBatchWriteItem });
    const batchWrite = batchWriteFor('some_table');
    await batchWrite({
      insert: [{ foo: 'bar' }],
      remove: [1, 2]
    });
    expect(mockBatchWriteItem).toHaveBeenCalledWith({
      RequestItems: {
        some_table: [
          { PutRequest: { Item: { foo: { S: 'bar' } } } },
          { DeleteRequest: { Key: { id: { N: '1' } } } },
          { DeleteRequest: { Key: { id: { N: '2' } } } }
        ]
      }
    });
  });
});

describe('the `batchRemoveFor` function', () => {
  test('should generate valid `RequestItems` with `DeleteRequest` exclusively from given input', async () => {
    const mockRequest = { promise: jest.fn().mockResolvedValue({}) };
    const mockBatchWriteItem = jest.fn().mockReturnValue(mockRequest);
    const { batchRemoveFor } = createWriteBatcher({ batchWriteItem: mockBatchWriteItem });
    const batchRemove = batchRemoveFor('some_table');
    await batchRemove([1, 2]);
    expect(mockBatchWriteItem).toHaveBeenCalledWith({
      RequestItems: {
        some_table: [
          { DeleteRequest: { Key: { id: { N: '1' } } } },
          { DeleteRequest: { Key: { id: { N: '2' } } } }
        ]
      }
    });
  });

  test('should support removing using composite keys as input', async () => {
    const mockRequest = { promise: jest.fn().mockResolvedValue({}) };
    const mockBatchWriteItem = jest.fn().mockReturnValue(mockRequest);
    const { batchRemoveFor } = createWriteBatcher({ batchWriteItem: mockBatchWriteItem });
    const batchRemove = batchRemoveFor('some_table');
    await batchRemove([
      { foo: 'life', bar: 42 },
      { foo: 'meh', bar: 33 }
    ]);
    expect(mockBatchWriteItem).toHaveBeenCalledWith({
      RequestItems: {
        some_table: [
          { DeleteRequest: { Key: { foo: { S: 'life' }, bar: { N: '42' } } } },
          { DeleteRequest: { Key: { foo: { S: 'meh' }, bar: { N: '33' } } } }
        ]
      }
    });
  });
});
