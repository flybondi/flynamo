'use strict';
const createQuerier = require('./query');

describe('the query function', () => {
  test('should call `query` internally', async () => {
    const mockQuery = jest.fn().mockResolvedValue({});
    const { query } = createQuerier({ query: mockQuery });
    await query();
    expect(mockQuery).toHaveBeenCalled();
  });

  test('should return `undefined` if no items are returned', async () => {
    const mockQuery = jest.fn().mockResolvedValue({});
    const { query } = createQuerier({ query: mockQuery });
    expect(await query()).toBeUndefined();
  });

  test('should return unwrapped items', async () => {
    const mockQuery = jest.fn().mockResolvedValue({ Items: [{ foo: { S: 'bar' } }] });
    const { query } = createQuerier({ query: mockQuery });
    expect(await query()).toEqual([{ foo: 'bar' }]);
  });

  test('should return a full response object with the items unwrapped', async () => {
    const mockQuery = jest.fn().mockResolvedValue({ Items: [{ foo: { S: 'bar' } }], Count: 1 });
    const { query } = createQuerier({ query: mockQuery });
    expect(await query({}, { raw: true })).toEqual({ Items: [{ foo: 'bar' }], Count: 1 });
  });
});

describe('the queryFor function', () => {
  test('should add `TableName` automatically to any request', async () => {
    const mockQuery = jest.fn().mockResolvedValue({});
    const { queryFor } = createQuerier({ query: mockQuery });
    await queryFor('some_table')({});
    expect(mockQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        TableName: 'some_table'
      }),
      undefined
    );
  });

  test('should create a query function with two arguments', async () => {
    const mockQuery = jest.fn().mockResolvedValue({});
    const { queryFor } = createQuerier({ query: mockQuery });
    const query = queryFor('some_table');
    await query({}, { raw: true });

    expect(mockQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        TableName: 'some_table'
      }),
      { raw: true }
    );
  });
});
