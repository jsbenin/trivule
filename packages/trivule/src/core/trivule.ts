import {
  ITrConfig,
  RuleCallBack,
  RulesMessages,
  TrivuleFormConfig,
  TrivuleInputParms,
  ValidatableForm,
} from '../types';
import { TrConfig } from '../tr.config';
import { TrParameter } from './utils/parameter';
import { TrivuleForm } from './form';
import { TrivuleInput } from './input';
import { attrSelector } from '../utils';
import { TR_ATTRIBUTES } from '../constants';
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

    const finalConfig: ITrConfig = {
      ...TrConfig,
      ...config,
    };

    Trivule._instance.parameter.configure(finalConfig);

    Trivule._instance._trForms = [];
    const formAttributeSelector = `form${attrSelector(TR_ATTRIBUTES.FORM)}`;

    const formsToValidate = document.querySelectorAll<HTMLFormElement>(
      `${formAttributeSelector}`,
    );

    formsToValidate.forEach((formElement) => {
      const trForm = Trivule._instance!._form(formElement, {});
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

  /**
   * Set a custom message for a specific validation rule
   * @param rule - The name of the validation rule
   * @param msg - The custom message to display when validation fails
   * @example
   * ```typescript
   * Trivule.message('required', 'Ce champ est obligatoire');
   * Trivule.message('email', 'Veuillez entrer une adresse email valide');
   * ```
   */
  static message(rule: string, msg: string): void {
    const instance = Trivule._instance ?? Trivule.init();
    instance.parameter.ruleRegistry.addMessage(rule, msg);
  }

  /**
   * Set multiple custom messages at once
   * @param messages - An object mapping rule names to custom messages
   * @example
   * ```typescript
   * Trivule.messages({
   *   required: 'Campo requerido',
   *   email: 'Correo electrónico inválido',
   *   minlength: 'Mínimo :arg0 caracteres'
   * });
   * ```
   */
  static messages(messages: RulesMessages): void {
    const instance = Trivule._instance ?? Trivule.init();
    for (const [rule, msg] of Object.entries(messages)) {
      instance.parameter.ruleRegistry.addMessage(rule, msg);
    }
  }

  forms(): TrivuleForm[] {
    return this._trForms;
  }

  /**
   * Static method to get or create a form by selector
   * @param selector CSS selector or HTMLElement for the form
   * @param config Optional configuration for the form
   * @returns The TrivuleForm instance
   * @example
   * ```typescript
   * Trivule.init();
   *
   * const form = Trivule.form('#myForm');
   *
   * form.onSuccess((data) => {
   *   console.log(data.values);
   * });
   *
   * form.onError((data) => {
   *   console.log(data.errors);
   * });
   * ```
   */
  static form(
    selector: ValidatableForm,
    config?: TrivuleFormConfig,
  ): TrivuleForm {
    if (!Trivule._instance) {
      throw new Error(
        '[Trivule] Trivule has not been initialized. Please call Trivule.init() first.',
      );
    }

    const instance = Trivule._instance;

    // Check if form already exists in _trForms
    const existingForm = instance._trForms.find((f) => {
      const element = f.getNativeElement();
      if (typeof selector === 'string') {
        return element === document.querySelector(selector);
      }
      return element === selector;
    });

    if (existingForm) {
      return existingForm;
    }

    // Create new form
    const trForm = instance._form(selector, config ?? {});

    // Check if form element was found
    if (!trForm.getNativeElement()) {
      console.error(
        `[Trivule] Form element not found: "${selector}". Make sure the element exists in the DOM.`,
      );
    }

    instance._trForms.push(trForm);
    return trForm;
  }

  /**
   * Instance method to get or create a form by selector
   * @param selector CSS selector or HTMLElement for the form
   * @param config Optional configuration for the form
   * @returns The TrivuleForm instance
   */
  form(selector: ValidatableForm, config?: TrivuleFormConfig): TrivuleForm {
    return Trivule.form(selector, config);
  }

  private _form(
    selector: ValidatableForm | TrivuleFormConfig,
    config: TrivuleFormConfig,
  ) {
    const trForm = new TrivuleForm(this.parameter);
    trForm.init(selector, config);
    return trForm;
  }

  input(params: TrivuleInputParms) {
    return TrivuleInput.create(params, this.parameter);
  }

  /**
   * Returns the configured attribute prefix
   * @returns The attribute prefix string (e.g., "@v:")
   * Example:
   * ```
   * const trivule = Trivule.init({ attributePrefix: '@v:' });
   * trivule.getAttributePrefix(); // Returns "@v:"
   * ```
   */
  getAttributePrefix(): string {
    return this.parameter.attributePrefix;
  }
}
