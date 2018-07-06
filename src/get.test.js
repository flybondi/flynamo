'use strict';
const createGetter = require('./get');

describe('the get function', () => {
  test('should call `getItem` internally', async () => {
    const mockGetItem = jest.fn().mockResolvedValue(true);
    const { get } = createGetter({ getItem: mockGetItem });
    await get();
    expect(mockGetItem).toHaveBeenCalled();
  });

  test('should generate a wrapped `Key` attribute from the first argument', async () => {
    const mockGetItem = jest.fn().mockResolvedValue(true);
    const { get } = createGetter({ getItem: mockGetItem });
    await get({ id: 5 });
    expect(mockGetItem).toHaveBeenCalledWith({
      Key: { id: { N: '5' } }
    });
  });

  test('should default to `id` when generating `Key attribute`', async () => {
    const mockGetItem = jest.fn().mockResolvedValue(true);
    const { get } = createGetter({ getItem: mockGetItem });
    await get('41ab0092-45bc-4cf7-8d5c-9bd4fcfa37ae');
    expect(mockGetItem).toHaveBeenCalledWith({
      Key: { id: { S: '41ab0092-45bc-4cf7-8d5c-9bd4fcfa37ae' } }
    });
  });

  test('should accept and merge additional request attributes', async () => {
    const mockGetItem = jest.fn().mockResolvedValue(true);
    const { get } = createGetter({ getItem: mockGetItem });
    await get(5, { foo: 'bar' });
    expect(mockGetItem).toHaveBeenCalledWith({
      Key: { id: { N: '5' } },
      foo: 'bar'
    });
  });

  test('should return `undefined` if no item is returned', async () => {
    const mockGetItem = jest.fn().mockResolvedValue({});
    const { get } = createGetter({ getItem: mockGetItem });
    expect(await get()).toBeUndefined();
  });

  test('should return an unwrapped item', async () => {
    const mockGetItem = jest.fn().mockResolvedValue({ Item: { foo: { S: 'bar' } } });
    const { get } = createGetter({ getItem: mockGetItem });
    expect(await get()).toEqual({ foo: 'bar' });
  });
});

describe('the getFor function', () => {
  test('should add `TableName` automatically to any request', async () => {
    const mockGetItem = jest.fn().mockResolvedValue({});
    const { getFor } = createGetter({ getItem: mockGetItem });
    await getFor('some_table')({});
    expect(mockGetItem).toHaveBeenCalledWith(
      expect.objectContaining({
        TableName: 'some_table'
      })
    );
  });
});
