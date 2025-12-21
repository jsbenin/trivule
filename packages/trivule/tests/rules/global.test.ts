import { describe, it, expect, beforeEach, test } from 'vitest';
import {
  size,
  between,
  required,
  regex,
  inInput,
  only,
  minDigitRule,
  maxDigitRule,
  digitRule,
  equals,
  notEquals,
  same,
  requiredIf,
} from '../../src/rules';
import { JSDOM } from 'jsdom';

describe('required', () => {
  it('should return false for undefined input', () => {
    expect(required(undefined).passes).toBe(false);
  });

  it('should return false for null input', () => {
    expect(required(null).passes).toBe(false);
  });

  it('should return false for empty string input', () => {
    expect(required('').passes).toBe(false);
  });

  it('should return true for non-empty string input', () => {
    expect(required('hello').passes).toBe(true);
  });
});

describe('equals', () => {
  it('should return true when input equals the provided string param', () => {
    expect(equals('admin', 'admin').passes).toBe(true);
  });

  it('should return true when input numeric equals the provided numeric string param', () => {
    expect(equals(50, '50').passes).toBe(true);
  });

  it('should return false when values are different', () => {
    expect(equals('user', 'admin').passes).toBe(false);
    expect(equals(49, 50).passes).toBe(false);
  });

  it('should throw an error when parameter is missing or invalid', () => {
    expect(() => equals('x')).toThrow();
  });
});

describe('notEquals', () => {
  it('should return true when values are different', () => {
    expect(notEquals('user', 'admin').passes).toBe(true);
    expect(notEquals(49, 50).passes).toBe(true);
  });

  it('should return false when input equals the provided string param', () => {
    expect(notEquals('admin', 'admin').passes).toBe(false);
  });

  it('should return false when input numeric equals the provided numeric string param', () => {
    expect(notEquals(50, '50').passes).toBe(false);
  });

  it('should throw an error when parameter is missing or invalid', () => {
    expect(() => notEquals('x')).toThrow();
  });
});

describe('between rule', () => {
  it('should return true if the input is between min and max', () => {
    expect(
      between('2010-11-05 23:00', '2010-11-05 22:58,2010-11-06', 'date').passes,
    ).toBe(true); // date comparison
    expect(between('5', ' 5, 5', 'number').passes).toBe(true); // compare number
    expect(between('-5m', '0,4').passes).toBe(true); // compare string length
  });

  it('should return false if the input is not between min and max', () => {
    expect(between(5, '0,4', 'number').passes).toBe(false);
    expect(between(-5, '0,4', 'number').passes).toBe(false);
    expect(between('-5', '0,4', 'number').passes).toBe(false);
  });
});

describe('size', () => {
  it('should return true for a file with size less than or equal to the specified maxSize', () => {
    const file1 = new File(['test'], 'file1.txt', { type: 'text/plain' });

    // Test with maxSize in KB
    expect(size(file1, '1KB').passes).toBe(true);
  });

  it('should return true for a non-file input with length equal to the specified maxSize', () => {
    // Test with string input
    expect(size('test', '5').passes).toBe(false);
    expect(size('test', '4').passes).toBe(true);
  });

  it('should throw an error for an invalid maxSize format', () => {
    const file1 = new File(['test'], 'file1.txt', { type: 'text/plain' });

    // Test with invalid format
    expect(() => size(file1, '1XYZ').passes).toThrowError();
    expect(() => size(file1, '5').passes).toThrowError();
  });
});

describe('regex', () => {
  test('returns true if the input matches the regex pattern', () => {
    const pattern = '^[A-Z]+$';
    const input = 'ACB';
    expect(regex(input, pattern).passes).toBe(true);
  });

  test('returns true if the input matches the regex pattern with &pip;', () => {
    const pattern = '^(Js&pip;Ts)$'; // &pip; will be replaced with |
    const input = 'Js';
    expect(regex(input, pattern).passes).toBe(true);
  });

  test('returns false if the input does not match the regex pattern', () => {
    const pattern = '^[A-Za-z]$';
    const input = 'abc123';
    expect(regex(input, pattern).passes).toBe(false);
  });

  test('throws an error if an invalid regex string is provided', () => {
    const pattern = 'abc[';
    const input = 'abcdef';
    expect(() => {
      regex(input, pattern);
    }).toThrow();
  });
});

