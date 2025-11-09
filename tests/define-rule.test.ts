import { describe, it, expect, beforeEach } from 'vitest';
import { Trivule } from '../src/core/trivule';
import { TrivuleInput } from '../src/core/input';
import { attr } from '../src/utils';
import { JSDOM } from 'jsdom';
import { RuleParam } from '../src/types';

describe('defineRule', () => {
  let trivule: Trivule;
  let dom: JSDOM;

  beforeEach(() => {
    // Setup a basic DOM environment
    dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    global.document = dom.window.document as any;
    global.window = dom.window as any;
    global.CustomEvent = dom.window.CustomEvent as any;
    global.Element = dom.window.Element as any;
    global.HTMLElement = dom.window.HTMLElement as any;

    // Initialize Trivule instance with data-tr- prefix (JSDOM doesn't support colons in attribute names)
    trivule = Trivule.init({ attributePrefix: 'data-tr-' });
  });

  describe('Rule Registration', () => {
    it('should define a rule and register it in the parameter registry', () => {
      // Define a custom rule
      trivule.defineRule('customRule', (value) => ({
        passes: value === 'foo',
        value,
      }));

      // Verify the rule exists in the parameter registry
      expect(trivule.parameter.ruleRegistry.hasRule('customRule')).toBe(true);
    });

    it('should define a rule with a custom error message', () => {
      const customMessage = 'Value must be "foo"';

      // Define a custom rule with a message
      trivule.defineRule(
        'customRule',
        (value) => ({
          passes: value === 'foo',
          value,
        }),
        customMessage,
      );

      // Verify the rule exists
      expect(trivule.parameter.ruleRegistry.hasRule('customRule')).toBe(true);

      // Verify the custom message is registered
      const message = trivule.parameter.ruleRegistry.getMessage('customRule');
      expect(message).toBe(customMessage);
    });

    it('should define multiple rules independently', () => {
      // Define multiple custom rules
      trivule.defineRule('ruleOne', (value) => ({
        passes: value === 'one',
        value,
      }));
      trivule.defineRule('ruleTwo', (value) => ({
        passes: value === 'two',
        value,
      }));
      trivule.defineRule('ruleThree', (value) => ({
        passes: value === 'three',
        value,
      }));

      // Verify all rules exist
      expect(trivule.parameter.ruleRegistry.hasRule('ruleOne')).toBe(true);
      expect(trivule.parameter.ruleRegistry.hasRule('ruleTwo')).toBe(true);
      expect(trivule.parameter.ruleRegistry.hasRule('ruleThree')).toBe(true);
    });

    it('should override existing rule when defining with same name', () => {
      const firstCallback = (value: any) => ({
        passes: value === 'first',
        value,
      });
      const secondCallback = (value: any) => ({
        passes: value === 'second',
        value,
      });

      // Define a rule
      trivule.defineRule('testRule', firstCallback, 'First message');
      const firstRule = trivule.parameter.ruleRegistry.getRule('testRule');

      // Redefine the same rule with different callback
      trivule.defineRule('testRule', secondCallback, 'Second message');
      const secondRule = trivule.parameter.ruleRegistry.getRule('testRule');

      // Verify the rule was overridden
      expect(secondRule).toBe(secondCallback);
      expect(secondRule).not.toBe(firstCallback);

      // Verify the message was updated
      const message = trivule.parameter.ruleRegistry.getMessage('testRule');
      expect(message).toBe('Second message');
    });

    it('should support method chaining', () => {
      // Define multiple rules using method chaining
      const result = trivule
        .defineRule('chainOne', (value) => ({ passes: value === 'one', value }))
        .defineRule('chainTwo', (value) => ({ passes: value === 'two', value }))
        .defineRule('chainThree', (value) => ({
          passes: value === 'three',
          value,
        }));

      // Verify chaining returns the trivule instance
      expect(result).toBe(trivule);

      // Verify all chained rules were registered
      expect(trivule.parameter.ruleRegistry.hasRule('chainOne')).toBe(true);
      expect(trivule.parameter.ruleRegistry.hasRule('chainTwo')).toBe(true);
      expect(trivule.parameter.ruleRegistry.hasRule('chainThree')).toBe(true);
    });
  });

  describe('HTML Form Integration', () => {
    it('should use custom rule defined on Trivule instance in HTML forms', () => {
      // Define a custom rule
      trivule.defineRule(
        'positiveNumber',
        (value) => ({
          passes: !isNaN(Number(value)) && Number(value) > 0,
          value,
        }),
        'The value must be a positive number',
      );

      // Create HTML structure
      const form = document.createElement('form');
      const input = document.createElement('input');
      input.setAttribute('type', 'number');
      input.setAttribute('name', 'amount');
      input.setAttribute(attr('rules'), 'required|positiveNumber');
      form.appendChild(input);
      document.body.appendChild(form);

      // Create TrivuleInput instance
      const trivuleInput = TrivuleInput.create(
        { selector: input },
        trivule.parameter,
      );

      // Test with invalid value (negative number)
      input.value = '-5';
      trivuleInput.validate();
      expect(trivuleInput.fails()).toBe(true);
      expect(trivuleInput.errors.positiveNumber).toBe(
        'The value must be a positive number',
      );

      // Test with valid value (positive number)
      input.value = '10';
      trivuleInput.validate();
      expect(trivuleInput.passes()).toBe(true);
      expect(trivuleInput.errors).toEqual({});
    });

    it('should use custom rule with parameters in HTML forms', () => {
      // Define a custom rule with parameters
      trivule.defineRule(
        'minValue',
        (value, params) => {
          const minVal =
            params && typeof params !== 'number' ? Number(params) : 0;
          return {
            passes: !isNaN(Number(value)) && Number(value) >= minVal,
            value,
          };
        },
        'The value must be at least :arg0',
      );

      // Create HTML structure
      const form = document.createElement('form');
      const input = document.createElement('input');
      input.setAttribute('type', 'number');
      input.setAttribute('name', 'age');
      input.setAttribute(attr('rules'), 'required|minValue:18');
      form.appendChild(input);
      document.body.appendChild(form);

      // Create TrivuleInput instance
      const trivuleInput = TrivuleInput.create(
        { selector: input },
        trivule.parameter,
      );

      // Test with invalid value (below minimum)
      input.value = '15';
      trivuleInput.validate();
      expect(trivuleInput.fails()).toBe(true);
      expect(trivuleInput.errors.minValue).toBe(
        'The value must be at least 18',
      );

      // Test with valid value (at or above minimum)
      input.value = '20';
      trivuleInput.validate();
      expect(trivuleInput.passes()).toBe(true);
      expect(trivuleInput.errors).toEqual({});
    });

    it('should use custom rule with complex HTML form structure', () => {
      // Define a custom email domain rule
      trivule.defineRule(
        'emailDomain',
        (value, params) => {
          if (!value || typeof value !== 'string')
            return { passes: false, value };
          const domain =
            params && typeof params !== 'number' ? String(params) : '';
          return {
            passes: value.endsWith(`@${domain}`),
            value,
          };
        },
        'Email must be from :arg0 domain',
      );

      // Create complete form with feedback element
      const form = document.createElement('form');
      form.setAttribute(attr('form'), '');

      const input = document.createElement('input');
      input.setAttribute('type', 'email');
      input.setAttribute('name', 'email');
      input.setAttribute(
        attr('rules'),
        'required|email|emailDomain:company.com',
      );

      const feedbackElement = document.createElement('p');
      feedbackElement.setAttribute(attr('feedback'), 'email');

      form.appendChild(input);
      form.appendChild(feedbackElement);
      document.body.appendChild(form);

      // Create TrivuleInput instance
      const trivuleInput = TrivuleInput.create(
        { selector: input },
        trivule.parameter,
      );
      trivuleInput.setFeedbackElement(feedbackElement);

      // Test with invalid domain
      input.value = 'user@gmail.com';
      trivuleInput.validate();
      expect(trivuleInput.fails()).toBe(true);
      expect(trivuleInput.errors.emailDomain).toBe(
        'Email must be from company.com domain',
      );

      // Test with valid domain
      input.value = 'user@company.com';
      trivuleInput.validate();
      expect(trivuleInput.passes()).toBe(true);
      expect(trivuleInput.errors).toEqual({});
    });

    it('should validate multiple inputs with custom rules in the same form', () => {
      // Define custom rules
      trivule.defineRule(
        'strongPassword',
        (value) => {
          if (typeof value !== 'string') return { passes: false, value };
          return {
            passes:
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
                value,
              ),
            value,
          };
        },
        'Password must be at least 8 characters with uppercase, lowercase, number and special character',
      );

      trivule.defineRule(
        'validAge',
        (value) => {
          const age = parseInt(value as string);
          return {
            passes: !isNaN(age) && age >= 18 && age <= 120,
            value,
          };
        },
        'Age must be between 18 and 120',
      );

      // Create form with multiple inputs
      const form = document.createElement('form');
      form.setAttribute(attr('form'), '');

      const passwordInput = document.createElement('input');
      passwordInput.setAttribute('type', 'password');
      passwordInput.setAttribute('name', 'password');
      passwordInput.setAttribute(attr('rules'), 'required|strongPassword');

      const passwordFeedback = document.createElement('p');
      passwordFeedback.setAttribute(attr('feedback'), 'password');

      const ageInput = document.createElement('input');
      ageInput.setAttribute('type', 'number');
      ageInput.setAttribute('name', 'age');
      ageInput.setAttribute(attr('rules'), 'required|validAge');

      const ageFeedback = document.createElement('p');
      ageFeedback.setAttribute(attr('feedback'), 'age');

      form.appendChild(passwordInput);
      form.appendChild(passwordFeedback);
      form.appendChild(ageInput);
      form.appendChild(ageFeedback);
      document.body.appendChild(form);

      // Create TrivuleInput instances
      const passwordValidator = TrivuleInput.create(
        { selector: passwordInput },
        trivule.parameter,
      );
      const ageValidator = TrivuleInput.create(
        { selector: ageInput },
        trivule.parameter,
      );

      // Test invalid password
      passwordInput.value = 'weak';
      passwordValidator.validate();
      expect(passwordValidator.fails()).toBe(true);
      expect(passwordValidator.errors.strongPassword).toBeDefined();

      // Test invalid age
      ageInput.value = '15';
      ageValidator.validate();
      expect(ageValidator.fails()).toBe(true);
      expect(ageValidator.errors.validAge).toBe(
        'Age must be between 18 and 120',
      );

      // Test valid password
      passwordInput.value = 'StrongP@ss1';
      passwordValidator.validate();
      expect(passwordValidator.passes()).toBe(true);

      // Test valid age
      ageInput.value = '25';
      ageValidator.validate();
      expect(ageValidator.passes()).toBe(true);
    });
  });

  describe('Rule Validation Behavior', () => {
    it('should execute custom rule validation logic correctly', () => {
      let callCount = 0;

      // Define a rule that tracks execution
      trivule.defineRule('trackableRule', (value) => {
        callCount++;
        return { passes: value === 'valid', value };
      });

      const input = document.createElement('input');
      input.setAttribute(attr('rules'), 'trackableRule');
      document.body.appendChild(input);

      const trivuleInput = TrivuleInput.create(
        { selector: input },
        trivule.parameter,
      );

      // Validate multiple times
      input.value = 'invalid';
      trivuleInput.validate();
      expect(callCount).toBe(1);

      input.value = 'valid';
      trivuleInput.validate();
      expect(callCount).toBe(2);

      input.value = 'invalid';
      trivuleInput.validate();
      expect(callCount).toBe(3);
    });

    it('should pass correct value to custom rule callback', () => {
      let receivedValue: any = null;

      trivule.defineRule('valueChecker', (value) => {
        receivedValue = value;
        return { passes: true, value };
      });

      const input = document.createElement('input');
      input.setAttribute(attr('rules'), 'valueChecker');
      document.body.appendChild(input);

      const trivuleInput = TrivuleInput.create(
        { selector: input },
        trivule.parameter,
      );

      // Test with different values
      const testValue = 'test-value-123';
      input.value = testValue;
      trivuleInput.validate();
      expect(receivedValue).toBe(testValue);
    });

    it('should pass correct parameters to custom rule callback', () => {
      let receivedParams: RuleParam = undefined;

      trivule.defineRule('paramChecker', (value, params) => {
        receivedParams = params;
        return { passes: true, value };
      });

      const input = document.createElement('input');
      input.setAttribute(attr('rules'), 'paramChecker:param1,param2,param3');
      document.body.appendChild(input);

      const trivuleInput = TrivuleInput.create(
        { selector: input },
        trivule.parameter,
      );

      input.value = 'test';
      trivuleInput.validate();
      expect(receivedParams).toBe('param1,param2,param3');
    });
  });

  describe('Shared Registry Across Instances', () => {
    it('should share custom rules across all TrivuleInput instances created from the same Trivule instance', () => {
      // Define a custom rule
      trivule.defineRule('sharedRule', (value) => ({
        passes: value === 'shared',
        value,
      }));

      // Create multiple inputs
      const input1 = document.createElement('input');
      input1.setAttribute(attr('rules'), 'sharedRule');
      const input2 = document.createElement('input');
      input2.setAttribute(attr('rules'), 'sharedRule');

      document.body.appendChild(input1);
      document.body.appendChild(input2);

      // Create TrivuleInput instances
      const trivuleInput1 = TrivuleInput.create(
        { selector: input1 },
        trivule.parameter,
      );
      const trivuleInput2 = TrivuleInput.create(
        { selector: input2 },
        trivule.parameter,
      );

      // Both should have access to the same rule
      expect(trivuleInput1.hasRule('sharedRule')).toBe(true);
      expect(trivuleInput2.hasRule('sharedRule')).toBe(true);

      // Both should validate correctly
      input1.value = 'shared';
      input2.value = 'different';

      trivuleInput1.validate();
      trivuleInput2.validate();

      expect(trivuleInput1.passes()).toBe(true);
      expect(trivuleInput2.fails()).toBe(true);
    });

    it('should maintain singleton pattern and share rules across Trivule.init() calls', () => {
      // Define a rule on first instance
      const trivule1 = Trivule.init();
      trivule1.defineRule('singletonRule', (value) => ({
        passes: value === 'singleton',
        value,
      }));

      // Get another instance (should be same singleton)
      const trivule2 = Trivule.init();

      // The rule should be accessible from both instances
      expect(trivule1.parameter.ruleRegistry.hasRule('singletonRule')).toBe(
        true,
      );
      expect(trivule2.parameter.ruleRegistry.hasRule('singletonRule')).toBe(
        true,
      );

      // Verify they share the same parameter instance
      expect(trivule1.parameter).toBe(trivule2.parameter);
    });
  });

  describe('Edge Cases', () => {
    it('should handle rule with no message', () => {
      trivule.defineRule('noMessageRule', (value) => ({
        passes: value === 'test',
        value,
      }));

      const input = document.createElement('input');
      input.setAttribute(attr('rules'), 'noMessageRule');
      document.body.appendChild(input);

      const trivuleInput = TrivuleInput.create(
        { selector: input },
        trivule.parameter,
      );

      input.value = 'invalid';
      trivuleInput.validate();

      // Should use default message
      expect(trivuleInput.fails()).toBe(true);
      expect(trivuleInput.errors.noMessageRule).toBeDefined();
    });

    it('should handle rule returning false correctly', () => {
      trivule.defineRule(
        'alwaysFails',
        (value) => ({ passes: false, value }),
        'This always fails',
      );

      const input = document.createElement('input');
      input.setAttribute(attr('rules'), 'alwaysFails');
      document.body.appendChild(input);

      const trivuleInput = TrivuleInput.create(
        { selector: input },
        trivule.parameter,
      );

      input.value = 'anything';
      trivuleInput.validate();

      expect(trivuleInput.fails()).toBe(true);
      expect(trivuleInput.errors.alwaysFails).toBe('This always fails');
    });

    it('should handle rule returning true correctly', () => {
      trivule.defineRule('alwaysPasses', (value) => ({ passes: true, value }));

      const input = document.createElement('input');
      input.setAttribute(attr('rules'), 'alwaysPasses');
      document.body.appendChild(input);

      const trivuleInput = TrivuleInput.create(
        { selector: input },
        trivule.parameter,
      );

      input.value = '';
      trivuleInput.validate();

      expect(trivuleInput.passes()).toBe(true);
      expect(trivuleInput.errors).toEqual({});
    });

    it('should handle complex rule logic with multiple conditions', () => {
      trivule.defineRule(
        'complexRule',
        (value, params) => {
          if (typeof value !== 'string') return { passes: false, value };
          if (value.length < 5) return { passes: false, value };
          if (!params) return { passes: false, value };

          const requiredChar = String(params).charAt(0);
          return {
            passes: value.includes(requiredChar),
            value,
          };
        },
        'Value must be at least 5 characters and contain :arg0',
      );

      const input = document.createElement('input');
      input.setAttribute(attr('rules'), 'complexRule:@');
      document.body.appendChild(input);

      const trivuleInput = TrivuleInput.create(
        { selector: input },
        trivule.parameter,
      );

      // Test various scenarios
      input.value = 'abc'; // Too short
      trivuleInput.validate();
      expect(trivuleInput.fails()).toBe(true);

      input.value = 'abcde'; // Long enough but missing @
      trivuleInput.validate();
      expect(trivuleInput.fails()).toBe(true);

      input.value = 'abc@def'; // Valid
      trivuleInput.validate();
      expect(trivuleInput.passes()).toBe(true);
    });
  });

  describe('TrivuleForm.defineRule()', () => {
    it('should define a rule on TrivuleForm instance', () => {
      // Create a form
      const formElement = document.createElement('form');
      formElement.setAttribute(attr('form'), '');
      document.body.appendChild(formElement);

      const form = trivule.form(formElement, {});

      // Define a custom rule on the form
      form.defineRule('formRule', (value) => ({
        passes: value === 'valid',
        value,
      }));

      // Verify the rule exists in the shared parameter registry
      expect(form.parameter.ruleRegistry.hasRule('formRule')).toBe(true);
    });

    it('should support method chaining on TrivuleForm', () => {
      const formElement = document.createElement('form');
      formElement.setAttribute(attr('form'), '');
      document.body.appendChild(formElement);

      const form = trivule.form(formElement, {});

      // Define multiple rules using method chaining
      const result = form
        .defineRule('formRuleOne', (value) => ({ passes: true, value }))
        .defineRule('formRuleTwo', (value) => ({ passes: true, value }))
        .defineRule('formRuleThree', (value) => ({ passes: true, value }));

      // Verify chaining returns the form instance
      expect(result).toBe(form);

      // Verify all chained rules were registered
      expect(form.parameter.ruleRegistry.hasRule('formRuleOne')).toBe(true);
      expect(form.parameter.ruleRegistry.hasRule('formRuleTwo')).toBe(true);
      expect(form.parameter.ruleRegistry.hasRule('formRuleThree')).toBe(true);
    });

    it('should use custom rule defined on TrivuleForm in form inputs', () => {
      // Define custom rule on Trivule BEFORE creating the form
      trivule.defineRule(
        'customFormRule',
        (value) => ({
          passes: typeof value === 'string' && value.length >= 5,
          value,
        }),
        'Must be at least 5 characters',
      );

      // Create a form
      const formElement = document.createElement('form');
      formElement.setAttribute(attr('form'), '');

      const input = document.createElement('input');
      input.setAttribute('name', 'username');
      input.setAttribute(attr('rules'), 'required|customFormRule');

      formElement.appendChild(input);
      document.body.appendChild(formElement);

      const form = trivule.form(formElement, {});

      const trivuleInput = form.get('username');

      // Test with invalid value
      input.value = 'abc';
      trivuleInput?.validate();
      expect(trivuleInput?.fails()).toBe(true);
      expect(trivuleInput?.errors.customFormRule).toBe(
        'Must be at least 5 characters',
      );

      // Test with valid value
      input.value = 'abcdef';
      trivuleInput?.validate();
      expect(trivuleInput?.passes()).toBe(true);
    });

    it('should share rules between Trivule and TrivuleForm instances', () => {
      // Define a rule on Trivule
      trivule.defineRule('sharedBetweenInstances', (value) => ({
        passes: value === 'shared',
        value,
      }));

      // Create a form
      const formElement = document.createElement('form');
      formElement.setAttribute(attr('form'), '');
      document.body.appendChild(formElement);

      const form = trivule.form(formElement, {});

      // The rule defined on Trivule should be available on the form
      expect(
        form.parameter.ruleRegistry.hasRule('sharedBetweenInstances'),
      ).toBe(true);

      // Define a rule on the form
      form.defineRule('formSpecificRule', (value) => ({
        passes: value === 'form',
        value,
      }));

      // The rule defined on the form should be available on Trivule
      expect(trivule.parameter.ruleRegistry.hasRule('formSpecificRule')).toBe(
        true,
      );
    });
  });

  describe('TrivuleInput.defineRule()', () => {
    it('should define a rule on TrivuleInput instance', () => {
      const input = document.createElement('input');
      input.setAttribute('name', 'testInput');
      document.body.appendChild(input);

      const trivuleInput = TrivuleInput.create(
        { selector: input },
        trivule.parameter,
      );

      // Define a custom rule on the input
      trivuleInput.defineRule('inputRule', (value) => ({
        passes: value === 'valid',
        value,
      }));

      // Verify the rule exists in the shared parameter registry
      expect(trivule.parameter.ruleRegistry.hasRule('inputRule')).toBe(true);
    });

    it('should support method chaining on TrivuleInput', () => {
      const input = document.createElement('input');
      input.setAttribute('name', 'testInput');
      document.body.appendChild(input);

      const trivuleInput = TrivuleInput.create(
        { selector: input },
        trivule.parameter,
      );

      // Define multiple rules using method chaining
      const result = trivuleInput
        .defineRule('inputRuleOne', (value) => ({ passes: true, value }))
        .defineRule('inputRuleTwo', (value) => ({ passes: true, value }))
        .defineRule('inputRuleThree', (value) => ({ passes: true, value }));

      // Verify chaining returns the input instance
      expect(result).toBe(trivuleInput);

      // Verify all chained rules were registered
      expect(trivule.parameter.ruleRegistry.hasRule('inputRuleOne')).toBe(true);
      expect(trivule.parameter.ruleRegistry.hasRule('inputRuleTwo')).toBe(true);
      expect(trivule.parameter.ruleRegistry.hasRule('inputRuleThree')).toBe(
        true,
      );
    });

    it('should use custom rule defined on TrivuleInput for validation', () => {
      // Define custom rule BEFORE creating the input
      trivule.defineRule(
        'minLength5',
        (value) => ({
          passes: typeof value === 'string' && value.length >= 5,
          value,
        }),
        'Must be at least 5 characters long',
      );

      const input = document.createElement('input');
      input.setAttribute('name', 'username');
      input.setAttribute(attr('rules'), 'required|minLength5');
      document.body.appendChild(input);

      const trivuleInput = TrivuleInput.create(
        { selector: input },
        trivule.parameter,
      );

      // Test with invalid value
      input.value = 'abc';
      trivuleInput.validate();
      expect(trivuleInput.fails()).toBe(true);
      expect(trivuleInput.errors.minLength5).toBe(
        'Must be at least 5 characters long',
      );

      // Test with valid value
      input.value = 'abcdef';
      trivuleInput.validate();
      expect(trivuleInput.passes()).toBe(true);
    });

    it('should share rules between Trivule, TrivuleForm and TrivuleInput instances', () => {
      // Define a rule on Trivule
      trivule.defineRule('sharedAcrossAll', (value) => ({
        passes: value === 'shared',
        value,
      }));

      // Create an input
      const input = document.createElement('input');
      input.setAttribute('name', 'testInput');
      document.body.appendChild(input);

      const trivuleInput = TrivuleInput.create(
        { selector: input },
        trivule.parameter,
      );

      // The rule defined on Trivule should be available on the input
      expect(trivule.parameter.ruleRegistry.hasRule('sharedAcrossAll')).toBe(
        true,
      );

      // Define a rule on the input
      trivuleInput.defineRule('inputSpecificRule', (value) => ({
        passes: value === 'input',
        value,
      }));

      // The rule defined on the input should be available on Trivule
      expect(trivule.parameter.ruleRegistry.hasRule('inputSpecificRule')).toBe(
        true,
      );

      // Create a form and verify the rule is available there too
      const formElement = document.createElement('form');
      formElement.setAttribute(attr('form'), '');
      document.body.appendChild(formElement);

      const form = trivule.form(formElement, {});

      expect(form.parameter.ruleRegistry.hasRule('inputSpecificRule')).toBe(
        true,
      );
    });

    it('should allow defining and using rules in a fluent chain', () => {
      const input = document.createElement('input');
      input.setAttribute('name', 'fluentInput');
      document.body.appendChild(input);

      // Define rules and set input configuration in a fluent chain
      const trivuleInput = TrivuleInput.create(
        { selector: input },
        trivule.parameter,
      )
        .defineRule('fluentRule1', (value) => ({
          passes: typeof value === 'string',
          value,
        }))
        .defineRule('fluentRule2', (value) => ({ passes: true, value }));

      // Verify both rules were registered
      expect(trivule.parameter.ruleRegistry.hasRule('fluentRule1')).toBe(true);
      expect(trivule.parameter.ruleRegistry.hasRule('fluentRule2')).toBe(true);
    });
  });
});
