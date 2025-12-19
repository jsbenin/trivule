import { RuleCallBack } from '../types';
import { now, spliteParam, throwEmptyArgsException } from '../utils';
/**
 * This is a callback function that checks if the input is a valid date.
 *
 * @param input The input string to be validated.
 * @example
 * ```html
 * <input type="date-local" @v:rules="date" />
 * ```
 */
export const isDate: RuleCallBack = (input) => {
  if (!input) {
    return {
      passes: false,
      value: input,
    };
  }
  const date = new Date(input.toString());
  const isValid = !isNaN(date.getTime());

  if (isValid) {
    return {
      passes: true,
      value: date.toISOString(),
      type: 'date',
    };
  }
  return {
    passes: false,
    value: input,
  };
};

/**
 * Checks whether a given date is before another date.
 *
 * @param input - The date to check, as a string in ISO 8601 format or a `Date` object.
 * @param date - The date to compare against, as a string in ISO 8601 format or the string "now" to use the current date and time. It can take the `now` value
 *   @example
 * ```html
 * <input type="date-local" @v:rules="before:2020-11-11" />
 * ```
 */
export const dateBefore: RuleCallBack = (input, date) => {
  if (date === 'now') {
    date = now();
  }
  if (!isDate(input).passes) {
    return {
      passes: false,
      value: input,
    };
  }

  if (!isDate(date).passes) {
    throw new Error('Pease provide a valid argument for dateBefore rule');
  }
  return {
    passes:
      new Date(input as string).getTime() < new Date(date as string).getTime(),
    value: input,
  };
};

/**
 * Checks whether a given date is after another date.
 *
 * @param input - The date to check, as a string in ISO 8601 format or a `Date` object.
 * @param date - The date to compare against, as a string in ISO 8601 format or the string "now" to use the current date and time. date can be `now
 * @example
 * ```js
 *  {
 *    rules:['after:now']
 * }
 * ```
 * ```html
 * <input @v:rules="after:now" />
 * ```
 */
export const dateAfter: RuleCallBack = (input, date) => {
  if (date === 'now') {
    date = now();
  }

  if (!isDate(input).passes) {
    return {
      passes: false,
      value: input,
    };
  }

  if (!isDate(date).passes) {
    throw new Error('Pease provide a valid argument for dateAfter rule');
  }
  return {
    passes:
      new Date(input as string).getTime() > new Date(date as string).getTime(),
    value: isDate(input).value,
  };
};

/**
 * Checks whether a given date is between two other dates.
 *
 * @param input - The date to check, as a string in ISO 8601 format or a `Date` object.
 * @param date - The range of dates to compare against, as a string in the format "startDate,endDate", where startDate and endDate are strings in ISO 8601 format or the string "now" to use the current date and time.
 *  ```html
 * <input type="date-local" @v:rules="date_between:2020-11-11,now" />
 * ```
 * @throws An exception with the message "Missing required argument: dateBetween" if the `date` parameter is falsy.
 */
export const dateBetween: RuleCallBack = (input, date) => {
  if (!date) {
    throwEmptyArgsException('dateBetween');
  }
  const [startDate, endDate] = spliteParam(date as string);
  return {
    passes:
      dateAfter(input, startDate).passes && dateBefore(input, endDate).passes,
    value: input,
  };
};

/**
 * Checks whether a given string represents a valid time in 24-hour format.
 *
 * @param input - The string to check.
 * @example
 * ```js
 * {
 *    rules:['time']
 * }
 * ```
 * ```html
 * <input @v:rules="time" />
 * ```
 *
 */
export const isTime: RuleCallBack = (input) => {
  if (typeof input !== 'string') {
    return {
      passes: false,
      value: input,
    };
  }
  // If the input does not have three parts separated by colons (H:m:i)
  if (input.toString().split(':').length < 3) {
    // Complete the input with ":00" until it has the format H:m:i
    while (input.split(':').length < 3) {
      input += ':00';
    }
  }
  return {
    passes: /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(input),
    value: input,
  };
};