describe('inInput rule callback', () => {
  it('should return true if the input is in the list', () => {
    const input = 'active';
    const params = 'active, inactive, suspended';
    const result = inInput(input, params).passes;
    expect(result).toBe(true);
  });

  it('should return false if the input is not in the list', () => {
    const input = 'pending';
    const params = 'active, inactive, suspended';
    const result = inInput(input, params).passes;
    expect(result).toBe(false);
  });

  it('should throw an error if params argument is empty', () => {
    const input = 'active';
    const params = '';
    expect(() => inInput(input, params)).toThrow();
  });
});

describe('only', () => {
  test('should return true if input is a string without any number', () => {
    expect(only('Hello', 'string').passes).toBe(true);
    expect(only('*Tr-ivule#', 'string').passes).toBe(true);
  });

  test('should return false if input is a string with numbers', () => {
    expect(only('Hello123', 'string').passes).toBe(false);
    expect(only('Trivule123', 'string').passes).toBe(false);
  });

  test('should return false if input is not a string', () => {
    expect(only(123, 'string').passes).toBe(false);
    expect(only(null, 'string').passes).toBe(false);
    expect(only(undefined, 'string').passes).toBe(false);
    expect(only(true, 'string').passes).toBe(false);
  });

  test('should return true if input is a number', () => {
    expect(only(123, 'digit').passes).toBe(true);
    expect(only(0, 'digit').passes).toBe(true);
    expect(only('0098', 'digit').passes).toBe(true);
  });

  test('should return false if input is not a number', () => {
    expect(only('Hello', 'number').passes).toBe(false);
    expect(only(null, 'number').passes).toBe(false);
    expect(only(undefined, 'number').passes).toBe(false);
    expect(only(true, 'number').passes).toBe(false);
  });

  test('should return false for invalid parameter', () => {
    expect(only('Hello', 'invalid').passes).toBe(false);
    expect(only(123, 'invalid').passes).toBe(false);
  });
});

describe('min_digitRule', () => {
  it('should return true when input is a number with digits greater than or equal to minDigitCount', () => {
    expect(minDigitRule(12345, 5).passes).toBe(true);
    expect(minDigitRule(123, 3).passes).toBe(true);
    expect(minDigitRule(0, 1).passes).toBe(true);
  });

  it('should return false when input is not a number', () => {
    expect(minDigitRule('abc', 2).passes).toBe(false);
    expect(minDigitRule(true, 1).passes).toBe(false);
  });

  it('should return false when input is a number with digits less than minDigitCount', () => {
    expect(minDigitRule(123, 4).passes).toBe(false);
    expect(minDigitRule(5, 2).passes).toBe(false);
  });

  it('should throw an error if minDigitCount is not a number', () => {
    expect(() => minDigitRule(123, 'abc')).toThrowError(
      'Min_digit rule parameter must be a number',
    );
  });
});

describe('maxDigitRule', () => {
  it('should return true when input is a number with digits less than or equal to maxDigitCount', () => {
    expect(maxDigitRule(12345, 5).passes).toBe(true);
    expect(maxDigitRule(123, 3).passes).toBe(true);
    expect(maxDigitRule(0, 1).passes).toBe(true);
  });

  it('should return false when input is not a number', () => {
    expect(maxDigitRule('abc', 2).passes).toBe(false);
    expect(maxDigitRule(true, 1).passes).toBe(false);
  });

  it('should return false when input is a number with digits greater than maxDigitCount', () => {
    expect(maxDigitRule(123, 2).passes).toBe(false);
    expect(maxDigitRule(12345, 4).passes).toBe(false);
  });

  it('should throw an error if maxDigitCount is not a number', () => {
    expect(() => maxDigitRule(123, 'abc')).toThrowError(
      'Max_digit rule parameter must be a number',
    );
  });
});

