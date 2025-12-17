import { contains, end_with, start_with, length } from '../../src/rules';
import {
  email,
  excludes,
  max_length,
  min_length,
  password_rule,
  start_with_string,
  end_with_string,
  start_with_lower,
  start_with_upper,
  string_between,
  url,
} from '../../src/rules/string';
//Email
describe('email rule', () => {
  test('should return true for valid email', () => {
    const validEmails = [
      'test@example.com',
      'test123@example.co.uk',
      'test+123@example.net',
      'test.123@example.io',
      'test-123@example.info',
    ];
    validEmails.forEach((em) => {
      expect(email(em).passes).toBe(true);
    });
  });

  test('should return false for invalid email', () => {
    const invalidEmails = [
      '',
      'test@',
      'test@example',
      'test@example.',
      'test@.com',
      'test@..com',
      'test@example..com',
      'test@ex ample.com',
    ];
    invalidEmails.forEach((em) => {
      expect(email(em).passes).toBe(false);
    });
  });
});
//min_length
describe('min_length rule', () => {
  it('should return false if input is undefined', () => {
    expect(min_length(undefined, '5').passes).toBe(false);
  });

  it('should return false if input is null', () => {
    expect(min_length(null, '5').passes).toBe(false);
  });

  it('should return false if input is an empty string', () => {
    expect(min_length('', '5').passes).toBe(false);
  });

  it('should return false if input is shorter than the minimum length', () => {
    expect(min_length('hello', '10').passes).toBe(false);
  });

  it('should return true if input is longer than the minimum length', () => {
    expect(min_length('hello world', '5').passes).toBe(true);
  });

  it('should return true if input is exactly the minimum length', () => {
    expect(min_length('hello', '5').passes).toBe(true);
  });
});

//max_length
test('max_length should return true for a string input shorter than the max length', () => {
  expect(max_length('hello', '10').passes).toBe(true);
});

test('max_length should return false for a string input longer than the max length', () => {
  expect(max_length('Long string', '5').passes).toBe(false);
});

test('max_length should return true for null or undefined input', () => {
  expect(max_length(null, '0').passes).toBe(true);
  expect(max_length(undefined, '0').passes).toBe(true);
});

describe('url validation', () => {
  test('should return true when given a valid url starting with http', () => {
    expect(url('http://www.example.com').passes).toBe(true);
  });

  test('should return true when given a valid url starting with https', () => {
    expect(url('https://www.example.com').passes).toBe(true);
  });

  test('should return true when given a valid url starting with ftp', () => {
    expect(url('ftp://ftp.example.com').passes).toBe(true);
  });

  test('should return false when given an invalid url', () => {
    expect(url('example.com').passes).toBe(false);
  });
});

describe('start_with_upper', () => {
  test('should return true if input starts with uppercase', () => {
    expect(start_with_upper('Hello').passes).toBe(true);
    expect(start_with_upper('A').passes).toBe(true);
    expect(start_with_upper('Test123').passes).toBe(true);
  });

  test('should return false if input does not start with uppercase', () => {
    expect(start_with_upper('hello').passes).toBe(false);
    expect(start_with_upper('1test').passes).toBe(false);
    expect(start_with_upper(' test').passes).toBe(false);
  });

  test('should return false for empty input', () => {
    expect(start_with_upper('').passes).toBe(false);
  });

  test('should return false for non-string input', () => {
    expect(start_with_upper(123).passes).toBe(false);
    expect(start_with_upper(null).passes).toBe(false);
    expect(start_with_upper(undefined).passes).toBe(false);
    expect(start_with_upper(true).passes).toBe(false);
  });
});

describe('start_with_string', () => {
  test('should return true if input starts with letter', () => {
    expect(start_with_string('Hello').passes).toBe(true);
    expect(start_with_string('-test').passes).toBe(true);
  });

  test('should return false if input does not start with letter', () => {
    expect(start_with_string('1hello').passes).toBe(false);
    expect(start_with_string(' test').passes).toBe(false);
  });

  test('should return false for empty input', () => {
    expect(start_with_string('').passes).toBe(false);
  });

  test('should return false for non-string input', () => {
    expect(start_with_string(123).passes).toBe(false);
    expect(start_with_string(null).passes).toBe(false);
    expect(start_with_string(undefined).passes).toBe(false);
    expect(start_with_string(true).passes).toBe(false);
  });
});

describe('end_with_string', () => {
  test('should return true if input ends with letter', () => {
    expect(end_with_string('Hello').passes).toBe(true);
  });

  test('should return false if input does not end with letter', () => {
    expect(start_with_upper('hello1').passes).toBe(false);
    expect(start_with_upper('test-').passes).toBe(false);
    expect(start_with_upper('test ').passes).toBe(false);
  });

  test('should return false for empty input', () => {
    expect(end_with_string('').passes).toBe(false);
  });

  test('should return false for non-string input', () => {
    expect(end_with_string(123).passes).toBe(false);
    expect(end_with_string(null).passes).toBe(false);
    expect(end_with_string(undefined).passes).toBe(false);
    expect(end_with_string(true).passes).toBe(false);
  });
});

