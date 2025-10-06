import { Rule, RuleCallBack, RuleParam, RuleType } from '../../types';
import { getRule } from '../../utils';
import { TrBag } from '../bag';

export class InputRule {
  items: RuleType[] = [];
  messages: Record<string, string> = {};
  constructor(
    rules: Rule[] | string[] | Rule | string,
    messages?: string | string[] | Record<string, string> | null,
    private local?: string,
  ) {
    this.set(rules, messages, local);
  }

  /**
   * Removes a validation rule from the InputRule instance.
   * @param  rule - The name of the rule to remove.
   * @returns Returns the current InputRule instance for method chaining.
   */
  remove(rule: string): this {
    const { ruleName } = getRule(rule);
    this.items = this.items.filter((item) => item.name !== ruleName);
    //Delete the rule message
    delete this.messages[ruleName];
    return this;
  }
  /**
   * Retrieves a validation rule from the InputRule instance.
   * @param {string | Rule} rule - Optional. The name of the rule to retrieve.
   * @returns Returns the validation rule if found, an array of all rules if no specific rule is provided, or null if the rule is not found.
   */
  get(rule?: string | Rule) {
    if (rule) {
      const { ruleName } = getRule(rule);
      return this.items.find((item) => item.name === ruleName) ?? null;
    }
    return this.items;
  }
  /**
   * Gets the number of validation rules in the InputRule instance.
   */
  get length() {
    return this.items.length;
  }

  /**
   * Clears all validation rules and associated messages from the InputRule instance.
   * @returns - Returns the current InputRule instance after clearing.
   */
  clear() {
    this.items = [];
    this.messages = {};
    return this;
  }
  ruleNameAsArray() {
    return this.items.map((rule) => rule.name);
  }
  messageAsArray() {
    return this.items.map((rule) => rule.message);
  }
  /**
   * Adds a new validation rule to the InputRule instance.
   * If the rule already exists, it is first removed and then added again.
   * @param {string | Rule} rule - The name of the rule to add or a valid Trivule rule.
   * @param {string | null} message - Optional. The custom error message for the rule.
   * @param {RuleParam} param - Optional. The parameters for the rule.
   * @param {RuleCallBack} validate - Optional. The validation callback function for the rule.
   * @param {string} local - Optional. The locale to use for retrieving localized error messages.
   * @returns - Returns the current InputRule instance after adding the rule.
   */
  add(
    rule: string | Rule,
    message?: string | null,
    param?: RuleParam,
    validate?: RuleCallBack,
    local?: string,
  ) {
    if (this.has(rule)) {
      this.remove(rule);
    }
    this.items.push(this.createRule(rule, message, param, validate, local));
    return this;
  }
  has(rule: string | Rule): boolean {
    const { ruleName } = getRule(rule);
    return this.items.some((item) => item.name === ruleName);
  }
  /**
   * Checks if a validation rule exists in the InputRule instance.
   * @param {string | Rule} rule - The name of the rule to check or a valid Trivule rule.
   * @returns {boolean} - Returns true if the rule exists, otherwise returns false.
   */
  private createRule(
    originaleRule: string,
    message?: string | null,
    param?: RuleParam,
    validate?: RuleCallBack,
    local?: string,
  ): RuleType {
    const { ruleName, params } = getRule(originaleRule);

    if (!message) {
      message = TrBag.getMessage(ruleName, local);
    }
    const ruleCallback = TrBag.getRule(ruleName);
    validate = validate ?? ruleCallback;

    if (!validate) {
      throw new Error(`The rule ${ruleName} is not defined`);
    }
    this.messages[ruleName] = message;

    return {
      name: ruleName,
      message,
      params: param ?? params,
      validate,
    };
  }

  protected toArrayOrObject(
    messages?: string | string[] | Record<string, string> | null,
  ) {
    return ((Array.isArray(messages)
      ? messages
      : typeof messages === 'string'
        ? messages.split('|').map((r) => r.trim())
        : messages) ?? []) as string[] | Record<string, string>;
  }

