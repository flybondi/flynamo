'use strict';
/**
 * Ramda shortcuts for the builders
 * @module Builders
 */

const { concat, flip } = require('ramda');

/**
 * because original concat sucks
 * @private
 */
const catcon = flip(concat);

module.exports = catcon;
