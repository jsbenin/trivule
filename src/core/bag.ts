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
import { phone } from '../rules/phone';
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

  // Localization properties (ex-TrLocal)
  private _useLang: string | null = null;
  public static readonly DEFAULT_LANG = 'en';
  public lang: string = RuleRegistry.DEFAULT_LANG;
  private _messages: Record<string, RulesMessages> = {
    en: en_messages,
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
  ): void {
    this.rules[rule as keyof RulesBag] = callback;
    this.addMessage(rule, message, local);
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
    const messages: Record<string | Rule, string> = this.getMessages(local);
    return messages[name] ?? messages['default'];
  }

  allRules() {
    return this.rules;
  }

  // Localization methods (ex-TrLocal methods converted to instance methods)

  /**
   * Get the messages for a specific language.
   * If the language is not provided, the default language is used.
   *
   * @param local The language code (optional)
   * @returns The messages object for the specified language
   */
  getMessages(local?: string): RulesMessages {
    local = local ?? RuleRegistry.DEFAULT_LANG;
    let messages = this._messages[local];
    if (!messages) {
      messages = this._messages[RuleRegistry.DEFAULT_LANG];
    }
    return messages;
  }

  /**
   * Add or update a message for a specific rule and language.
   * If the language is not provided, the default language is used.
   *
   * @param rule The rule name
   * @param message The new message
   * @param local The language code (optional)
   */
  addMessage(rule: string, message?: string, local?: string): void {
    if (message) {
      local = local || RuleRegistry.DEFAULT_LANG;
      const existingMessages = this._messages[local] || {};
      this._messages[local] = { ...existingMessages, [rule]: message };
    }
  }

  /**
   * Rewrite the message for a specific rule and language.
   * This is a shorthand method that calls `addMessage`.
   *
   * @param lang The language code
   * @param rule The rule name
   * @param message The new message
   */
  rewrite(lang: string, rule: string | Rule, message: string): void {
    this.addMessage(rule, message, lang);
  }

  /**
   * Set the current translation language to be used for displaying error messages.
   * This method overrides all other methods of assigning the language for displaying error messages.
   *
   * @param lang The language code
   */
  setLocal(lang: string): void {
    if (!is_string(lang) || !lang.length) {
      throw new Error('The language must be a valid string');
    }
    this._useLang = lang;
  }

  /**
   * Get the currently set translation language.
   * If no language is set, the default language is used.
   *
   * @returns The currently set language code
   */
  getLocal(): string {
    return this._useLang ?? this.lang;
  }

  /**
   * Get all messages for all languages
   * @param local The language code (optional)
   * @returns All messages for the specified language or default language
   */
  allMessages(local?: string): RulesMessages {
    return this.getMessages(local);
  }
}

// Keep TrBag as an alias for backward compatibility during transition
export const TrBag = RuleRegistry;
