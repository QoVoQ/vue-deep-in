let originalLog = console.log;
let originalError = console.error;

beforeEach(() => {
  console.log = jest.fn();
  console.log = jest.fn();
});

afterEach(() => {
  console.log = originalLog;
  console.error = originalLog;
});
