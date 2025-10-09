import {
  ITrConfig,
  RuleCallBack,
  TrivuleFormConfig,
  TrivuleInputParms,
  ValidatableForm,
} from '../types';
import { TrConfig } from '../tr.config';
import { TrivuleForm } from './form';
import { TrivuleInput } from './input';
import { TrParameter } from './utils/parameter';
/**
 *
 * Initializes Trivule and applies form validation to all forms in the document.
 * @param config Optional configuration object for Trivule.
 * Example:
 * ```
 * const trivule = Trivule.init();
 * ```
 * @author Claude Fassinou
 */
export class Trivule {
  /**
   * Singleton instance
   */
  private static _instance: Trivule | null = null;

  /**
   * Forms to validate array
   */
  private _trForms: TrivuleForm[] = [];

  /**
   * Shared parameter/configuration instance
   */
  public parameter: TrParameter;

  /**
   * Private constructor to prevent direct instantiation
   */
  private constructor() {
    this.parameter = TrParameter.instance();
  }

  /**
   * Static method to get or create the singleton instance
   * @param config Optional configuration object for Trivule
   * @returns The singleton Trivule instance
   */
  static init(config?: ITrConfig): Trivule {
    if (!Trivule._instance) {
      Trivule._instance = new Trivule();
    }

    // Merge with default config to ensure required fields are set
    const finalConfig: ITrConfig = {
      ...TrConfig,
      ...config,
    };

    // Configure parameter instance with all configuration
    Trivule._instance.parameter.configure(finalConfig);

    // Initialize forms
    Trivule._instance._trForms = [];
    document
      .querySelectorAll<HTMLFormElement>('form')
      .forEach((formElement) => {
        const trForm = Trivule._instance!.form(formElement, {});
        Trivule._instance!._trForms.push(trForm);
      });

    return Trivule._instance;
  }

  /**
   * Defines a new custom validation rule
   * @param name - The name of the rule
   * @param fn - The validation function
   * @param message - Optional custom error message
   * @returns The Trivule instance for method chaining
   * @example
   * ```typescript
   * const trivule = Trivule.init();
   *
   * // Simple rule
   * trivule.defineRule('positive', (value) => ({ passes: Number(value) > 0, value }));
   *
   * // With custom message
   * trivule.defineRule('strongPassword', (value) => {
   *   return {
   *     passes: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value),
   *     value
   *   };
   * }, 'Password must be strong');
   *
   * // Chainable
   * trivule
   *   .defineRule('ruleOne', (value) => ({ passes: true, value }))
   *   .defineRule('ruleTwo', (value) => ({ passes: true, value }));
   * ```
   */
  defineRule(name: string, fn: RuleCallBack, message?: string): this {
    this.parameter.ruleRegistry.defineRule(name, fn, message);
    return this;
  }

  forms(): TrivuleForm[] {
    return this._trForms;
  }

  form(
    selector: ValidatableForm | TrivuleFormConfig,
    config: TrivuleFormConfig,
  ) {
    const trForm = TrivuleForm.create(this.parameter);
    trForm.init(selector, config);
    return trForm;
  }

  input(params: TrivuleInputParms) {
    return TrivuleInput.create(params, this.parameter);
  }

  /**
   * Returns the configured attribute prefix
   * @returns The attribute prefix string (e.g., "data-tr-")
   * Example:
   * ```
   * const trivule = Trivule.init({ attributePrefix: 'data-tr-' });
   * trivule.getAttributePrefix(); // Returns "data-tr-"
   * ```
   */
  getAttributePrefix(): string {
    return this.parameter.attributePrefix;
  }
}
