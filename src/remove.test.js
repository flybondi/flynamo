'use strict';
const createRemover = require('./remove');

describe('the remove function', () => {
  test('should call `deleteItem` internally', async () => {
    const mockDeleteItem = jest.fn().mockResolvedValue(true);
    const { remove } = createRemover({ deleteItem: mockDeleteItem });
    await remove();
    expect(mockDeleteItem).toHaveBeenCalled();
  });

  test('should generate a wrapped `Key` attribute from the first argument', async () => {
    const mockDeleteItem = jest.fn().mockResolvedValue(true);
    const { remove } = createRemover({ deleteItem: mockDeleteItem });
    await remove({ id: 5 });
    expect(mockDeleteItem).toHaveBeenCalledWith(
      expect.objectContaining({
        Key: { id: { N: '5' } }
      })
    );
  });

  test('should default to `id` when generating `Key` attribute', async () => {
    const mockDeleteItem = jest.fn().mockResolvedValue(true);
    const { remove } = createRemover({ deleteItem: mockDeleteItem });
    await remove('41ab0092-45bc-4cf7-8d5c-9bd4fcfa37ae');
    expect(mockDeleteItem).toHaveBeenCalledWith(
      expect.objectContaining({
        Key: { id: { S: '41ab0092-45bc-4cf7-8d5c-9bd4fcfa37ae' } }
      })
    );
  });

  test('should make `ReturnValues` default to `ALL_OLD` when generating request', async () => {
    const mockDeleteItem = jest.fn().mockResolvedValue(true);
    const { remove } = createRemover({ deleteItem: mockDeleteItem });
    await remove('41ab0092-45bc-4cf7-8d5c-9bd4fcfa37ae');
    expect(mockDeleteItem).toHaveBeenCalledWith(
      expect.objectContaining({
        ReturnValues: 'ALL_OLD'
      })
    );
  });
});

describe('the removeFor function', () => {
  test('should add `TableName` automatically to any request', async () => {
    const mockDeleteItem = jest.fn().mockResolvedValue(true);
    const { removeFor } = createRemover({ deleteItem: mockDeleteItem });
    await removeFor('some_table')({ id: 5 });
    expect(mockDeleteItem).toHaveBeenCalledWith(
      expect.objectContaining({
        TableName: 'some_table'
      })
    );
  });
});
