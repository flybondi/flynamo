'use strict';
const { concat, flip } = require('ramda');

/**
 * Because original `concat` sucks.
 *
 * @private
 * @see https://ramdajs.com/docs/#concat
 */
const catcon = flip(concat);

module.exports = catcon;
