'use strict';
const { andThen } = require('./and-then');

test('should call the promise function and then the callback function', async () => {
  const mockFn = { promise: jest.fn().mockResolvedValue({ Items: ['foo'] }) };
  const mockCallbackFn = jest.fn().mockReturnValue(['foo']);

  expect(await andThen(mockCallbackFn)(mockFn)).toEqual(['foo']);
  expect(mockFn.promise).toHaveBeenCalled();
  expect(mockCallbackFn).toHaveBeenCalled();
});
