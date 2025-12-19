import {
  InputValueType,
  InputType,
  Rule,
  RulesMessages,
  RuleType,
} from '../types';

import { I18nResolver } from './i18n';
import { TrParameter } from './utils/parameter';

/**
 * Options for the validate function
 */
export type ValidationOptions = {
  /**
   * The input type (defaults to 'text')
   */
  type?: InputType;
  /**
   * The attribute name used in error messages
   */
  attribute?: string;
};

type ReturnType = { valid: boolean; errors: Record<string, string> };

/**
 * Validates a value against a set of validation rules.
 * All rules are executed and all errors are collected before returning.
 *
 * @param rules - Array of validation rules to execute
 * @param value - The value to validate
 * @param options - Validation options (type and attribute)
 * @returns true if all validations pass, or Record<string, string> with error messages
 *
 * @example
 * const result = validate(rules, 'test@example.com', { type: 'email', attribute: 'email' });
 * // Returns: true or { email: 'Invalid email format' }
 */
export function validate(
  rules: RuleType[],
  value: InputValueType,
  options?: ValidationOptions,
): ReturnType {
  if (!Array.isArray(rules)) {
    throw new Error('The rule provided must be an array of Rule');
  }

  const parameter = TrParameter.instance();
  const errors: Record<string, string> = {};
  const ruleMessages: Record<string, string> = {};

  // Extract options with defaults
  const inputAttribute = options?.attribute ?? '';
  let inputType = (options?.type ?? 'text') as InputType;

  // Execute each validation rule
  for (const rule of rules) {
    const ruleName = rule.name;
    const params = rule.params;
    const ruleCallback = rule.callback;
    const message = rule.message;

    if (!ruleCallback || typeof ruleCallback !== 'function') {
      throw new Error(`The rule ${ruleName} is not defined`);
    }

    const state = ruleCallback(value, params, inputType);

    value = state.value as InputValueType;
    inputType = state.type ?? inputType;

    // Some rules use aliases (e.g., 'int' -> 'integer')
    const actualRuleName = state.alias ?? ruleName;

    // If validation failed, build the error message
    if (!state.passes) {
      const originalMessage = parameter.ruleRegistry.getMessage(ruleName);

      // Use custom message if provided, otherwise use default
      if (message && message !== originalMessage) {
        ruleMessages[actualRuleName] = message;
      } else {
        ruleMessages[actualRuleName] =
          parameter.ruleRegistry.getMessage(actualRuleName);
      }

      // Create I18n resolver for message interpolation
      const trMessages = new I18nResolver(parameter.ruleRegistry).setMessages(
        ruleMessages as RulesMessages,
      );

      // Parse message template with placeholders
      // Example: "The {attribute} must be {min}" -> "The email must be 5"
      const parsedMessage = I18nResolver.parseMessage(
        inputAttribute,
        actualRuleName as Rule,
        trMessages.getRulesMessages([actualRuleName as Rule])[0],
        params,
      );

      errors[ruleName] = parsedMessage;
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
