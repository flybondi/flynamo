'use strict';
/**
 * A DynamoDB client wrapper that simplifies writing requests and fetching responses.
 * Let your AWS DynamoDB client take off ✈!
 *
 * @see https://flybondi.github.io/flynamo/
 * @module flynamo
 */
const createFlynamo = require('./src/client');

module.exports = createFlynamo;
