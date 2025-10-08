import { dateBetween } from '../rules/date';
import { endWithString, stringBetween } from '../rules/string';
import { fileBetween, isMimes, minFileSize } from '../rules/file';
import { Rule, RuleCallBack, RulesBag } from '../types';
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
import { TrLocal } from '../locale/tr-local';
import { phone } from '../rules/phone';

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
    phone: phone,
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

  /**
   * Define a custom validation rule with optional error message
   * @param rule - The name of the custom rule
   * @param callback - The callback function for the custom rule
   * @param message - The error message for the custom rule
   * @param local - The locale for the error message
   */
  defineRule(
    rule: string,
    callback: RuleCallBack,
    message?: string,
    local?: string,
  ) {
    this.rules[rule as keyof RulesBag] = callback;
    TrLocal.addMessage(rule, message, local);
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
  getMessage(name: string | Rule, local?: string): string {
    return TrLocal.getRuleMessage(name, local);
  }

  allRules() {
    return this.rules;
  }
  allMessages(local?: string) {
    return TrLocal.getMessages(local);
  }
}
