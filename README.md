# @flybondi/flynamo

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/d26ccc5aec9542168eb4140bb8e883cf)](https://app.codacy.com/app/Flybondi/flynamo?utm_source=github.com&utm_medium=referral&utm_content=flybondi/flynamo&utm_campaign=badger)
[![CircleCI](https://circleci.com/gh/flybondi/flynamo/tree/develop.svg?style=svg)](https://circleci.com/gh/flybondi/flynamo/tree/develop)
[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/Flet/semistandard)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Let your [AWS][aws] [DynamoDB][dynamodb] client take off ✈️!

- 🔧 **Simplifies** creating requests and parsing responses.
- ✨ Automatic generation of DynamoDB attribute maps.
- 💪 Supports all of `AWS.DynamoDB` API.
- ✨ **Infers** data types and conventional names.
- 💪 Import **single composable functions** for each DynamoDB API.
- 🙌 Plays well with functional libraries like [`ramda`][ramda] or [`lodash/fp`][lodashfp].

```sh
# Install AWS SDK
npm i aws-sdk

# Install Flynamo
npm i @flybondi/flynamo
```

## Basic usage

Wrap an instance of `AWS.DynamoDB` client with `createFlynamo` and you're good to go. The result will be an object exposing all of Flynamo's own API.

```js
const DynamoDB = require('aws-sdk/clients/dynamodb');
const createFlynamo = require('@flybondi/flynamo');

const { forTable } = createFlynamo(new DynamoDB());

const { insert, update, remove } = forTable('SomeTable');

(async function() {
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
[ramda]: http://ramdajs.com/
[lodashfp]: https://github.com/lodash/lodash/wiki/FP-Guide
[flynamo-jsdoc]: https://flybondi.github.io/flynamo/
[flybondi]: https://flybondi.com
