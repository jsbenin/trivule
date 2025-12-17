import { date_between } from '../rules/date';
import { end_with_string, string_between } from '../rules/string';
import { file_between, is_mimes, min_file_size } from '../rules/file';
import { Rule, RuleCallBack, RulesBag, RulesMessages } from '../types';
import {
  between,
  contains,
  email,
  end_with,
  in_input,
  integer,
  is_number,
  is_string,
  max_rule,
  max_length,
  min_rule,
  min_length,
  required,
  start_with,
  length,
  url,
  is_file,
  max_file_size,
  size,
  is_boolean,
  start_with_upper,
  nullable,
  start_with_lower,
  password_rule,
  start_with_string,
  excludes,
  contains_letter,
  regex,
  lower,
  upper,
  modulo,
  only,
  equals,
  not_equals,
  digit_rule,
  min_digit_rule,
  less_than,
  max_digit_rule,
  greater_than,
  number_between,
} from '../rules';
import { date_after, date_before, is_date, is_time } from '../rules/date';
import { en_messages } from '../locale/lang/en';

export class RuleRegistry {
  private rules: RulesBag = {
    required: required,
    email: email,
    max_length: max_length,
    min_length: min_length,
    min: min_rule,
    max: max_rule,
    string: is_string,
    between: between,
    start_with: start_with,
    end_with: end_with,
    contains: contains,
    in_input: in_input,
    integer: integer,
    int: integer,
    modulo: modulo,
    is_number: is_number,
    numeric: is_number,
    url: url,
    length: length,
    len: length,
    is_file: is_file,
    max_file_size: max_file_size,
    min_file_size: min_file_size,
    size: size,
    is_boolean: is_boolean,
    start_with_upper: start_with_upper,
    nullable: nullable,
    start_with_lower: start_with_lower,
    password: password_rule,
    password_rule: password_rule,
    is_date: is_date,
    date_before: date_before,
    date_after: date_after,
    is_time: is_time,
    start_with_string: start_with_string,
    end_with_string: end_with_string,
    excludes: excludes,
    contains_letter: contains_letter,
    regex: regex,
    lower: lower,
    upper: upper,
    string_between: string_between,
    mod: modulo,
    only: only,
    equals: equals,
    not_equals: not_equals,
    is_mimes: is_mimes,
    digit: digit_rule,
    digit_rule: digit_rule,
    min_digit: min_digit_rule,
    min_digit_rule: min_digit_rule,
    less_than: less_than,
    lthan: less_than,
    max_digit: max_digit_rule,
    max_digit_rule: max_digit_rule,
    greater_than: greater_than,
    gthan: greater_than,
    file_between: file_between,
    date_between: date_between,
    number_between: number_between,
  };

  // Messages storage
  public static readonly DEFAULT_LANG = 'en';
  private _messages: RulesMessages = { ...en_messages };

  defineRule(rule: string, callback: RuleCallBack, message?: string): void {
    this.rules[rule as keyof RulesBag] = callback;
    this.addMessage(rule, message);
  }

  /**
   * Check if a validation rule exists in the rules bag
   * @param rule - The name of the validation rule
   * @returns True if the rule exists, false otherwise
   */
  hasRule(rule: string): boolean {
    return rule in this.rules;
  }

  getRule(name: string) {
    return this.rules[name as Rule];
  }

  getMessage(name: string | Rule): string {
    const messages = this.getMessages();
    return messages[name] ?? messages['default'];
  }

  allRules() {
    return this.rules;
  }

  /**
   * Get all messages
   * @returns The messages object
   */
  getMessages(): RulesMessages {
    return this._messages;
  }

  /**
   * Add or update a message for a specific rule
   * @param rule The rule name
   * @param message The new message
   */
  addMessage(rule: string, message?: string): void {
    if (message) {
      this._messages[rule] = message;
    }
  }
}

// Keep TrBag as an alias for backward compatibility during transition
export const TrBag = RuleRegistry;
