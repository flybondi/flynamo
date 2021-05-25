import { DynamoDB } from 'aws-sdk';
import DynamoDBWrapper from 'dynamodb-wrapper';

declare module '@flybondi/flynamo' {
  namespace Flynamo {
    export type KeyAttributes = { [key: string]: string | number };
    export type Key = string | number | KeyAttributes | { Key: KeyAttributes };
    export type Item = { [key: string]: any };

    export interface BatchGetItemInput {
      ConsistentRead?: DynamoDB.ConsistentRead;
      ReturnConsumedCapacity?: DynamoDB.ReturnConsumedCapacity;
      ProjectionExpression?: DynamoDB.ProjectionExpression;
      ExpressionAttributeNames?: DynamoDB.ExpressionAttributeNameMap;
    }

    export type BatchWriteItemInput = Omit<DynamoDB.BatchWriteItemInput, 'RequestItems'>;

    export interface BatchWriteItemOperations {
      insert?: Item | Item[];
      remove?: Key | Key[];
    }

    interface IGetItemInput extends DynamoDB.GetItemInput {
      TableName?: string;
    }

    export type GetItemInput = Omit<IGetItemInput, 'Key' | 'AttributesToGet'>;

    interface IPutItemInput extends DynamoDB.PutItemInput {
      TableName?: string;
    }

    export type PutItemInput = Omit<IPutItemInput, 'Item' | 'Expected' | 'ConditionalOperator'>;

    interface IQueryInput extends DynamoDB.QueryInput {
      TableName?: string;
    }

    export type QueryInput = Omit<
      IQueryInput,
      'AttributesToGet' | 'KeyConditions' | 'QueryFilter' | 'ConditionalOperator'
    >;

    interface IDeleteItemInput extends DynamoDB.DeleteItemInput {
      TableName?: string;
    }

    export type DeleteItemInput = Omit<
      IDeleteItemInput,
      'Key' | 'Expected' | 'ConditionalOperator'
    >;

    interface IUpdateItemInput extends DynamoDB.UpdateItemInput {
      TableName?: string;
    }

    export type UpdateItemInput = Omit<
      IUpdateItemInput,
      'Key' | 'AttributeUpdates' | 'Expected' | 'ConditionalOperator'
    >;

    export interface QueryOptions extends DynamoDBWrapper.IQueryOptions {
      /**
       * Whether to return the full `AWS.DynamoDB` response object when `true` or just the `Items` property value.
       */
      raw?: boolean;
    }

    type UpdateExpressionBuilderInput = Pick<
      DynamoDB.Update,
      'UpdateExpression' | 'ExpressionAttributeNames' | 'ExpressionAttributeValues'
    >;
    export type UpdateExpressionBuilder = (
      input: UpdateExpressionBuilderInput
    ) => DynamoDB.ExpressionAttributeValueMap;
  }

  export interface FlynamoClient {
    /**
     * Return the number of elements in a table or a secondary index. This function
     * uses `Scan` internally and retrieves the returned `Count` attribute from its response.
     *
     * @example
     *
     * // Returns the total count of items from a table
     * await count();
     *
     * @param request - Parameters as expected by DynamoDB `Scan` operation.
     * @returns A `Promise` that resolves to the total number of elements
     */
    count: (request: DynamoDB.ScanInput) => Promise<DynamoDB.Integer>;

    /**
     * Returns a set of attributes for the item with the given primary key.
     * If there is no matching item, it returns `undefined`. The name of the `key` defaults
     * to `id` if it's not specified. The `Key` value (as expected by a `AWS.DynamoDB` regular request)
     * can be omitted (i.e.: `{ id: 42 }` is equivalent to `{ Key: { id: 42 } }`).
     *
     * @example
     *
     *  // Return the item with a primary key of `{ pk: 'foo', sk: 'bar#baz' }`
     *  await get({ pk: 'foo', sk: 'bar#baz' });
     *
     * @example
     *
     *  // Returns the item with a primary key of `{ id: 42 }`
     *  await get({ Key: { id: 42 } });
     *
     * @param key - The primary key value.
     * @param input - Parameters as supported by `AWS.`DynamoDB` `GetItem` operation. Any `Key` attribute
     *  specified here will override primary key value in `key`.
     * @returns A `Promise` that resolves to the item returned by `AWS.DynamoDB` response or `undefined` if it
     *  does not exist.
     */
    get: <R extends Flynamo.Item>(
      key: Flynamo.Key,
      input: Flynamo.GetItemInput
    ) => Promise<R | void>;

