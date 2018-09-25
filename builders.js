'use strict';
/**
 * A DynamoDB expression builder that simplifies generating update items requests
 * by composing small functions. Functions from this module can be imported from the
 * `@flybondi/flynamo/builders` namespace.
 *
 * @see https://flybondi.github.io/flynamo/docs/module-Builders.html
 * @module flynamo
 */
const builders = require('./src/builders');

module.exports = builders;
