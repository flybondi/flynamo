'use strict';
const createCounter = require('./count');

test('should call `scan` internally', async () => {
  const mockScan = jest.fn().mockResolvedValue({});
  const { count } = createCounter({ scan: mockScan });
  await count();
  expect(mockScan).toHaveBeenCalled();
});

test('should return `undefined` if no items are returned', async () => {
  const mockScan = jest.fn().mockResolvedValue({});
  const { count } = createCounter({ scan: mockScan });
  expect(await count()).toBeUndefined();
});

test('should return the count of items according to `Count`', async () => {
  const mockScan = jest.fn().mockResolvedValue({ Count: 7 });
  const { count } = createCounter({ scan: mockScan });
  expect(await count()).toEqual(7);
});

test('should add a `TableName` if using countFor', async () => {
  const mockScan = jest.fn().mockResolvedValue({ Count: 7 });
  const { countFor } = createCounter({ scan: mockScan });
  await countFor('Foo')();
  expect(mockScan).toHaveBeenCalledWith(
    expect.objectContaining({
      TableName: 'Foo'
    })
  );
});
