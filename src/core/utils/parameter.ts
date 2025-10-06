import {
  CssSelector,
  ITrConfig,
  TrivuleFormConfig,
  ValidatableForm,
} from '../../types';
import { TrLocal } from '../../locale/tr-local';
import { escapeCssSelector } from '../../utils';

/**
 * TrParameter - Centralized configuration container for Trivule
 * This singleton class holds all shared configuration and parameters
 */
export class TrParameter {
  private static _instance: TrParameter | null = null;

  // Attribute prefix configuration (defaults to 'data-tr-')
  private _attributePrefix: string = 'data-tr-';

  // Selector configurations (using {attr} placeholder for dynamic attribute prefix)
  private _feedbackSelector: CssSelector | null = '[{attr}feedback={name}]';
  inputSelector: CssSelector | null = '[name={name}]';

  /**
   * Get the feedback selector with attribute prefix replaced and CSS-escaped
   */
  get feedbackSelector(): CssSelector | null {
    if (typeof this._feedbackSelector === 'string') {
      const escapedPrefix = escapeCssSelector(this.attributePrefix);
      return this._feedbackSelector.replace('{attr}', escapedPrefix);
    }
    return this._feedbackSelector;
  }

  /**
   * Set the feedback selector
   */
  set feedbackSelector(value: CssSelector | null) {
    this._feedbackSelector = value;
  }

  // CSS class configurations
  invalidClass: string = 'is-invalid';
  validClass: string = '';

  // Behavior configurations
  realTime: boolean = true;
  auto: boolean = true;

  // Localization configuration
  lang: string = TrLocal.DEFAULT_LANG;

  // Element reference (for form-specific usage)
  element?: ValidatableForm;

  /**
   * Get the attribute prefix
   */
  get attributePrefix(): string {
    return this._attributePrefix;
  }

  /**
   * Set the attribute prefix
   */
  set attributePrefix(value: string) {
    if (!value || typeof value !== 'string') {
      throw new Error('Trivule: attributePrefix must be a non-empty string');
    }
    this._attributePrefix = value;
    // Note: {attr} placeholder replacement is handled in the feedbackSelector getter
  }

  /**
   * Configure multiple parameters at once
   * @param config Configuration object (ITrConfig or TrivuleFormConfig)
   */
  configure(config?: ITrConfig | TrivuleFormConfig): this {
    if (!config || typeof config !== 'object') {
      return this;
    }

    // Set attributePrefix if provided
    if ('attributePrefix' in config && config.attributePrefix) {
      this.attributePrefix = config.attributePrefix;
    }

    if (config.invalidClass !== undefined) {
      this.invalidClass = config.invalidClass;
    }
    if (config.validClass !== undefined) {
      this.validClass = config.validClass;
    }
    if (config.realTime !== undefined) {
      this.realTime = config.realTime;
    }
    if (config.feedbackSelector !== undefined) {
      this.feedbackSelector = config.feedbackSelector;
    }
    if (config.local?.lang) {
      this.lang = config.local.lang;
      TrLocal.LANG = config.local.lang;
    }
    if ('auto' in config && config.auto !== undefined) {
      this.auto = config.auto;
    }
    if ('element' in config && config.element !== undefined) {
      this.element = config.element;
    }

    return this;
  }

  getFeedbackSelector(name: string): CssSelector | null {
    if (typeof this.feedbackSelector === 'string') {
      if (name.trim().length < 1) {
        return null;
      }

      return this.feedbackSelector.replace('{name}', name);
    }
    return this.feedbackSelector;
  }

  setFeedbackSelector(selector?: string | HTMLElement | null): this {
    if (!selector) {
      return this;
    }

    this.feedbackSelector = selector;
    return this;
  }

  getInputSelector(name: unknown): CssSelector | null {
    if (typeof this.inputSelector === 'string' && typeof name === 'string') {
      if (name.trim().length < 1) {
        return null;
      }
      return this.inputSelector.replace('{name}', name);
    }
    return this.inputSelector;
  }

  /**
   * Get a parameter value by key
   * @param key The parameter key
   * @deprecated Use direct property access instead (e.g., parameter.attributePrefix)
   */
  get(key: 'attribute'): string {
    if (key === 'attribute') {
      return this.attributePrefix;
    }
    throw new Error(`Unknown parameter key: ${key}`);
  }

  /**
   * Set a parameter value by key
   * @param key The parameter key
   * @param value The value to set
   * @deprecated Use direct property access instead (e.g., parameter.attributePrefix = value)
   */
  set(key: 'attribute', value: string): this {
    if (key === 'attribute') {
      this.attributePrefix = value;
      return this;
    }
    throw new Error(`Unknown parameter key: ${key}`);
  }

  static instance(): TrParameter {
    if (!TrParameter._instance) {
      TrParameter._instance = new TrParameter();
    }
    return TrParameter._instance;
  }
}
