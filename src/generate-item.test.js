'use strict';
const generateItem = require('./generate-item');

test('should generate a DynamoDB Item element from a single Number', () => {
  expect(generateItem(5)).toEqual({ Item: { N: '5' } });
});

test('should generate a DynamoDB Item element from a String', () => {
  expect(generateItem('foo')).toEqual({ Item: { S: 'foo' } });
});

test('should generate a DynamoDB Item element from an Object', () => {
  expect(generateItem({ bar: 'foo' })).toEqual({ Item: { bar: { S: 'foo' } } });
});

test('should honor an existing Item if present', () => {
  expect(generateItem({ Item: { bar: 'foo' } })).toEqual({ Item: { bar: { S: 'foo' } } });
});