describe('digitRule', () => {
  it('should return true when input is a number with digits equal to digitCount', () => {
    expect(digitRule(12345678, 8).passes).toBe(true);
    expect(digitRule(98765432, 8).passes).toBe(true);
    expect(digitRule(0, 1).passes).toBe(true);
  });

  it('should return false when input is not a number', () => {
    expect(digitRule('abc', 3).passes).toBe(false);
    expect(digitRule(true, 1).passes).toBe(false);
  });

  it('should return false when input is a number with digits not equal to digitCount', () => {
    expect(digitRule(123, 4).passes).toBe(false);
    expect(digitRule(12345, 6).passes).toBe(false);
  });

  it('should throw an error if digitCount is not a number', () => {
    expect(() => digitRule(123, 'abc')).toThrowError(
      'Digit rule parameter must be a number',
    );
  });
});

describe('same rule', () => {
  let dom: JSDOM;
  let form: HTMLFormElement;
  let input1: HTMLInputElement;
  let input2: HTMLInputElement;

  beforeEach(() => {
    dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    global.document = dom.window.document as any;
    global.window = dom.window as any;
    global.HTMLElement = dom.window.HTMLElement as any;

    form = document.createElement('form');
    input1 = document.createElement('input');
    input1.name = 'password';
    input1.value = 'secret123';

    input2 = document.createElement('input');
    input2.name = 'password_confirmation';

    form.appendChild(input1);
    form.appendChild(input2);
    document.body.appendChild(form);
  });

  it('should pass when values are identical', () => {
    const result = same('secret123', 'password', 'text', input2);
    expect(result.passes).toBe(true);
  });

  it('should fail when values are different', () => {
    const result = same('different', 'password', 'text', input2);
    expect(result.passes).toBe(false);
  });

  it('should fail when target element does not exist', () => {
    const result = same('secret123', 'non_existent', 'text', input2);
    expect(result.passes).toBe(false);
  });

  it('should throw error when otherField argument is missing', () => {
    expect(() => same('secret123', undefined as any, 'text', input2)).toThrow();
  });
});

describe('required_if rule', () => {
  let dom: JSDOM;
  let form: HTMLFormElement;
  let otherInput: HTMLInputElement;
  let mainInput: HTMLInputElement;

  beforeEach(() => {
    dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    global.document = dom.window.document as any;
    global.window = dom.window as any;
    global.HTMLElement = dom.window.HTMLElement as any;

    form = document.createElement('form');

    otherInput = document.createElement('input');
    otherInput.name = 'type';
    otherInput.value = 'company';

    mainInput = document.createElement('input');
    mainInput.name = 'vat_number';

    form.appendChild(otherInput);
    form.appendChild(mainInput);
    document.body.appendChild(form);
  });

  it('should fail if condition is met and input is empty', () => {
    const result = requiredIf('', 'type,company', 'text', mainInput);
    expect(result.passes).toBe(false);
  });

  it('should pass if condition is met and input is not empty', () => {
    const result = requiredIf(
      'CHE-123.456.789',
      'type,company',
      'text',
      mainInput,
    );
    expect(result.passes).toBe(true);
  });

  it('should pass if condition is NOT met and input is empty', () => {
    otherInput.value = 'individual';
    const result = requiredIf('', 'type,company', 'text', mainInput);
    expect(result.passes).toBe(true);
  });

  it('should support multiple values for the condition', () => {
    // Test with first value
    otherInput.value = 'val1';
    let result = requiredIf('', 'type,val1,val2', 'text', mainInput);
    expect(result.passes).toBe(false);

    // Test with second value
    otherInput.value = 'val2';
    result = requiredIf('', 'type,val1,val2', 'text', mainInput);
    expect(result.passes).toBe(false);

    // Test with non-matching value
    otherInput.value = 'other';
    result = requiredIf('', 'type,val1,val2', 'text', mainInput);
    expect(result.passes).toBe(true);
  });

  it('should throw error if params are missing', () => {
    expect(() =>
      requiredIf('', undefined as any, 'text', mainInput),
    ).toThrow();
  });
});
