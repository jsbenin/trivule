import {
  ITrConfig,
  RuleCallBack,
  TrivuleFormConfig,
  TrivuleInputParms,
  ValidatableForm,
} from '../contracts';
import { TrConfig } from '../tr.config';
import { TrBag } from './tr-bag';
import { TrivuleForm } from './tr-form';
import { TrivuleInput } from './tr-input';
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
   * Default configuration
   */
  protected config: ITrConfig = TrConfig;

  /**
   * Private constructor to prevent direct instantiation
   */
  private constructor() {}

  /**
   * Static method to get or create the singleton instance
   * @param config Optional configuration object for Trivule
   * @returns The singleton Trivule instance
   */
  static init(config?: ITrConfig): Trivule {
    if (!Trivule._instance) {
      Trivule._instance = new Trivule();
    }

    Trivule._instance.setConfig(config);
    Trivule._instance._trForms = [];

    document
      .querySelectorAll<HTMLFormElement>('form')
      .forEach((formElement) => {
        const trForm = new TrivuleForm(formElement, Trivule._instance!.config);
        trForm.init();
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
    TrBag.rule(ruleName, call, message);
  }

  forms(): TrivuleForm[] {
    return this._trForms;
  }

  /**
   * Set default configuration
   * @param config
   */
  protected setConfig(config?: ITrConfig) {
    this.config = TrConfig;

    if (config && typeof config === 'object') {
      this.config = { ...this.config, ...config };
    }
  }

  static Rule(ruleName: string, call: RuleCallBack, message?: string) {
    TrBag.rule(ruleName, call, message);
  }
  form(
    selector: ValidatableForm | TrivuleFormConfig,
    config: TrivuleFormConfig,
  ) {
    const trForm = new TrivuleForm(selector, config);
    trForm.init();
    return trForm;
  }

  input(params: TrivuleInputParms) {
    return new TrivuleInput(params);
  }
}