    /**
     * Returns all items in a table or a secondary index. This uses `Scan` internally.
     *
     * @example
     *
     *  // Return all items in a table
     *  await getAll({ TableName: 'table-name' });
     *
     * @param input - Parameters as expected by `AWS.DynamoDB` `Scan` operation.
     * @returns A `Promise` that resolves to an array of `Items` returned by the `AWS.DynamoDB` response.
     */
    getAll: <R extends Flynamo.Item[]>(input: DynamoDB.ScanInput) => Promise<R>;

    /**
     * Creates a new item, or replaces an old item with a new item.
     * If an item that has the same primary key as the new item already exists in the table,
     * the new item completely replaces the existing item. This function uses `PutItem` internally.
     *
     * @example
     *
     *  // Insert or update item of primary key `{id: 42}`
     *  await insert({ id: 42, foo: 'bar' }, { TableName: 'table-name' });
     *
     *
     * @param item - The item to insert. Will be converted into a map of `AWS.DynamoDB` attributes internally.
     * @param input - Parameters as expected by `AWS.DynamoDB` `PutItem` operation.
     * @returns  Resolves to the response from DynamoDB client.
     */
    insert: (item: Flynamo.Item, input: Flynamo.PutItemInput) => Promise<DynamoDB.PutItemOutput>;

    /**
     * Finds items based on primary key values.
     *
     * @example
     *
     *  // Returns all items of `pk` `42` and `birthDate` between 1985 and 2020
     *  await query({
     *    TableName: 'table-name',
     *    KeyConditionExpression: "pk = :pk AND birthDate BETWEEN :start AND :end",
     *    ExpressionAttributeValues: {
     *      ':pk': { N: 42 },
     *      ':start': { S: '1985-01-01' },
     *      ':end': { S: '2020-01-01' }
     *    }
     *  });
     *
     * @param input - Parameters as expected by `AWS.DynamoDB` `Query` operation.
     * @param options - Configuration options parameters.
     * @returns A `Promise` that resolves to either an array of returned `Items` or the full, raw response from `AWS.DynamoDB`.
     */
    query: <R extends Flynamo.Item>(
      input: Flynamo.QueryInput,
      options?: Flynamo.QueryOptions
    ) => Promise<Array<R>>;
    query: (
      input: Flynamo.QueryInput,
      options: Omit<Flynamo.QueryOptions, 'raw'> & { raw: boolean }
    ) => Promise<DynamoDB.QueryOutput>;

    /**
     * Deletes a single item in a table by primary key. Returns the recently removed item by default
     * (the `Attributes` value present in the `AWS.DynamoDB` response after having set `ReturnValues` parameter to `ALL_OLD`).
     * This function uses `DeleteItem` operation internally.
     *
     * @example
     *
     *  // Deletes an item of primary key `{ id: 42 }`
     *  await remove(42, { TableName: 'table-name' });
     *
     * @param key - The primary key value of the item to delete.
     * @param input - Parameters as expected by `AWS.DynamoDB` `DeleteItem` operation.
     * @returns A `Promise` that resolves to the `Attributes` property of the DynamoDB response. Unless, `ReturnValues` has
     *  been explicitly set, this will match all attributes of the recently deleted element.
     */
    remove: (key: Flynamo.Key, input: Flynamo.DeleteItemInput) => Promise<DynamoDB.AttributeMap>;
    remove: <R extends Flynamo.Item>(
      key: Flynamo.Key,
      input: Omit<Flynamo.DeleteItemInput, 'ReturnValues'> & { ReturnValues: string }
    ) => Promise<R>;

