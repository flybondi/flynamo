'use strict';
const createQuerier = require('./query');

describe('the query function', () => {
  test('should call `query` internally', async () => {
    const mockRequest = { promise: jest.fn().mockResolvedValue({}) };
    const mockQuery = jest.fn().mockReturnValue(mockRequest);
    const { query } = createQuerier({ query: mockQuery });
    await query();
    expect(mockQuery).toHaveBeenCalled();
  });

  test('should return `[]` if no items are returned', async () => {
    const mockRequest = { promise: jest.fn().mockResolvedValue({}) };
    const mockQuery = jest.fn().mockReturnValue(mockRequest);
    const { query } = createQuerier({ query: mockQuery });
    expect(await query()).toStrictEqual([]);
  });

  test('should return unwrapped items', async () => {
    const mockRequest = {
      promise: jest.fn().mockResolvedValue({ Items: [{ foo: { S: 'bar' } }] })
    };
    const mockQuery = jest.fn().mockReturnValue(mockRequest);
    const { query } = createQuerier({ query: mockQuery });
    expect(await query()).toEqual([{ foo: 'bar' }]);
  });

  test('should return a full response object with the items unwrapped', async () => {
    const mockRequest = {
      promise: jest.fn().mockResolvedValue({ Items: [{ foo: { S: 'bar' } }], Count: 1 })
    };
    const mockQuery = jest.fn().mockReturnValue(mockRequest);
    const { query } = createQuerier({ query: mockQuery });
    expect(await query({}, { raw: true })).toEqual({ Items: [{ foo: 'bar' }], Count: 1 });
  });
});

describe('the queryFor function', () => {
  test('should add `TableName` automatically to any request', async () => {
    const mockRequest = { promise: jest.fn().mockResolvedValue({}) };
    const mockQuery = jest.fn().mockReturnValue(mockRequest);
    const { queryFor } = createQuerier({ query: mockQuery });
    await queryFor('some_table')({});
    expect(mockQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        TableName: 'some_table'
      })
    );
  });

  test('should create a query function with two arguments', async () => {
    const mockRequest = { promise: jest.fn().mockResolvedValue({}) };
    const mockQuery = jest.fn().mockReturnValue(mockRequest);
    const { queryFor } = createQuerier({ query: mockQuery });
    const query = queryFor('some_table');
    await query({}, { raw: true });

    expect(mockQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        TableName: 'some_table'
      })
    );
  });
});
