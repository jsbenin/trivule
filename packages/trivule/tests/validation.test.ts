import { validate } from '../src/core/validate';
import { InputRule } from '../src/core/utils/input-rule';
import { TrParameter } from '../src/core/utils/parameter';

describe('TrValidation', () => {
  let parameter: TrParameter;
  let inputRule: InputRule;

  beforeEach(() => {
    parameter = TrParameter.instance();
    inputRule = new InputRule(
      ['required', 'email'],
      {
        required: 'This field is required',
        email: 'Invalid email format',
      },
      parameter.ruleRegistry,
    );
  });

  test('validate() should return errors object for an invalid value', () => {
    const { valid, errors } = validate(inputRule.all(), '');
    expect(valid).not.toBe(true);
    expect(typeof errors).toBe('object');
    expect(errors).toHaveProperty('required');
    expect(errors).toHaveProperty('email');
  });

  test('Validation failed messages', () => {
    const { valid, errors } = validate(inputRule.all(), '');
    expect(errors).toEqual({
      required: 'This field is required',
      email: 'Invalid email format',
    });
  });

  test('validate() should work with different rules', () => {
    const newInputRule = new InputRule(
      ['min_length:8'],
      {
        min_length: 'The input must be at least 8 characters long',
      },
      parameter.ruleRegistry,
    );
    const {valid, errors } = validate(newInputRule.all(), 'short');
    expect(valid).not.toBe(true);
    expect(typeof errors).toBe('object');

    const rules = newInputRule.all().map((rule) => {
      return {
        name: rule.name,
        param: rule.params,
      };
    });

      expect(rules).toEqual([
        {
          name: 'min_length',
          param: '8',
        },
      ]);
  });
});
