'use strict';
const addTableName = require('./table-name');

test('should be a higher order function that returns a function', () => {
  expect(typeof addTableName === 'function').toBe(true);
});

test('should add a TableName attribute to a given object', () => {
  const addTableNameFoo = addTableName('Foo');
  expect(addTableNameFoo({})).toEqual({ TableName: 'Foo' });
});

test('should keep all owned properties of given objects after adding TableName', () => {
  const addTableNameFoo = addTableName('Foo');
  expect(addTableNameFoo({ bar: 42 })).toEqual({ TableName: 'Foo', bar: 42 });
});

test('should default to an empty object if passing in `undefined`', () => {
  const addTableNameFoo = addTableName('Foo');
  expect(addTableNameFoo(undefined)).toEqual({ TableName: 'Foo' });
});
test('should honour existing TableName if already present', () => {
  const addTableNameFoo = addTableName('Foo');
  expect(addTableNameFoo({ TableName: 'Bar' })).toEqual({ TableName: 'Bar' });
});
