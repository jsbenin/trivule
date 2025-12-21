import { dateBetween } from '../rules/date';
import { endWithString, stringBetween } from '../rules/string';
import { fileBetween, isMimes, minFileSize } from '../rules/file';
import { Rule, RuleCallBack, RulesBag, RulesMessages } from '../types';
import {
  between,
  contains,
  email,
  endWith,
  inInput,
  integer,
  isNumber,
  is_string,
  maxRule,
  maxlength,
  minRule,
  minlength,
  required,
  startWith,
  length,
  url,
  isFile,
  maxFileSize,
  size,
  isBoolean,
  startWithUpper,
  nullable,
  startWithLower,
  passwordRule,
  startWithString,
  excludes,
  containsLetter,
  regex,
  lower,
  upper,
  modulo,
  only,
  equals,
  notEquals,
  digitRule,
  minDigitRule,
  lessthan,
  maxDigitRule,
  greaterthan,
  numberBetween,
  same,
  requiredIf,
} from '../rules';
import { dateAfter, dateBefore, isDate, isTime } from '../rules/date';
import { en_messages } from '../locale/lang/en';

export class RuleRegistry {
  private rules: RulesBag = {
    required: required,
    email: email,
    max_length: maxlength,
    min_length: minlength,
    min: minRule,
    max: maxRule,
    string: is_string,
    between: between,
    start_with: startWith,
    end_with: endWith,
    contains: contains,
    in: inInput,
    integer: integer,
    int: integer,
    modulo: modulo,
    number: isNumber,
    numeric: isNumber,
    url: url,
    length: length,
    len: length,
    file: isFile,
    max_file_size: maxFileSize,
    min_file_size: minFileSize,
    size: size,
    boolean: isBoolean,
    start_with_upper: startWithUpper,
    nullable: nullable,
    start_with_lower: startWithLower,
    password: passwordRule,
    date: isDate,
    before: dateBefore,
    after: dateAfter,
    time: isTime,
    start_with_string: startWithString,
    end_with_string: endWithString,
    excludes: excludes,
    has_letter: containsLetter,
    regex: regex,
    lower: lower,
    upper: upper,
    string_between: stringBetween,
    mod: modulo,
    only: only,
    equals: equals,
    not_equals: notEquals,
    mimes: isMimes,
    digit: digitRule,
    min_digit: minDigitRule,
    less_than: lessthan,
    lthan: lessthan,
    max_digit: maxDigitRule,
    greater_than: greaterthan,
    gthan: greaterthan,
    file_between: fileBetween,
    date_between: dateBetween,
    number_between: numberBetween,
    same: same,
    required_if: requiredIf,
  };

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
