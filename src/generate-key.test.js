'use strict';
const generateKey = require('./generate-key');

test('should return `null` if the input is `null`', () => {
  expect(generateKey(null)).toBeNull();
});

test('should return `undefined` if the input is `undefined`', () => {
  expect(generateKey(undefined)).toBeUndefined();
});

test('should assume a `Key` named `id` if a the input is a number', () => {
  expect(generateKey(42)).toEqual({ Key: { id: { N: '42' } } });
});

test('should assume a `Key` named `id` if a the input is a string', () => {
  expect(generateKey('foo')).toEqual({ Key: { id: { S: 'foo' } } });
});

test('should assume a `Key` named `id` if the input is an object containing a `Key` property which is a string', () => {
  expect(generateKey({ Key: 'foo' })).toEqual({ Key: { id: { S: 'foo' } } });
});

test('should assume a `Key` named `id` if the input is an object containing a `Key` property which is a number', () => {
  expect(generateKey({ Key: 42 })).toEqual({ Key: { id: { N: '42' } } });
});

test('should generate a full `Key` attribute value from the input if it is an object', () => {
  expect(generateKey({ pk: 'foo', sk: 'bar' })).toEqual({
    Key: { pk: { S: 'foo' }, sk: { S: 'bar' } }
  });
});

test('should avoid adding a `Key` attribute if the input already defines one', () => {
  expect(generateKey({ Key: { pk: 'foo' } })).toEqual({ Key: { pk: { S: 'foo' } } });
});
