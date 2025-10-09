import {
  InputValueType,
  InputType,
  Rule,
  RulesMessages,
  RuleType,
} from '../types';

import { RuleExecuted } from '.';
import { I18nResolver } from './i18n';
import { TrParameter } from './utils/parameter';

export class TrValidation {
  private _inputType = 'text';

  /**
   * A list of rules run
   */
  private _ruleExecuted: RuleExecuted[] = [];

  /**
   * The attrabute name that should be used to display the validation errors
   */
  private _attr = '';

  /**
   * An object containing the original validation rules errors as key-value pairs (record) of rule names and error
   * messages
   */
  private _trmessages: Record<string, string> = {};

  /**
   * Parameter instance for accessing configuration and rules
   */
  private _parameter: TrParameter;

  constructor(parameter?: TrParameter) {
    this._parameter = parameter ?? TrParameter.instance();
  }

  /**
   * This method performs the validation process. It iterates over the rules array and executes each rule on the
   * provided value. All rules are executed and all validation errors are collected.
   * The method updates the _ruleExecuted array with the result of each rule execution.
   * It returns a boolean value indicating whether the validation passed (true) or not (false)
   * @param rules - Array of rules to validate against
   * @param value - The value to validate
   * @param type - Optional input type (defaults to 'text')
   * @example
   * const validation = new TrValidation(param)
   * const rules = inputRule.all();
   * const result = validation.validate(rules, 'test@example.com', 'email')
   */
  validate(rules: RuleType[], value: InputValueType, type?: InputType) {
    if (!Array.isArray(rules)) {
      throw new Error('The rule provided must be an array of Rule');
    }

    // Clear previous validation state
    this._ruleExecuted = [];

    let inputType = (type ?? this._inputType) as InputType;
    for (const rule of rules) {
      const ruleName = rule.name;
      const params = rule.params;
      const ruleCallback = rule.validate;
      const message = rule.message;

      let ruleToRun = ruleName;

      const ruleExec = this._makeRuleExcutedInstance(ruleToRun, ruleName);

      ruleExec.params = params;

      if (!ruleCallback || typeof ruleCallback !== 'function') {
        throw new Error(`The rule ${ruleName} is not defined`);
      }

      const state = ruleCallback(value, params, inputType);

      //Indicate if the rule passed
      ruleExec.passed = state.passes;
      //Get the value after validation
      //The value may be converted by the validation callback
      value = state.value as InputValueType;

      inputType = state.type ?? inputType;
      ruleToRun = state.alias ?? ruleName;
      //
      ruleExec.valueTested = value;
      ruleExec.run = true;
      this._addRuleExecuted(ruleExec);
      // Always parse rule message for failed rules
      if (!ruleExec.passed) {
        this._parseRuleMessage(ruleExec, ruleToRun, message);
      } else {
        ruleExec.message = null;
      }
    }

    return !this.hasErrors();
  }
  /**
   * Get rule/message error
   * @returns
   */
  getErrors() {
    const r: Record<string, string> = {};
    for (const rx of this._ruleExecuted) {
      if (!rx.passed) {
        r[rx.orignalName] = rx.message ?? '';
      }
    }
    return r;
  }
  /**
   * Check if validation failed
   * @returns
   */
  hasErrors(): boolean {
    return this._ruleExecuted.some((rx) => !rx.passed);
  }

  /**
   * This method is an alias for hasErrors(). It returns true if there are no errors, false otherwise
   */
  passes() {
    return !this.hasErrors();
  }

  /**
   * Create an instance of RuleExcuted
   * @param r
   * @returns
   */
  private _makeRuleExcutedInstance(r: string | Rule, originalRuleName: string) {
    const re = this._ruleExecuted.find((rx) => {
      return rx.isNamed(r);
    });
    return re ?? new RuleExecuted(r, originalRuleName);
  }

  private _addRuleExecuted(ruleExecuted: RuleExecuted) {
    if (!this._ruleExecuted.includes(ruleExecuted)) {
      this._ruleExecuted.push(ruleExecuted);
    }
  }
  private _parseRuleMessage(
    ruleExec: RuleExecuted,
    aliasRule: string,
    message: string | undefined | null,
  ) {
    const orgMesage = this._parameter.ruleRegistry.getMessage(
      ruleExec.orignalName,
    );

    if (message && message !== orgMesage) {
      this._trmessages[ruleExec.ruleName] = message;
    } else {
      this._trmessages[ruleExec.ruleName] =
        this._parameter.ruleRegistry.getMessage(aliasRule ?? ruleExec.ruleName);
    }

    const trMessages = new I18nResolver(
      undefined,
      this._parameter.ruleRegistry,
    ).setMessages(this._trmessages as RulesMessages);

    message = I18nResolver.parseMessage(
      this._attr,
      ruleExec.ruleName as Rule,
      trMessages.getRulesMessages([ruleExec.ruleName as Rule])[0],
      ruleExec.params,
    );

    ruleExec.message = message;

    return ruleExec;
  }

  set attribute(attr: string) {
    this._attr = attr;
  }

  get attribute() {
    return this._attr;
  }

  getRuleExecuted(): RuleExecuted[] {
    return this._ruleExecuted;
  }
}
