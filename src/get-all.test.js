'use strict';
const createAllGetter = require('./get-all');

describe('the getAllFor function', () => {
  test('should call `scan` internally', async () => {
    const mockScan = jest.fn().mockResolvedValue({});
    const { getAll } = createAllGetter({ scan: mockScan });
    await getAll();
    expect(mockScan).toHaveBeenCalled();
  });

  test('should return `undefined` if no items are returned', async () => {
    const mockScan = jest.fn().mockResolvedValue({});
    const { getAll } = createAllGetter({ scan: mockScan });
    expect(await getAll()).toBeUndefined();
  });

  test('should return unwrapped items', async () => {
    const mockScan = jest.fn().mockResolvedValue({ Items: [{ foo: { S: 'bar' } }] });
    const { getAll } = createAllGetter({ scan: mockScan });
    expect(await getAll()).toEqual([{ foo: 'bar' }]);
  });
});

describe('the getAllFor function', () => {
  test('should add `TableName` automatically to any request', async () => {
    const mockScan = jest.fn().mockResolvedValue({});
    const { getAllFor } = createAllGetter({ scan: mockScan });
    await getAllFor('some_table')({});
    expect(mockScan).toHaveBeenCalledWith(
      expect.objectContaining({
        TableName: 'some_table'
      })
    );
  });
});
