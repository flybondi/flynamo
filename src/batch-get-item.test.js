'use strict';
const createGetBatcher = require('./batch-get-item');

test('should generate valid `RequestItems` with generated keys', async () => {
  const mockRequest = { promise: jest.fn().mockResolvedValue({}) };
  const mockBatchGetItem = jest.fn().mockReturnValue(mockRequest);
  const { batchGetFor } = createGetBatcher({ batchGetItem: mockBatchGetItem });
  const batchGet = batchGetFor('some_table');
  await batchGet([42, 33]);
  expect(mockBatchGetItem).toHaveBeenCalledWith({
    RequestItems: {
      some_table: {
        Keys: [{ id: { N: '42' } }, { id: { N: '33' } }]
      }
    }
  });
});

test('should support sending a single key as its first argument', async () => {
  const mockRequest = { promise: jest.fn().mockResolvedValue({}) };
  const mockBatchGetItem = jest.fn().mockReturnValue(mockRequest);
  const { batchGetFor } = createGetBatcher({ batchGetItem: mockBatchGetItem });
  const batchGet = batchGetFor('some_table');
  await batchGet(42);
  expect(mockBatchGetItem).toHaveBeenCalledWith({
    RequestItems: {
      some_table: {
        Keys: [{ id: { N: '42' } }]
      }
    }
  });
});

test('should support retrieving documents with composite keys', async () => {
  const mockRequest = { promise: jest.fn().mockResolvedValue({}) };
  const mockBatchGetItem = jest.fn().mockReturnValue(mockRequest);
  const { batchGetFor } = createGetBatcher({ batchGetItem: mockBatchGetItem });
  const batchGet = batchGetFor('some_table');
  await batchGet([
    { foo: 'life', bar: 42 },
    { foo: 'meh', bar: 33 }
  ]);
  expect(mockBatchGetItem).toHaveBeenCalledWith({
    RequestItems: {
      some_table: {
        Keys: [
          { foo: { S: 'life' }, bar: { N: '42' } },
          { foo: { S: 'meh' }, bar: { N: '33' } }
        ]
      }
    }
  });
});

test('should allow sending additional request properties as its sencond argument', async () => {
  const mockRequest = { promise: jest.fn().mockResolvedValue({}) };
  const mockBatchGetItem = jest.fn().mockReturnValue(mockRequest);
  const { batchGetFor } = createGetBatcher({ batchGetItem: mockBatchGetItem });
  const batchGet = batchGetFor('some_table');
  await batchGet([42, 33], { ProjectionExpression: 'name, messages, views', ConsistentRead: true });
  expect(mockBatchGetItem).toHaveBeenCalledWith({
    RequestItems: {
      some_table: {
        Keys: [{ id: { N: '42' } }, { id: { N: '33' } }],
        ProjectionExpression: 'name, messages, views',
        ConsistentRead: true
      }
    }
  });
});
test('should forward any additional arguments to the original `batchGetItem` function', async () => {
  const mockRequest = { promise: jest.fn().mockResolvedValue({}) };
  const mockBatchGetItem = jest.fn().mockReturnValue(mockRequest);
  const { batchGetFor } = createGetBatcher({ batchGetItem: mockBatchGetItem });
  const batchGet = batchGetFor('some_table');
  await batchGet([42, 33], { ProjectionExpression: 'name' }, { extra: true }, 42);
  expect(mockBatchGetItem).toHaveBeenCalledWith(expect.anything(), { extra: true }, 42);
});