  protected _sanitizeMessage(message?: string | null) {
    if (!message) {
      return message;
    }
    const regex = /{(\d+(?:,\s*\d+)*)}/g;
    // Iterate through each message and replace the regex pattern with an empty string
    return message.replace(regex, '');
  }

  /**
   *
   * Go catuper {1,2...} and transform them into an array
   * @param str
   * @returns
   */
  convertAcoladeGroupToArray(str: string) {
    const regex = /{(\d+(?:,\s*\d+)*)}/g;
    const matches = [...str.matchAll(regex)].map((match) =>
      match[1].split(',').map((num) => parseInt(num.trim())),
    );
    return matches[0] ?? [];
  }
  /**
   * Sets validation rules and associated messages for the InputRule instance.
   * @param {Rule[] | string[] | Rule | string} rules - The validation rules to set.
   * @param {string | string[] | Record<string, string> | null} messages - Optional. Custom error messages for the validation rules.
   * @param {string} local - Optional. The locale to use for retrieving localized error messages.
   * @returns - Returns the current InputRule instance after setting the rules.
   */

  set(
    rules: Rule[] | string[] | Rule | string,
    messages?: string | string[] | Record<string, string> | null,
    local?: string,
  ) {
    rules = Array.isArray(rules)
      ? rules.map((r) => r.trim())
      : rules.split('|').map((r) => r.trim());
    //Convert to object or array
    messages = this.toArrayOrObject(messages);
    for (let i = 0; i < rules.length; i++) {
      const originaleRule = rules[i];
      let message: string | null = null;
      const { ruleName, params } = getRule(originaleRule);
      if (Array.isArray(messages)) {
        const indexes = this.convertAcoladeGroupToArray(messages[i] ?? '');
        for (const ii of indexes) {
          messages[ii] = this._sanitizeMessage(messages[i]) as string;
        }
        message = messages[i];
      } else if (typeof messages === 'object') {
        message = this._sanitizeMessage(messages[ruleName]) ?? null;
      }

      this.add(ruleName, message, params, undefined, local);
    }
    return this;
  }

  /**
   * Maps over the validation rules in the InputRule instance and applies a function to each rule.
   * @param {Function} call - The function to apply to each rule. It receives two parameters: the rule itself and its index in the array.
   * @returns An array containing the results of applying the function to each rule.
   */
  map<T = unknown>(call: (r: RuleType, i: number) => T) {
    return this.items.map(call);
  }

  /**
   * Retrieves all validation rules stored in the InputRule instance.
   * @returns - An array containing all validation rules.
   */
  all() {
    return this.items;
  }
  /**
   * Adds a new validation rule to the InputRule instance and returns the current instance.
   * @param {string} rule - The name of the rule to add.
   * @param {string | null} message - Optional. The custom error message for the rule.
   * @param {RuleParam} param - Optional. The parameters for the rule.
   * @param {RuleCallBack} validate - Optional. The validation callback function for the rule.
   * @param {string} local - Optional. The locale to use for retrieving localized error messages.
   * @returns - Returns the current InputRule instance after adding the rule.
   */
  push(
    rule: string,
    message?: string | null,
    param?: RuleParam,
    validate?: RuleCallBack,
    local?: string,
  ): this {
    this.add(rule, message, param, validate, local);
    return this;
  }
  /**
   * Retrieves all custom error messages associated with validation rules in the InputRule instance.
   * @returns - An object containing all custom error messages.
   */
  getMessages() {
    return this.messages;
  }

  /**
   * Retrieves the message associated with a specific validation rule.
   * @param {string | Rule} rule - The name of the validation rule or the rule itself.
   * @returns {string | null} - The message associated with the specified rule, or null if the message is not found.
   */

  getMessage(rule: string | Rule): string | null {
    const { ruleName } = getRule(rule);
    return this.messages[ruleName] || null;
  }
}
