'use strict';
const createDescribers = require('./describe-table');

describe('the query function', () => {
  test('should call `describeTable` internally', async () => {
    const mockDescribeTable = jest.fn().mockResolvedValue({});
    const { describeTable } = createDescribers({ describeTable: mockDescribeTable });
    await describeTable();
    expect(mockDescribeTable).toHaveBeenCalled();
  });
});

describe('the describeTableFor function', () => {
  test('should add `TableName` automatically to any request', async () => {
    const mockDescribeTable = jest.fn().mockResolvedValue({});
    const { describeTableFor } = createDescribers({ describeTable: mockDescribeTable });
    await describeTableFor('some_table')();
    expect(mockDescribeTable).toHaveBeenCalledWith(
      expect.objectContaining({
        TableName: 'some_table',
      })
    );
  });
});
