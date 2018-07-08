import HttpTriggerJS from '.';

test('HttpTriggerJS should return 400 when `name` not provided', () => {
  let context = { log: jest.fn(), done: jest.fn() };
  let request = { query: {} };
  HttpTriggerJS(context, request);

  expect(context).toMatchSnapshot();
  expect(context.done).toHaveBeenCalledTimes(1);
});

test('HttpTriggerJS should accept `name` in query string', () => {
  let context = { log: jest.fn(), done: jest.fn() };
  let request = { query: { name: 'Kennie' } };
  HttpTriggerJS(context, request);

  expect(context).toMatchSnapshot();
  expect(context.done).toHaveBeenCalledTimes(1);
});

test('HttpTriggerJS should accept `name` in body', () => {
  let context = { log: jest.fn(), done: jest.fn() };
  let request = { query: {}, body: { name: 'Kennie' } };
  HttpTriggerJS(context, request);

  expect(context).toMatchSnapshot();
  expect(context.done).toHaveBeenCalledTimes(1);
});
