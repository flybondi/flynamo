'use strict';
const createUpdater = require('./update');

describe('the update function', () => {
  test('should call `updateItem` internally', async () => {
    const mockUpdateItem = jest.fn().mockResolvedValue({});
    const { update } = createUpdater({ updateItem: mockUpdateItem });
    await update();
    expect(mockUpdateItem).toHaveBeenCalled();
  });

  test('should generate a wrapped `Key` attribute from the first argument', async () => {
    const mockUpdateItem = jest.fn().mockResolvedValue(true);
    const { update } = createUpdater({ updateItem: mockUpdateItem });
    await update({ id: 5 });
    expect(mockUpdateItem).toHaveBeenCalledWith(
      expect.objectContaining({
        Key: { id: { N: '5' } }
      })
    );
  });

  test('should default to `id` when generating `Key attribute`', async () => {
    const mockUpdateItem = jest.fn().mockResolvedValue(true);
    const { update } = createUpdater({ updateItem: mockUpdateItem });
    await update(5);
    expect(mockUpdateItem).toHaveBeenCalledWith(
      expect.objectContaining({
        Key: { id: { N: '5' } }
      })
    );
  });

  test('should generate SET `UpdateExpression` from second argument', async () => {
    const mockUpdateItem = jest.fn().mockResolvedValue(true);
    const { update } = createUpdater({ updateItem: mockUpdateItem });
    await update(5, { foo: 'bar' });
    expect(mockUpdateItem).toHaveBeenCalledWith(
      expect.objectContaining({
        Key: { id: { N: '5' } },
        ExpressionAttributeNames: { '#foo': 'foo' },
        ExpressionAttributeValues: { ':foo': { S: 'bar' } },
        ReturnValues: 'ALL_NEW',
        UpdateExpression: 'SET #foo = :foo'
      })
    );
  });

  test('should transform kebab-case key name to camelCase for `ExpressionAttributeNames`, `ExpressionAttributeValues` and `UpdateExpression`', async () => {
    const mockUpdateItem = jest.fn().mockResolvedValue(true);
    const { update } = createUpdater({ updateItem: mockUpdateItem });
    await update(5, { 'foo-bar': 'baz', 'bar-foo': 'faz' });
    expect(mockUpdateItem).toHaveBeenCalledWith(
      expect.objectContaining({
        ExpressionAttributeNames: { '#barFoo': 'bar-foo', '#fooBar': 'foo-bar' },
        ExpressionAttributeValues: { ':barFoo': { S: 'faz' }, ':fooBar': { S: 'baz' } },
        Key: { id: { N: '5' } },
        ReturnValues: 'ALL_NEW',
        UpdateExpression: 'SET #fooBar = :fooBar, #barFoo = :barFoo'
      })
    );
  });

  test('should not transform key name to camelCase when value is undefined', async () => {
    const mockUpdateItem = jest.fn().mockResolvedValue(true);
    const { update } = createUpdater({ updateItem: mockUpdateItem });
    await update(5, { 'foo-bar': null, 'bar-foo': undefined });
    expect(mockUpdateItem).toHaveBeenCalledWith(
      expect.objectContaining({
        ExpressionAttributeNames: { '#fooBar': 'foo-bar' },
        ExpressionAttributeValues: { ':fooBar': { NULL: true } },
        Key: { id: { N: '5' } },
        ReturnValues: 'ALL_NEW',
        UpdateExpression: 'SET #fooBar = :fooBar'
      })
    );
  });

  test('should honor existing `UpdateExpression` if provided', async () => {
    const mockUpdateItem = jest.fn().mockResolvedValue(true);
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
    const mockUpdateItem = jest.fn().mockResolvedValue(true);
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
    const mockUpdateItem = jest.fn().mockResolvedValue(true);
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
    const mockUpdateItem = jest.fn().mockResolvedValue(true);
    const { updateFor } = createUpdater({ updateItem: mockUpdateItem });
    await updateFor('some_table')({ id: 5 });
    expect(mockUpdateItem).toHaveBeenCalledWith(
      expect.objectContaining({
        TableName: 'some_table'
      })
    );
  });
});
