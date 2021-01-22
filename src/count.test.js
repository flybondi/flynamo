'use strict';
const createCounter = require('./count');

test('should call `scan` internally', async () => {
  const mockRequest = { promise: jest.fn().mockResolvedValue({ Items: [] }) };
  const mockScan = jest.fn().mockReturnValue(mockRequest);
  const { count } = createCounter({ scan: mockScan });
  await count();
  expect(mockScan).toHaveBeenCalled();
});

test.only('should return `undefined` if no items are returned', async () => {
  const mockRequest = { promise: jest.fn().mockResolvedValue({ Items: [] }) };
  const mockScan = jest.fn().mockReturnValue(mockRequest);
  const { count } = createCounter({ scan: mockScan });
  expect(await count()).toBeUndefined();
});

test('should return the count of items according to `Count`', async () => {
  const mockRequest = { promise: jest.fn().mockResolvedValue({ Items: [], Count: 7 }) };
  const mockScan = jest.fn().mockReturnValue(mockRequest);
  const { count } = createCounter({ scan: mockScan });
  expect(await count()).toEqual(7);
});

test('should add a `TableName` if using countFor', async () => {
  const mockRequest = { promise: jest.fn().mockResolvedValue({ Items: [], Count: 7 }) };
  const mockScan = jest.fn().mockReturnValue(mockRequest);
  const { countFor } = createCounter({ scan: mockScan });
  await countFor('Foo')();
  expect(mockScan).toHaveBeenCalledWith(
    expect.objectContaining({
      TableName: 'Foo'
    })
  );
});
