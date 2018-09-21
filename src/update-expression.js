'use strict';

const { compose, evolve, concat, dropLast, merge, flip } = require('ramda');
// because original concat sucks
const catcon = flip(concat);

/**
 * Returns a function that, when invoked with a set of default values for a dynamo expression,
 * it creates the mandatory UpdateExpression, AttributeNames and AttributeValues needed to build
 * the `action` operations created by the given `operation` function.
 *
 * @function
 * @param {String} action to execute in dynamodb, it can be SET, ADD, DELETE or REMOVE
 * @param {Function} operations that returns an object with the operations to execute and their parameters
 */
const updateExpression = (action, operations) =>
  compose(
    evolve({
      Update: dropLast(2)
    }),
    operations,
    evolve({
      Update: catcon(` ${action} `)
    })
  );

const put = (attribute, value) =>
  evolve({
    UpdateExpression: catcon(`#${attribute} = :${attribute}, `),
    ExpressionAttributeNames: merge({
      [`#${attribute}`]: attribute
    }),
    ExpressionAttributeValues: merge({
      [`:${attribute}`]: value
    })
  });

const append = (attribute, value) =>
  evolve({
    UpdateExpression: catcon(`#${attribute} = list_append(#${attribute}, :${attribute}), `),
    ExpressionAttributeNames: merge({
      [`#${attribute}`]: attribute
    }),
    ExpressionAttributeValues: merge({
      [`:${attribute}`]: value
    })
  });

// const result = compose(
//   updExp('SET', compose(
//     put('air', 'val'),
//     put('air2', 'val')
//   )),
//   updExp('DELETE', compose(
//     put('air', 'val'),
//     //put('air2', 'val')
//   ))
//  );

// result({ Update: '', Names: {}, Values: {} })

// const result = compose(
//   updExp('SET', compose(
//     put('air', 'val'),
//     put('air2', 'val')
//   )),
//   updExp('DELETE', compose(
//     put('air', 'val'),
//     put('air2', 'val')
//   ))
//  );

// result({
//   UpdateExpression: '',
//   ExpressionAttributeNames: {},
//   ExpressionAttributeValues: {}
// })

module.exports = {
  append,
  updateExpression,
  put
};
