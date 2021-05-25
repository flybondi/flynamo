'use strict';
const { overFirst, overAll, mapMergeFirstPairOfArgs, mapMergeNArgs } = require('./map-merge-args');

describe('the `overFirst` function', () => {
  test('should modify the first element of an array using a given function', () => {
    const add40ToHead = overFirst(x => x + 40);
    expect(add40ToHead([2, 3, 4])).toEqual([42, 3, 4]);
  });
});

describe('the `overAll` function', () => {
  test('should expect a list of functions and return a function', () => {
    expect(typeof overAll([]) === 'function').toBe(true);
  });

  test('should apply a list of functions to a list of values', () => {
    const sum40 = x => x + 40;
    const sum40ToFirstThree = overAll([sum40, sum40, sum40]);
    expect(sum40ToFirstThree([2, 2, 2])).toEqual([42, 42, 42]);
  });

  test('should return values that do not have a correspoding mapping functions as they were given', () => {
    const sum40 = x => x + 40;
    const sum40ToFirstThree = overAll([sum40, sum40, sum40]);
    expect(sum40ToFirstThree([2, 2, 2, 33, 7])).toEqual([42, 42, 42, 33, 7]);
  });
});

describe('the `mapMergeFirstPairOfArgs`', () => {
  test('should map arguments of a function using the provided list of mapping functions', () => {
    const add40ToX = obj => ({ ...obj, x: obj.x + 40 });
    const sum40ToXInFirstArg = mapMergeFirstPairOfArgs([add40ToX]);
    expect(sum40ToXInFirstArg({ x: 2 })).toEqual([{ x: 42 }]);
  });

  test('should merge first two arguments after mapping them', () => {
    const add40ToX = obj => ({ ...obj, x: obj.x + 40 });
    const sum40ToXInFirstArg = mapMergeFirstPairOfArgs([add40ToX]);
    expect(sum40ToXInFirstArg({ x: 2 }, { foo: 'bar' })).toEqual([{ x: 42, foo: 'bar' }]);
  });

  test('should leave all arguments after the second one untouched', () => {
    const add40ToX = obj => ({ ...obj, x: obj.x + 40 });
    const sum40ToXInFirstArg = mapMergeFirstPairOfArgs([add40ToX]);
    expect(sum40ToXInFirstArg({ x: 2 }, { foo: 'bar' }, { baz: 33 })).toEqual([
      { x: 42, foo: 'bar' },
      { baz: 33 }
    ]);
  });
});

describe('the `mapMergeNArgs`', () => {
  test('should map arguments of a function using the provided list of mapping functions', () => {
    const add40ToX = obj => ({ ...obj, x: obj.x + 40 });
    const sum40ToXInFirstArg = mapMergeNArgs(2, [add40ToX]);
    expect(sum40ToXInFirstArg({ x: 2 })).toEqual([{ x: 42 }]);
  });

  test('should merge first N arguments after mapping them', () => {
    const add40ToX = obj => ({ ...obj, x: obj.x + 40 });
    const sum40ToXInFirstArg = mapMergeNArgs(3, [add40ToX]);
    expect(sum40ToXInFirstArg({ x: 2 }, { foo: 'bar' }, { baz: 33 })).toEqual([
      { x: 42, foo: 'bar', baz: 33 }
    ]);
  });

  test('should merge from the rigth first N arguments after mapping', () => {
    const addXandMapFoo = mapMergeNArgs(3, [
      params => ({ ...params, x: 'y' }),
      params => ({ foo: params.foo })
    ]);
    expect(addXandMapFoo({ id: 2 }, { foo: 'bar' }, { x: 'x' })).toEqual([
      { id: 2, foo: 'bar', x: 'x' }
    ]);
  });

  test('should leave all arguments after the nth one untouched', () => {
    const add40ToX = obj => ({ ...obj, x: obj.x + 40 });
    const sum40ToXInFirstArg = mapMergeNArgs(3, [add40ToX]);
    expect(sum40ToXInFirstArg({ x: 2 }, { foo: 'bar' }, { baz: 33 }, 42, true)).toEqual([
      { x: 42, foo: 'bar', baz: 33 },
      42,
      true
    ]);
  });
});
