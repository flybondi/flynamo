'use strict';
const createAllGetter = require('./get-all');

describe('the getAllFor function', () => {
  test('should call `scan` internally', async () => {
    const mockRequest = { promise: jest.fn().mockResolvedValue({}) };
    const mockScan = jest.fn().mockReturnValue(mockRequest);
    const { getAll } = createAllGetter({ scan: mockScan });
    await getAll();
    expect(mockScan).toHaveBeenCalled();
  });

  test('should return `undefined` if no items are returned', async () => {
    const mockRequest = { promise: jest.fn().mockResolvedValue({}) };
    const mockScan = jest.fn().mockReturnValue(mockRequest);
    const { getAll } = createAllGetter({ scan: mockScan });
    expect(await getAll()).toBeUndefined();
  });

  test('should return unwrapped items', async () => {
    const mockRequest = {
      promise: jest.fn().mockResolvedValue({ Items: [{ foo: { S: 'bar' } }] })
    };
    const mockScan = jest.fn().mockReturnValue(mockRequest);
    const { getAll } = createAllGetter({ scan: mockScan });
    expect(await getAll()).toEqual([{ foo: 'bar' }]);
  });
});

describe('the getAllFor function', () => {
  test('should add `TableName` automatically to any request', async () => {
    const mockRequest = { promise: jest.fn().mockResolvedValue({}) };
    const mockScan = jest.fn().mockReturnValue(mockRequest);
    const { getAllFor } = createAllGetter({ scan: mockScan });
    await getAllFor('some_table')({});
    expect(mockScan).toHaveBeenCalledWith(
      expect.objectContaining({
        TableName: 'some_table'
      })
    );
  });
});