    /**
     * Edits an existing item's attributes, or adds a new item to the table if it does not
     * already exist by its primary key. The primary key name defaults to `id` if not explicitly provided.
     * Returns the `Attributes` value from the `AWS.DynamoDB` response. By default, it sets `ReturnValues` to `ALL_NEW`
     * so it returns all of the attributes of the item, as they appear after the update operation. This function
     * uses the `UpdateItem` operation internally.
     *
     * @example
     *
     *  // Updates item with primary key `{ id: 42 }`
     *  await update(42, { foo: 'bar' }, { TableName: 'table-name' });
     *
     * @param key - The primary key value.
     * @param itemOrBuilder - Either an update expression builder function or the partial item that will be merged with the existing item in `AWS.DynamoDB`. An appropriate
     *  `UpdateExpression` will be automatically created from this argument. While you can `null` them or replace them,
     *  removing attributes from an item is only supported through manually defining an `UpdateExpression` using the `input` argument.
     * @param request - Parameters as expected by `AWS.DynamoDB` `UpdateItem` operation. Setting an `UpdateExpression` value here
     *  will override any value automatically derived from `itemOrBuilder`.
     * @returns A `Promise` that resolves to the `Attributes` property of the `AWS.DynamoDB` response.
     */
    update: <R extends Flynamo.Item>(
      key: Flynamo.Key,
      itemOrBuilder: Flynamo.Item | Flynamo.UpdateExpressionBuilder,
      request: Flynamo.UpdateItemInput
    ) => Promise<R>;
  }
  export interface ForFlynamoClient {
    /**
     * Returns the attributes of one or more items from a table in a single request.
     * Requested items are identified by primary key. A key represented by simply a `number` or `string`
     * will be assumed to be named `id`.
     *
     * @example
     *
     *  // Fetch three documents of key `id` 42, 33 and 7
     *  await batchGet([42, 33, 7]);
     *
     * @example
     *
     *  // Fetch documents of keys `{ foo: 42 }` and `{ foo: 33 }`
     *  await batchGet([{ foo: 42 }, { foo: 33 }]);
     *
     * @example
     *
     *  // Retrieve only `name` and `age` fields
     *  await batchGet([42, 33], { ProjectionExpression: 'name, age' });
     *
     * @param keys - Identifiers of elements to get.
     * @param input - Optional settings supported by `AWS.DynamoDB` for this operation.
     * @returns Resolves to the response from `AWS.DynamoDB` client for a `BatchGetItem` operation.
     */
    batchGet: (
      keys: Flynamo.Key | Flynamo.Key[],
      input?: Flynamo.BatchGetItemInput
    ) => Promise<DynamoDB.BatchGetItemOutput>;

    /**
     * Puts (i.e.: inserts) items in a table in a single batch.
     * It expects either a single item or an array of arbitrary items to insert.
     *
     * @example
     *
     *  // Insert two items in a single batch
     *  await batchInsert([{ foo: 'bar' }, { foo: 'baz' }]);
     *
     * @param items - The items to insert
     * @param input - Optional settings supported by `AWS.DynamoDB` for this operation.
     * @returns Resolves to the response from `AWS.DynamoDB` client for a `BatchWriteItem` operation.
     */
    batchInsert: (
      items: Flynamo.Item | Flynamo.Item[],
      input?: Flynamo.BatchWriteItemInput
    ) => Promise<DynamoDB.BatchWriteItemOutput>;

    /**
     * Deletes multiple items from a table in a single batch.
     * It expects an array of `{ Key }` values to delete. If no name is specified for the `Key`,
     * a name of `id` will be assumed.
     *
     * @example
     *
     *  // Removes a document with Key `{ foo: 'bar' }`
     *  await batchRemove([{ Key: { foo: 'bar' } }]);
     *
     * @example
     *
     *  // Removes three documents with Keys `{id: 33}`, `{id: 42}` and `{id: 7}`
     *  await batchRemove([33, 42, 7]);
     *
     * @param keys - Identifiers of elements to delete.
     * @param input - Optional settings supported by `AWS.DynamoDB` for this operation.
     * @returns Resolves to the response from `AWS.DynamoDB` client for a `BatchWriteItem` operation.
     */
    batchRemove: (
      keys: Flynamo.Key | Flynamo.Key[],
      input?: Flynamo.BatchWriteItemInput
    ) => Promise<DynamoDB.BatchWriteItemOutput>;

