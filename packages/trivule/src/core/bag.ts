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
} from '../rules';
import { dateAfter, dateBefore, isDate, isTime } from '../rules/date';
import { en_messages } from '../locale/lang/en';

export class RuleRegistry {
  private rules: RulesBag = {
    required: required,
    email: email,
    maxlength: maxlength,
    minlength: minlength,
    min: minRule,
    max: maxRule,
    string: is_string,
    between: between,
    startWith: startWith,
    endWith: endWith,
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
    maxFileSize: maxFileSize,
    minFileSize: minFileSize,
    size: size,
    boolean: isBoolean,
    startWithUpper: startWithUpper,
    nullable: nullable,
    startWithLower: startWithLower,
    password: passwordRule,
    date: isDate,
    before: dateBefore,
    after: dateAfter,
    time: isTime,
    startWithString: startWithString,
    endWithString: endWithString,
    excludes: excludes,
    hasLetter: containsLetter,
    regex: regex,
    lower: lower,
    upper: upper,
    stringBetween: stringBetween,
    mod: modulo,
    only: only,
    equals: equals,
    notEquals: notEquals,
    mimes: isMimes,
    digit: digitRule,
    minDigit: minDigitRule,
    lessThan: lessthan,
    lthan: lessthan,
    maxDigit: maxDigitRule,
    greaterThan: greaterthan,
    gthan: greaterthan,
    fileBetween: fileBetween,
    dateBetween: dateBetween,
    numberBetween: numberBetween,
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