describe('start_with_lower', () => {
  test('should return true for valid input', () => {
    expect(start_with_lower('hello').passes).toBe(true);
    expect(start_with_lower('world').passes).toBe(true);
    expect(start_with_lower('*').passes).toBe(true);
    expect(start_with_lower('1').passes).toBe(true);
  });

  test('should return false for invalid input', () => {
    expect(start_with_lower('Hello').passes).toBe(false);
    expect(start_with_lower('World').passes).toBe(false);
    expect(start_with_lower(' ').passes).toBe(false);
    expect(start_with_lower('').passes).toBe(false);
    expect(start_with_lower(null).passes).toBe(false);
    expect(start_with_lower(undefined).passes).toBe(false);
    expect(start_with_lower(123).passes).toBe(false);
  });
});

describe('Password Rule', () => {
  it('should return true for valid password', () => {
    const password = 'Abc12345@';
    const result = password_rule(password).passes;
    expect(result).toBe(true);
  });

  it('should return false for password with less than 8 characters', () => {
    const password = 'Abc123@';
    const result = password_rule(password).passes;
    expect(result).toBe(false);
  });

  it('should return false for password without uppercase letter', () => {
    const password = 'abc12345@';
    const result = password_rule(password).passes;
    expect(result).toBe(false);
  });

  it('should return false for password without lowercase letter', () => {
    const password = 'ABC12345@';
    const result = password_rule(password).passes;
    expect(result).toBe(false);
  });

  it('should return false for password without digit', () => {
    const password = 'Abcdefgh@';
    const result = password_rule(password).passes;
    expect(result).toBe(false);
  });

  it('should return false for password without special character', () => {
    const password = 'Abc12345';
    const result = password_rule(password).passes;
    expect(result).toBe(false);
  });
});

describe('start_with function', () => {
  it('should return true if the input starts with the prefix', () => {
    const input = 'hello world';
    const prefix = 'hello';
    const result = start_with(input, prefix).passes;
    expect(result).toBe(true);
  });

  it('should return false if the input does not start with the prefix', () => {
    const input = 'hello world';
    const prefix = 'world';
    const result = start_with(input, prefix).passes;
    expect(result).toBe(false);
  });

  it('should return false if the input is not a string or an array', () => {
    const input = { foo: 'bar' };
    const prefix = 'foo';
    const result = start_with(input, prefix).passes;
    expect(result).toBe(false);
  });
});

describe('end_with', () => {
  it('should return true if input string ends with suffix', () => {
    expect(end_with('hello world', 'world').passes).toBe(true);
    expect(end_with('hello world!', '!').passes).toBe(true);
    expect(end_with('hello world', 'ld').passes).toBe(true);
  });

  it('should return false if input string/array does not end with suffix', () => {
    expect(end_with('hello world', 'hello').passes).toBe(false);
    expect(end_with('hello world', 'wolrd').passes).toBe(false);
  });

  it('should return false if input is not a string or an array', () => {
    expect(end_with(123, 'world').passes).toBe(false);
    expect(end_with(null, 'world').passes).toBe(false);
    expect(end_with(undefined, 'world').passes).toBe(false);
    expect(end_with({}, 'world').passes).toBe(false);
  });
});
describe('contains', () => {
  it('should return true when input contains substring', () => {
    expect(contains('Hello, world!', 'world').passes).toBe(true);
    expect(contains('Hello, world!', 'world,!').passes).toBe(true);
    expect(contains('Hello, world!', 'world,Others').passes).toBe(false);
  });

  it('should return false when input does not contain substring', () => {
    expect(contains('Hello, world!', 'foo').passes).toBe(false);
  });

  it('should return false when input is not a string or an array', () => {
    expect(contains(42, 'foo').passes).toBe(false);
    expect(contains('', 'foo').passes).toBe(false);
    expect(contains(undefined, 'foo').passes).toBe(false);
  });
});
describe('excludes', () => {
  it('should return true when input excludes substring', () => {
    expect(excludes('Hello, world!', 'sworld').passes).toBe(true);
  });

  it('should return false when input does not excludes substring', () => {
    expect(excludes('Hello, world! foo', 'foo').passes).toBe(false);
    expect(excludes('Hello, world! foo', '&esp;').passes).toBe(false);
  });

  it('should return true when input is not a string or an array', () => {
    expect(excludes(42, 'foo').passes).toBe(true);
    expect(excludes('', '&esp;').passes).toBe(true);
    expect(excludes(undefined, 'foo').passes).toBe(true);
  });
});
describe('length', () => {
  it('should return true if specified length matches', () => {
    expect(length(null, '0').passes).toBe(false);
    expect(length(undefined, '0').passes).toBe(false);
    expect(length(12345, '5').passes).toBe(true);
  });

  it('should throw an error if size argument is not a number', () => {
    expect(() => length('hello', 'invalid')).toThrow(
      'The length rule argument must be an integer',
    );
  });

  it('should return false for invalid input', () => {
    expect(length(true, '0').passes).toBe(false);
  });
});
describe('string_between', () => {
  it('should return true for string with length between min and max', () => {
    const result1 = string_between('hello', '2, 5').passes;
    expect(result1).toBe(true);
  });

  it('should return false for string with length not between min and max', () => {
    const result2 = string_between('hello', '6, 10').passes;
    expect(result2).toBe(false);
  });
});