    /**
     * Puts (i.e.: inserts) or deletes multiple items in a table in a single operation. It expects an
     * object argument containing `insert` and/or `remove` array properties (a single element will be coerced into an array).
     * Each describe items that will be inserted or deleted from the table. Each element in these arrays
     * can be thought of as inputs to corresponding `batchInsert` or `batchRemove` `Flynamo` functions.
     *
     * @example
     *
     *  // Inserts two items in `SomeTable`
     *  await batchWrite({ insert: [{ foo: 'bar' }, { foo: 'baz' }] });
     *
     * @example
     *
     *  // Inserts one item and remove item with Key `42`
     *  await batchWrite({ insert: [{ foo: 'bar' }], remove: [42] });
     *
     * @param operations - An object containing `insert` and/or `remove` properties.
     * @returns - Resolves to the response from `AWS.DynamoDB` client for a `BatchWriteItem` operation.
     */
    batchWrite: (
      operations: Flynamo.BatchWriteItemOperations,
      input?: Flynamo.BatchWriteItemInput
    ) => Promise<DynamoDB.BatchWriteItemOutput>;

    /**
     * Return the number of elements in a table or a secondary index. This function
     * uses `Scan` internally and retrieves the returned `Count` attribute from its response.
     *
     * @example
     *
     * // Returns the total count of items from a table
     * await count();
     *
     * @param request - Parameters as expected by DynamoDB `Scan` operation.
     * @returns A `Promise` that resolves to the total number of elements
     */
    count: (request?: DynamoDB.ScanInput) => Promise<DynamoDB.Integer>;

    /**
     * Returns a set of attributes for the item with the given primary key.
     * If there is no matching item, it returns `undefined`. The name of the `key` defaults
     * to `id` if it's not specified. The `Key` value (as expected by a `AWS.DynamoDB` regular request)
     * can be omitted (i.e.: `{ id: 42 }` is equivalent to `{ Key: { id: 42 } }`).
     *
     * @example
     *
     *  // Return the item with a primary key of `{ id: 42 }`
     *  await get(42);
     *
     * @example
     *
     *  // Return the item with a primary key of `{ pk: 'foo', sk: 'bar#baz' }`
     *  await get({ pk: 'foo', sk: 'bar#baz' });
     *
     * @example
     *
     *  // Returns the item with a primary key of `{ id: 42 }`
     *  await get({ Key: { id: 42 } });
     *
     * @param key - The primary key value.
     * @param input - Optional parameters as supported by `AWS.`DynamoDB` `GetItem` operation. Any `Key` attribute
     *  specified here will override primary key value in `key`.
     * @returns A `Promise` that resolves to the item returned by `AWS.DynamoDB` response or `undefined` if it
     *  does not exist.
     */
    get: <R extends Flynamo.Item>(
      key: Flynamo.Key,
      input?: Flynamo.GetItemInput
    ) => Promise<R | void>;

    /**
     * Returns all items in a table or a secondary index. This uses `Scan` internally.
     *
     * @example
     *
     *  // Return all items in a table
     *  await getAll();
     *
     * @param input - Parameters as expected by `AWS.DynamoDB` `Scan` operation.
     * @returns A `Promise` that resolves to an array of `Items` returned by the `AWS.DynamoDB` response.
     */
    getAll: <R extends Flynamo.Item[]>(input?: DynamoDB.ScanInput) => Promise<R>;

    /**
     * Creates a new item, or replaces an old item with a new item.
     * If an item that has the same primary key as the new item already exists in the table,
     * the new item completely replaces the existing item. This function uses `PutItem` internally.
     *
     * @example
     *
     *  // Insert or update item of primary key `{id: 42}`
     *  await insert({ id: 42, foo: 'bar' });
     *
     *
     * @param item - The item to insert. Will be converted into a map of `AWS.DynamoDB` attributes internally.
     * @param input - Optional parameters as expected by `AWS.DynamoDB` `PutItem` operation.
     * @returns  Resolves to the response from DynamoDB client.
     */
    insert: (item: Flynamo.Item, input?: Flynamo.PutItemInput) => Promise<DynamoDB.PutItemOutput>;

    /**
     * Finds items based on primary key values.
     *
     * @example
     *
     *  // Returns all items of `pk` `42` and `birthDate` between 1985 and 2020
     *  await query({
     *    KeyConditionExpression: "pk = :pk AND birthDate BETWEEN :start AND :end",
     *    ExpressionAttributeValues: {
     *      ':pk': { N: 42 },
     *      ':start': { S: '1985-01-01' },
     *      ':end': { S: '2020-01-01' }
     *    }
     *  });
     *
     * @param input - Parameters as expected by `AWS.DynamoDB` `Query` operation.
     * @param options - Configuration options parameters.
     * @returns A `Promise` that resolves to either an array of returned `Items` or the full, raw response from `AWS.DynamoDB`.
     */
    query: <R extends Flynamo.Item>(
      input: Flynamo.QueryInput,
      options?: Flynamo.QueryOptions
    ) => Promise<Array<R>>;
    query: (
      input: Flynamo.QueryInput,
      options: Omit<Flynamo.QueryOptions, 'raw'> & { raw: boolean }
    ) => Promise<DynamoDB.QueryOutput>;

