'use strict';
const addReturnValues = require('./return-values');

test('should be a higher order function that returns a function', () => {
  expect(typeof addReturnValues === 'function').toBe(true);
});

test('should add a `ReturnValues` attribute to a given object', () => {
  const addReturnValuesFoo = addReturnValues('Foo');
  expect(addReturnValuesFoo({})).toEqual({ ReturnValues: 'Foo' });
});

test('should keep all owned properties of given objects after adding TableName', () => {
  const addReturnValuesFoo = addReturnValues('Foo');
  expect(addReturnValuesFoo({ bar: 42 })).toEqual({ ReturnValues: 'Foo', bar: 42 });
});

test('should default to an empty object if passing in `undefined`', () => {
  const addReturnValuesFoo = addReturnValues('Foo');
  expect(addReturnValuesFoo(undefined)).toEqual({ ReturnValues: 'Foo' });
});
test('should honour existing `ReturnValues` if already present', () => {
  const addReturnValuesFoo = addReturnValues('Foo');
  expect(addReturnValuesFoo({ ReturnValues: 'Bar' })).toEqual({ ReturnValues: 'Bar' });
});
