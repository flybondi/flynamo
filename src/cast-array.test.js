'use strict';
const castArray = require('./cast-array');

test('should return same input if already an array', () => {
  expect(castArray([1])).toEqual([1]);
  expect(castArray(Array.of(1))).toEqual([1]);
});

test('should wrap input in an array if value is a Number', () => {
  expect(castArray(1)).toEqual([1]);
});

test('should wrap input in an array if value is a String', () => {
  expect(castArray('Avalanche')).toEqual(['Avalanche']);
});

test('should wrap input in an array if value is a Boolean', () => {
  expect(castArray(false)).toEqual([false]);
});
