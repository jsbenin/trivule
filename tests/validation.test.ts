import { TrValidation } from '../src/core/validate';
import { InputRule } from '../src/core/utils/input-rule';
import { TrParameter } from '../src/core/utils/parameter';

describe('TrValidation', () => {
  let trvalidation: TrValidation;
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
      undefined,
      parameter.ruleRegistry,
    );
    trvalidation = new TrValidation();
  });

  test('validate() should return false for an invalid value', () => {
    const isValid = trvalidation.validate(inputRule.all(), '');
    expect(isValid).toBe(false);
  });

  test('Validation failed messages', () => {
    trvalidation.validate(inputRule.all(), '');
    const received = trvalidation.getErrors();
    expect(received).toEqual({
      required: 'This field is required',
    });
  });

  test('validate() should work with different rules', () => {
    const newInputRule = new InputRule(
      ['minlength:8'],
      {
        minlength: 'The input must be at least 8 characters long',
      },
      undefined,
      parameter.ruleRegistry,
    );
    const isValid = trvalidation.validate(newInputRule.all(), 'short');
    expect(isValid).toBe(false);

    const rules = newInputRule.all().map((rule) => {
      return {
        name: rule.name,
        param: rule.params,
      };
    });

    expect(rules).toEqual([
      {
        name: 'minlength',
        param: '8',
      },
    ]);
  });
});
