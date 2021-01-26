'use strict';
const createInserter = require('./insert');

describe('the insert function', () => {
  test('should call `putItem` internally', async () => {
    const mockRequest = { promise: jest.fn().mockResolvedValue({}) };
    const mockPutItem = jest.fn().mockReturnValue(mockRequest);
    const { insert } = createInserter({ putItem: mockPutItem });
    await insert();
    expect(mockPutItem).toHaveBeenCalled();
  });

  test('should generate an `Item` out of first argument', async () => {
    const mockRequest = { promise: jest.fn().mockResolvedValue({}) };
    const mockPutItem = jest.fn().mockReturnValue(mockRequest);
    const { insert } = createInserter({ putItem: mockPutItem });
    await insert({ foo: 'bar' });
    expect(mockPutItem).toHaveBeenCalledWith({
      Item: { foo: { S: 'bar' } }
    });
  });

  test('should respect `Item` if present on first argument', async () => {
    const mockRequest = { promise: jest.fn().mockResolvedValue({}) };
    const mockPutItem = jest.fn().mockReturnValue(mockRequest);
    const { insert } = createInserter({ putItem: mockPutItem });
    await insert({ Item: { foo: 'bar' } });
    expect(mockPutItem).toHaveBeenCalledWith({
      Item: { foo: { S: 'bar' } }
    });
  });

  test('should merge first pair of provided arguments', async () => {
    const mockRequest = { promise: jest.fn().mockResolvedValue({}) };
    const mockPutItem = jest.fn().mockReturnValue(mockRequest);
    const { insert } = createInserter({ putItem: mockPutItem });
    await insert({ foo: 'bar' }, { TableName: 'some_table' });
    expect(mockPutItem).toHaveBeenCalledWith({
      Item: { foo: { S: 'bar' } },
      TableName: 'some_table'
    });
  });
});

describe('the insertFor function', () => {
  test('should add `TableName` automatically to any request', async () => {
    const mockRequest = { promise: jest.fn().mockResolvedValue({}) };
    const mockPutItem = jest.fn().mockReturnValue(mockRequest);
    const { insertFor } = createInserter({ putItem: mockPutItem });
    await insertFor('some_table')({});
    expect(mockPutItem).toHaveBeenCalledWith(
      expect.objectContaining({
        TableName: 'some_table'
      })
    );
  });
});