    /**
     * Deletes a single item in a table by primary key. Returns the recently removed item by default
     * (the `Attributes` value present in the `AWS.DynamoDB` response after having set `ReturnValues` parameter to `ALL_OLD`).
     * This function uses `DeleteItem` operation internally.
     *
     * @example
     *
     *  // Deletes an item of primary key `{ id: 42 }`
     *  await remove(42);
     *
     * @param key - The primary key value of the item to delete.
     * @param input - Optional parameters as expected by `AWS.DynamoDB` `DeleteItem` operation.
     * @returns A `Promise` that resolves to the `Attributes` property of the DynamoDB response. Unless, `ReturnValues` has
     *  been explicitly set, this will match all attributes of the recently deleted element.
     */
    remove: (key: Flynamo.Key, input?: Flynamo.DeleteItemInput) => Promise<DynamoDB.AttributeMap>;
    remove: <R extends Flynamo.Item>(
      key: Flynamo.Key,
      input: Omit<Flynamo.DeleteItemInput, 'ReturnValues'> & { ReturnValues: string }
    ) => Promise<R>;

    /**
     * Edits an existing item's attributes, or adds a new item to the table if it does not
     * already exist by its primary key. The primary key name defaults to `id` if not explicitly provided.
     * Returns the `Attributes` value from the `AWS.DynamoDB` response. By default, it sets `ReturnValues` to `ALL_NEW`
     * so it returns all of the attributes of the item, as they appear after the update operation. This function
     * uses the `UpdateItem` operation internally.
     *
     * @example
     *
     *  // Updates item with primary key `{ id: 42 }`
     *  await update(42, { foo: 'bar' });
     *
     * @param key - The primary key value.
     * @param itemOrBuilder - Either an update expression builder function or the partial item that will be merged with the existing item in `AWS.DynamoDB`. An appropriate
     *  `UpdateExpression` will be automatically created from this argument. While you can `null` them or replace them,
     *  removing attributes from an item is only supported through manually defining an `UpdateExpression` using the `input` argument.
     * @param request - Optional parameters as expected by `AWS.DynamoDB` `UpdateItem` operation. Setting an `UpdateExpression` value here
     *  will override any value automatically derived from `itemOrBuilder`.
     * @returns A `Promise` that resolves to the `Attributes` property of the `AWS.DynamoDB` response.
     */
    update: <R extends Flynamo.Item>(
      key: Flynamo.Key,
      itemOrBuilder: Flynamo.Item | Flynamo.UpdateExpressionBuilder,
      request?: Flynamo.UpdateItemInput
    ) => Promise<R>;
  }

  export interface ForTable {
    /**
     * Returns a `Flynamo` API that automatically adds a `TableName` prop
     * to all its requests.
     *
     * @example
     *
     *  const { get, count } = forTable('SomeTable');
     *  await get(42); // Fetch item of primary key `{id: 42}` from `SomeTable`
     *  await count(); // Count total number of elements in `SomeTable`
     *
     * @param tableName - The value of `TableName`.
     * @returns The entire `Flynamo` scoped to a single table.
     */
    forTable(tableName: string): ForFlynamoClient;
  }
  
  export type Flynamo = FlynamoClient & ForTable;

  /**
   * Wraps an `AWS.DynamoDB` instance and returns a new `Flynamo` client.
   * Configurable `options` for `dynamodb-wrapper` may be provided.
   *
   * @see https://github.com/Shadowblazen/dynamodb-wrapper#setup
   * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html
   * @param client - A `AWS.DynamoDB` client.
   * @param options - `DynamoDBWrapper` configuration (optional).
   */
  export declare function flynamo(
    dynamodb: DynamoDB,
    options?: DynamoDBWrapper.IDynamoDBWrapperOptions
  ): Flynamo;

  export = flynamo;
}
