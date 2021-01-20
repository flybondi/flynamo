# @flybondi/flynamo

[![CircleCI](https://circleci.com/gh/flybondi/flynamo/tree/develop.svg?style=svg)](https://circleci.com/gh/flybondi/flynamo/tree/develop)
[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/Flet/semistandard)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Let your [AWS][aws] [DynamoDB][dynamodb] client take off ✈️!

Read [the docs][flynamo-jsdoc].

- 🔧 **Simplifies** creating requests and parsing responses.
- ✨ Automatic generation of `AWS.DynamoDB` attribute maps.
- 💪 Supports all of `AWS.DynamoDB` API.
- ✏️ Fully **typed** via [`d.ts` typings][typings].
- ✨ **Infers** data types and conventional names for keys.
- 💪 Import **single composable functions** for each `AWS.DynamoDB` operation.
- 🙌 Plays well with functional libraries like [`ramda`][ramda] or [`lodash/fp`][lodashfp].

```sh
# Install AWS SDK
npm i aws-sdk

# Install Flynamo
npm i @flybondi/flynamo
```

## Basic usage

Wrap an instance of an `AWS.DynamoDB` client with `flynamo` and you're good to go. The result will be an object exposing all of Flynamo's own API.

```js
const AWS = require('aws-sdk');
const flynamo = require('@flybondi/flynamo');

const { forTable } = flynamo(new AWS.DynamoDB());
const { insert, update, remove } = forTable('SomeTable');

(async function () {
  // Insert a document into `SomeTable`
  await insert({ id: 42, name: 'Bob' });

  // Update its contents
  await update(42, { name: 'Alice' });

  // ...and delete it
  await remove(42);
})();
```

## API

Dig into the [documentation][flynamo-jsdoc] to learn about the available functions.

---

Made with 💛 by [Flybondi][flybondi].

[aws]: https://aws.amazon.com/
[dynamodb]: https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/Welcome.html
[typings]: https://github.com/flybondi/flynamo/blob/master/index.d.ts
[ramda]: http://ramdajs.com/
[lodashfp]: https://github.com/lodash/lodash/wiki/FP-Guide
[flynamo-jsdoc]: https://flybondi.github.io/flynamo/
[flybondi]: https://flybondi.com
