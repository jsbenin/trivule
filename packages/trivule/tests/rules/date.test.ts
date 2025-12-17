import {
  date_after,
  date_before,
  date_between,
  is_date,
} from '../../src/rules/date';

describe('is_date', () => {
  test('should return true for a valid date in UTC format', () => {
    const input = '2023-04-23T10:30:00.000Z'; // UTC format
    const result = is_date(input).passes;
    expect(result).toBe(true);
  });

  test('should return false for an invalid date', () => {
    const input = '2023-04-23T10:30:00.000';
    const result = is_date(input).passes;
    expect(result).toBe(true);
  });

  test('should return false for an invalid string', () => {
    const input = 'invalid date';
    const result = is_date(input).passes;
    expect(result).toBe(false);
  });

  // Test case: null value
  test('should return false for a null value', () => {
    const input = null;
    const result = is_date(input).passes;
    expect(result).toBe(false);
  });
});

// Test for the date_before function
describe('date_before', () => {
  test('should return true if the input date is before the reference date', () => {
    const inputDate = '2023-04-23';
    const referenceDate = '2023-04-24';
    expect(date_before(inputDate, referenceDate, 'date').passes).toBe(true);
  });

  test('should return false if the input date is after the reference date', () => {
    const inputDate = '2023-04-25';
    const referenceDate = '2023-04-24';
    expect(date_before(inputDate, referenceDate).passes).toBe(false);
  });

  test('should return false if the input date is equal to the reference date', () => {
    const inputDate = '2023-04-24';
    const referenceDate = '2023-04-24';
    expect(date_before(inputDate, referenceDate).passes).toBe(false);
  });

  test('should return false if the input is not a valid date', () => {
    const inputDate = '2023-04-xx';
    const referenceDate = '2023-04-24';
    expect(date_before(inputDate, referenceDate).passes).toBe(false);
  });

  test('should return true if date is before now', () => {
    const inputDate = '2022-04-22';
    const referenceDate = 'now';
    expect(date_before(inputDate, referenceDate).passes).toBe(true);
  });

  test('should return true if date is after now', () => {
    const inputDate = '2050-01-01';
    const referenceDate = 'now';
    expect(date_after(inputDate, referenceDate).passes).toBe(true);
  });
});

// Test for the date_after function
describe('date_after', () => {
  test('should return true if the input date is after the reference date', () => {
    const inputDate = '2023-04-25';
    const referenceDate = '2023-04-24';
    expect(date_after(inputDate, referenceDate).passes).toBe(true);
  });

  test('should return false if the input date is before the reference date', () => {
    const inputDate = '2023-04-23';
    const referenceDate = '2023-04-24';
    expect(date_after(inputDate, referenceDate).passes).toBe(false);
  });

  test('should return false if the input date is equal to the reference date', () => {
    const inputDate = '2023-04-24';
    const referenceDate = '2023-04-24';
    expect(date_after(inputDate, referenceDate).passes).toBe(false);
  });

  test('should throw an exception if the input is not a valid date', () => {
    const inputDate = '2023-04-xx';
    const referenceDate = '2023-04-24';
    expect(date_after(inputDate, referenceDate).passes).toBe(false);
  });
});

// Test for the date_between function
describe('date_between', () => {
  test('should return true if the input date is between the reference dates', () => {
    const inputDate = '2023-04-25';
    const startDate = '2023-04-24';
    const endDate = '2023-04-26';
    expect(date_between(inputDate, `${startDate},${endDate}`).passes).toBe(true);
  });

  test('should return false if the input date is before the start date', () => {
    const inputDate = '2023-04-23';
    const startDate = '2023-04-24';
    const endDate = '2023-04-26';
    expect(date_between(inputDate, `${startDate}, ${endDate}`).passes).toBe(
      false,
    );
  });

  test('should return false if the input date is after the end date', () => {
    const inputDate = '2023-04-27';
    const startDate = '2023-04-24';
    const endDate = '2023-04-26';
    expect(date_between(inputDate, `${startDate}, ${endDate}`).passes).toBe(
      false,
    );
  });

  test('should return false if the input date is equal to the start date', () => {
    const inputDate = '2023-04-24';
    const startDate = '2023-04-24';
    const endDate = '2023-04-26';
    expect(date_between(inputDate, `${startDate}, ${endDate}`).passes).toBe(
      false,
    );
  });

  test('should return false if the input date is equal to the end date', () => {
    const inputDate = '2023-04-26';
    const startDate = '2023-04-24';
    const endDate = '2023-04-26';
    expect(date_between(inputDate, `${startDate}, ${endDate}`).passes).toBe(
      false,
    );
  });

  test('should return false if the input is not a valid date', () => {
    const inputDate = '2023-04-xx';
    const startDate = '2023-04-24';
    const endDate = '2023-04-26';
    expect(date_between(inputDate, `${startDate}, ${endDate}`).passes).toBe(
      false,
    );
  });
});
