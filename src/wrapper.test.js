'use strict';

const { wrapProp } = require('./wrapper');

describe('the `wrapProp` function', () => {
  test('should be a higher order function that returns a function', () => {
    expect(typeof wrapProp('foo') === 'function').toBe(true);
  });

  test('should convert a property on an object to a DynamoDB attribute value', () => {
    const wrapFoo = wrapProp('foo');
    expect(wrapFoo({ foo: { bar: 42 } })).toEqual({
      bar: { N: '42' }
    });
  });

  test('should return `undefined` if given prop value is `undefined`', () => {
    const wrapFoo = wrapProp('foo');
    expect(wrapFoo({ foo: undefined })).toEqual(undefined);
  });

  test('should return `null` if given prop value is `null`', () => {
    const wrapFoo = wrapProp('foo');
    expect(wrapFoo({ foo: null })).toEqual(null);
  });

  test('should support wrapping objects created by `Object.create(null)`', () => {
    const wrapFoo = wrapProp('foo');
    const foo = Object.create(null);
    foo.bar = 42;
    expect(wrapFoo({ foo })).toEqual({
      bar: { N: '42' }
    });
  });
});
