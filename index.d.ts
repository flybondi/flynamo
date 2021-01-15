import { DynamoDB } from 'aws-sdk'

type Key = {[key: string]: string | number | boolean };
type Item = {[key: string]: any };

export interface Flynamo {
  batchGet: (input: DynamoDB.Types.BatchGetItemInput) => Promise<DynamoDB.Types.BatchGetItemOutput>,
  batchInsert: (input: DynamoDB.Types.BatchWriteItemInput) => Promise<DynamoDB.Types.BatchWriteItemOutput>,
  batchRemove: (input: DynamoDB.Types.BatchWriteItemInput) => Promise<DynamoDB.Types.BatchWriteItemOutput>,
  batchWrite: (input: DynamoDB.Types.BatchWriteItemInput) => Promise<DynamoDB.Types.BatchWriteItemOutput>,
  count: () => Promise<DynamoDB.Types.Integer>,
  get: (key: Key) => Promise<Item[]>,
  getAll: (input: DynamoDB.Types.ScanInput) => Promise<Item[]>,
  insert: (item: Item) => Promise<DynamoDB.Types.PutItemOutput[]>,
  query: (input: DynamoDB.Types.QueryInput) => Promise<Item[]>,
  remove: (key: Key) => Promise<DynamoDB.Types.DeleteItemOutput>,
  update: (key: Key, item: Item) => Promise<Item>
}
