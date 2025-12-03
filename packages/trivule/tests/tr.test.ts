import { vi } from 'vitest';
import { RuleRegistry } from '../src/core/bag';

describe('RuleRegistry', () => {
  let ruleRegistry: RuleRegistry;

  beforeEach(() => {
    ruleRegistry = new RuleRegistry();
  });

  it('should return true if a rule exists in the rules bag', () => {
    // Add a custom rule to the bag of rules
    ruleRegistry.defineRule('customRule', () => {
      return { value: '', passes: true };
    });

    // Check if the customRule exists in the bag of rules
    expect(ruleRegistry.hasRule('customRule')).toBe(true);
  });

  it('should return false if a rule does not exist in the rules bag', () => {
    // Check whether a non-existent rule in the bag of rules returns false
    expect(ruleRegistry.hasRule('nonexistentRule')).toBe(false);
  });
});

describe('defineRule', () => {
  let ruleRegistry: RuleRegistry;

  beforeEach(() => {
    ruleRegistry = new RuleRegistry();
  });

  it('should add a custom validation rule to the rules bag with a message', () => {
    // Define a callback function for the custom rule
    const customCallback = vi.fn();

    // Call the defineRule method to add the custom rule with a message
    ruleRegistry.defineRule(
      'customRule',
      customCallback,
      'This is a custom error message',
    );

    // Check if the rule and message have been added to the bag of rules and messages
    expect(ruleRegistry.getRule('customRule')).toBe(customCallback);
    expect(ruleRegistry.getMessage('customRule')).toBe(
      'This is a custom error message',
    );
  });

  it('should add a custom validation rule to the rules bag without a message', () => {
    // Define a callback function for the custom rule
    const customCallback = vi.fn();

    // Call the defineRule method to add the custom rule without a message
    ruleRegistry.defineRule('customRule', customCallback);

    // Check if the rule has been added to the bag of rules with a default message
    expect(ruleRegistry.getRule('customRule')).toBe(customCallback);
  });
});
