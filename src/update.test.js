'use strict';
const createUpdater = require('./update');

describe('the update function', () => {
  test('should call `updateItem` internally', async () => {
    const mockRequest = { promise: jest.fn().mockResolvedValue({}) };
    const mockUpdateItem = jest.fn().mockReturnValue(mockRequest);
    const { update } = createUpdater({ updateItem: mockUpdateItem });
    await update();
    expect(mockUpdateItem).toHaveBeenCalled();
  });

  test('should generate a wrapped `Key` attribute from the first argument', async () => {
    const mockRequest = { promise: jest.fn().mockResolvedValue(true) };
    const mockUpdateItem = jest.fn().mockReturnValue(mockRequest);
    const { update } = createUpdater({ updateItem: mockUpdateItem });
    await update({ id: 5 });
    expect(mockUpdateItem).toHaveBeenCalledWith(
      expect.objectContaining({
        Key: { id: { N: '5' } }
      })
    );
  });

  test('should default to `id` when generating `Key attribute`', async () => {
    const mockRequest = { promise: jest.fn().mockResolvedValue(true) };
    const mockUpdateItem = jest.fn().mockReturnValue(mockRequest);
    const { update } = createUpdater({ updateItem: mockUpdateItem });
    await update(5);
    expect(mockUpdateItem).toHaveBeenCalledWith(
      expect.objectContaining({
        Key: { id: { N: '5' } }
      })
    );
  });

  test('should generate SET `UpdateExpression` from second argument', async () => {
    const mockRequest = { promise: jest.fn().mockResolvedValue(true) };
    const mockUpdateItem = jest.fn().mockReturnValue(mockRequest);
    const { update } = createUpdater({ updateItem: mockUpdateItem });
    await update(5, { foo: 'bar' });
    expect(mockUpdateItem).toHaveBeenCalledWith(
      expect.objectContaining({
        Key: { id: { N: '5' } },
        UpdateExpression: 'SET #foo = :foo',
        ExpressionAttributeNames: { '#foo': 'foo' },
        ExpressionAttributeValues: { ':foo': { S: 'bar' } }
      })
    );
  });

  test('should honor existing `UpdateExpression` if provided', async () => {
    const mockRequest = { promise: jest.fn().mockResolvedValue(true) };
    const mockUpdateItem = jest.fn().mockReturnValue(mockRequest);
    const { update } = createUpdater({ updateItem: mockUpdateItem });
    await update(5, {
      UpdateExpression: 'SET #bar = :bar'
    });
    expect(mockUpdateItem).toHaveBeenCalledWith(
      expect.objectContaining({
        Key: { id: { N: '5' } },
        UpdateExpression: 'SET #bar = :bar'
      })
    );
  });

  test('should run the helper to generate `UpdateExpression` if the second argument is a function', async () => {
    const mockRequest = { promise: jest.fn().mockResolvedValue(true) };
    const mockUpdateItem = jest.fn().mockReturnValue(mockRequest);
    const { update } = createUpdater({ updateItem: mockUpdateItem });
    const expressionBuilder = () => ({
      UpdateExpression: 'SET #bar = :bar'
    });
    await update(5, expressionBuilder);
    expect(mockUpdateItem).toHaveBeenCalledWith(
      expect.objectContaining({
        Key: { id: { N: '5' } },
        UpdateExpression: 'SET #bar = :bar'
      })
    );
  });

  test('should merge the first three arguments and pass the rest as is', async () => {
    const mockRequest = { promise: jest.fn().mockResolvedValue(true) };
    const mockUpdateItem = jest.fn().mockReturnValue(mockRequest);
    const { update } = createUpdater({ updateItem: mockUpdateItem });
    await update(5, {}, { bar: 'baz' }, { meh: 42 });
    expect(mockUpdateItem).toHaveBeenCalledWith(
      {
        Key: { id: { N: '5' } },
        UpdateExpression: '',
        ReturnValues: 'ALL_NEW',
        ExpressionAttributeValues: {},
        bar: 'baz'
      },
      { meh: 42 }
    );
  });
});

describe('the updateFor function', () => {
  test('should add `TableName` automatically to any request', async () => {
    const mockRequest = { promise: jest.fn().mockResolvedValue(true) };
    const mockUpdateItem = jest.fn().mockReturnValue(mockRequest);
    const { updateFor } = createUpdater({ updateItem: mockUpdateItem });
    await updateFor('some_table')({ id: 5 });
    expect(mockUpdateItem).toHaveBeenCalledWith(
      expect.objectContaining({
        TableName: 'some_table'
      })
    );
  });
});
