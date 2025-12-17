import { max_length, min_length } from './string';
import { isFile, maxFileSize, minFileSize } from './file';
import { spliteParam } from '../utils';
import { RuleCallBack } from '../types';
/**
 * When the value is a number, it checks whether the input value is greater than or equal to min
 * When the value is a character string, it checks whether the number of characters is greater than or equal to min
 * @param input - The input to check.
 * @param min - The minimum length.
 * @example
 *  ```html
 *  <input tr-rules="min:2"/>
 * ```
 */
export const min_rule: RuleCallBack = (input, min, type) => {
  if (!is_number(min).passes) {
    throw new Error('Min_rule parameter must be an integer');
  }
  if (isFile(input).passes || type == 'file') {
    return {
      passes: minFileSize(input, min, type).passes,
      value: input,
    };
  }
  if (input === undefined || input === null) {
    input = 0;
  }

  if (is_number(input).passes) {
    return {
      passes: Number(input) >= Number(min),
      value: Number(input),
    };
  } else {
    return {
      passes: min_length(input, min).passes,
      value: input,
      alias: 'minlength',
    };
  }
};
/**
 * When the value is a number, it checks whether the input value is less than or equal to max
 * When the value is a character string, it checks whether the number of characters is less than or equal to max
 *
 * @param input - The input to check.
 * @param max - The maximum length.
 *  @example
 *  ```html
 *  <input tr-rules="max:20"/>
 * ```
 */
export const max_rule: RuleCallBack = (input, max, type) => {
  if (!is_number(max).passes) {
    throw new Error('Max_rule parameter must be an integer');
  }
  if (isFile(input).passes || type == 'file') {
    return {
      passes: maxFileSize(input, max).passes,
      value: input,
      alias: 'maxFileSize',
    };
  }

  if (input === undefined || input === null) {
    input = 0;
  }
  if (is_number(input).passes) {
    return {
      passes: Number(input) <= Number(max),
      value: Number(input),
    };
  } else {
    return {
      passes: max_length(input, max).passes,
      value: input,
      alias: 'maxlength',
    };
  }
};

/**
 * Checks if the input is an integer. It has alias (int)
 *
 * @param input - The input to check.
 * ```html
 *  <input tr-rules="integer"/> or
 *  <input tr-rules="int"/>
 * ```
 */
export const integer: RuleCallBack = (input) => {
  const numberRule = is_number(input);
  if (numberRule.passes) {
    const passes = Number.isInteger(numberRule.value);
    return {
      passes: passes,
      value: passes ? parseInt(numberRule.value as string) : input,
      type: numberRule.type,
    };
  }
  return {
    passes: false,
    value: input,
  };
};

/**
 * Checks if the input is a number.
 *
 * @param input - The input to check.
 * ```html
 *  <input tr-rules="number"/>
 * ```
 */
export const is_number: RuleCallBack = (input) => {
  if (input === '' || input === null || input === undefined) {
    return {
      passes: false,
      value: input,
    };
  }

  if (input === '0' || input === 0) {
    return {
      passes: true,
      value: 0,
      type: 'number',
    };
  }

  if (input === '1' || input === 1) {
    return {
      passes: true,
      value: 1,
      type: 'number',
    };
  }
  return {
    passes:
      !isNaN(Number(input)) &&
      typeof input !== 'boolean' &&
      typeof input !== 'object',
    value: Number(input),
    type: 'number',
  };
};

/**
 * Checks whether a number is a multiple or divisible by another number. Has alias (mod)
 * @param input - The input to check.
 * ```html
 *  <input tr-rules="modulo:2"/>
 * <input tr-rules="mod:2"/>
 * ```
 */
export const modulo: RuleCallBack = (input, mod) => {
  if (!is_number(mod).passes) {
    throw new Error('Modulo rule parameter must be an integer');
  }

  if (is_number(input).passes) {
    return {
      passes: Number(input) % Number(mod) === 0,
      value: Number(input),
    };
  }

  return {
    passes: false,
    value: input,
  };
};

/**
 * Checks whether the input is less than the specified value.
 *
 * @param input - The input to check.
 * @param threshold - The threshold value.
 * @example
 * ```html
 * <input tr-rules="lessThan:10"/>
 * ```
 */
export const less_than: RuleCallBack = (input, threshold) => {
  if (!is_number(threshold).passes) {
    throw new Error('Less_than rule parameter must be a number');
  }

  if (is_number(input).passes) {
    return {
      passes: Number(input) < Number(threshold),
      value: input,
    };
  }

  return {
    passes: false,
    value: input,
  };
};

/**
 * Checks whether the input is greater than the specified value.
 *
 * @param input - The input to check.
 * @param threshold - The threshold value.
 * @example
 * ```html
 * <input tr-rules="greaterThan:5"/>
 * ```
 */
export const greater_than: RuleCallBack = (input, threshold) => {
  if (!is_number(threshold).passes) {
    throw new Error('Greater_than rule parameter must be a number');
  }

  if (is_number(input).passes) {
    return {
      passes: Number(input) > Number(threshold),
      value: input,
    };
  }

  return {
    passes: false,
    value: input,
  };
};

/**
 * Checks if the input number is between the specified minimum and maximum values.
 *
 * @param input - The input to check.
 * @param params - String separated  by comma (,)
 * @example
 * ```html
 * <input data-tr-rules="numberBetween:1,10"/>
 * ```
 */
export const number_between: RuleCallBack = (input, params) => {
  if (!is_number(input).passes) {
    return {
      passes: false,
      value: input,
    };
  }

  const [min, max] = spliteParam(params as string);
  const inputValue = Number(input);

  const passes = min_rule(input, min).passes && max_rule(input, max).passes;
  return {
    passes: passes,
    value: inputValue,
  };
};
