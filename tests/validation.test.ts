import { TrValidation } from '../src/core/validate';
import { InputRule } from '../src/core/utils/input-rule';
import { TrParameter } from '../src/core/utils/parameter';

describe('TrValidation', () => {
  let trvalidation: TrValidation;
  let parameter: TrParameter;

  beforeEach(() => {
    parameter = TrParameter.instance();
    const inputRule = new InputRule(
      ['required', 'email'],
      {
        required: 'This field is required',
        email: 'Invalid email format',
      },
      undefined,
      parameter.ruleRegistry,
    );
    trvalidation = new TrValidation();
    trvalidation.setRules(inputRule);
  });

  test('validate() should return false for an invalid value', () => {
    trvalidation.value = '';
    const isValid = trvalidation.passes();
    expect(isValid).toBe(false);
  });

  test('Validation failed messages', () => {
    trvalidation.value = '';
    const received = trvalidation.getErrors();
    expect(received).toEqual({
      required: 'This field is required',
    });
  });

  test('setRules() should update the rules', () => {
    trvalidation.setRules(
      new InputRule(
        ['minlength:8'],
        {
          minlength: 'The input must be at least 8 characters long',
        },
        undefined,
        parameter.ruleRegistry,
      ),
    );
    const rules = trvalidation.getRules().map((rule) => {
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
