'use strict';
const { assoc, compose, unless, has, defaultTo } = require('ramda');

/**
 * Returns a function that, when invoked, adds a `TableName` property to the input
 * object. If the input is not an object, a new one containing just `TableName` will
 * be created.
 *
 * @private
 * @param {String} table The table name
 */
const addTableName = table =>
  compose(
    unless(has('TableName'), assoc('TableName', table)),
    defaultTo({})
  );

module.exports = addTableName;
