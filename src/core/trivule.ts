import {
  ITrConfig,
  RuleCallBack,
  TrivuleFormConfig,
  TrivuleInputParms,
  ValidatableForm,
} from '../types';
import { TrConfig } from '../tr.config';
import { TrBag } from './bag';
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
   * Adds a new validation rule to Trivule's rule bag.
   * @param ruleName The name of the rule.
   * @param call The rule callback function.
   * @param message Optional error message for the rule.
   * Example:
   * ```
   * trivule.rule('customRule', (value) => value === 'foo', 'Value must be "foo"');
   * ```
   */
  rule(ruleName: string, call: RuleCallBack, message?: string) {
    TrBag.defineRule(ruleName, call, message);
  }

  forms(): TrivuleForm[] {
    return this._trForms;
  }

  static Rule(ruleName: string, call: RuleCallBack, message?: string) {
    TrBag.defineRule(ruleName, call, message);
  }
  form(
    selector: ValidatableForm | TrivuleFormConfig,
    config: TrivuleFormConfig,
  ) {
    const trForm = new TrivuleForm(this.parameter);
    trForm.init(selector, config);
    return trForm;
  }

  input(params: TrivuleInputParms) {
    return new TrivuleInput(params);
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
