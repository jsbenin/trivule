import {
  CssSelector,
  EventCallback,
  InputValueType,
  InputType,
  ITrivuleInput,
  ITrivuleInputCallback,
  Rule,
  RuleCallBack,
  TrivuleAttribute,
  TrivuleHooks,
  TrivuleInputParms,
  ValidatableInput,
} from '../types';
import { getHTMLElementBySelector } from '../utils';
import { InputRule } from './utils/input-rule';
import { TrParameter } from './utils/parameter';
import { TrValidation } from './validate';

/**
 * TrivuleInput is responsible for applying live validation to an HTML input element.
 * Creates an instance of TrivuleInput.
 * @param param Required configuration object for TrivuleInput.
 * @param parameter Required TrParameter instance for the TrivuleInput.
 * Example:
 * ```
 * const params = {
 *   selector: "#myInput",
 *   rules: ['required', 'email']
 * };
 * const parameter = new TrParameter();
 * const trivuleInput = TrivuleInput.create(params, parameter);
 * trivuleInput.init();
 * ```
 */
export class TrivuleInput {
  protected __wasInit = false;
  /**
   * This status indicates the current state of the form
   */
  protected _passed = false;
  /**
   * Trivule Validator
   */
  protected validator!: TrValidation;
  /** Input element which must be validate */
  protected inputElement!: HTMLInputElement;
  /** Error feedback element */
  protected feedbackElement: HTMLElement | null = null;

  /**
   * Rules list
   */
  protected rules!: InputRule;

  /** Current input errors */
  protected _errors: string[] = [];

  /** Wich class assign to input if validation pass */
  protected validClass = '';

  /** Wich class assign to input if validation failed */
  protected invalidClass = 'is-invalid';

  protected param: TrivuleInputParms = {
    emitEvent: true,
    autoValidate: true,
    validClass: '',
    invalidClass: 'is-invalid',
    type: 'text',
    realTime: true,
  };

  protected parameter: TrParameter;

  autoValidate = true;
  protected _value: InputValueType = undefined;
  private _emitOnValidate: boolean = true;

  protected _type: InputType = 'text';
  protected realTime: boolean = false;
  protected _events = ['change', 'blur', 'input'];

  private constructor(param: TrivuleInputParms, parameter: TrParameter) {
    this.parameter = parameter;
    this.validator = new TrValidation();
    this.rules = new InputRule(
      [],
      undefined,
      undefined,
      this.parameter.ruleRegistry,
    );

    this.setParams(param);
    this._init();
    this.init();
  }

  /**
   * @param param TrivuleInputParms (required)
   * @param parameter TrParameter instance (required)
   * @returns A new TrivuleInput instance
   */
  static create(
    param: TrivuleInputParms,
    parameter: TrParameter,
  ): TrivuleInput {
    return new TrivuleInput(param, parameter);
  }

  /**
   * Initializes live validation on the input element.
   * Example:
   * ```
   * const trivuleInput = new TrivuleInput(inputElement);
   * trivuleInput.init();
   * ```
   */
  init() {
    if (!this.__wasInit) {
      this.executeHooks('before.init');
      if (this.autoValidate) {
        this.__wasInit = true;
        this.events.forEach((e) => {
          this.inputElement.addEventListener(e, () => {
            if (!this.realTime) {
              if (e != 'input' && e != 'keyup' && e != 'keydown') {
                this.value = this.getInputElemenyValue();
                this.emit('tr.input.update', {
                  detail: {
                    rules: this.rules,
                    input: {},
                    element: this.inputElement,
                  },
                });
              }
            } else {
              this.value = this.getInputElemenyValue();
              this.emit('tr.input.update', {
                detail: {
                  rules: this.rules,
                  input: {},
                  element: this.inputElement,
                },
              });
            }
          });
        });
      }
      this.executeHooks('after.init');
    }
  }
  /**
   * Add new rule to input element
   * @param ruleName
   * @param call
   * @param message
   */
  rule(ruleName: string, call: RuleCallBack, message?: string) {
    this.parameter.ruleRegistry.defineRule(ruleName, call, message);
  }

  with(param: TrivuleInputParms) {
    this.setParams(param);
  }

  whereName(inputName: string): boolean {
    return this.name === inputName;
  }

  onFails(fn: EventCallback) {
    this.on('tr.input.fails', () => {
      this.__call(fn, this);
    });
  }

  onPasses(fn: EventCallback) {
    this.on('tr.input.passes', () => {
      this.__call(fn, this);
    });
  }

  onUpdate(fn: EventCallback) {
    this.on('tr.input.update', () => {
      this.__call(fn, this);
    });
  }

  destroy() {
    this.param.events?.forEach((e) => {
      this.inputElement.removeEventListener(e, () => {
        this.validate();
      });
    });
    this.param.events = [];
    this.rules.clear();
    this.param.rules = [];
    this.executeHooks('destroy');
  }

  is(input: HTMLInputElement) {
    return input === this.inputElement;
  }
  private hooks: Record<TrivuleHooks, ITrivuleInputCallback<ITrivuleInput>[]> =
    {
      'before.init': [],
      'after.init': [],
      destroy: [],
    };
  _validateCount = 0;
  /**
   * Check if pass event should be emitted
   */
  private _emitOnPasses = true;
  /**
   * Check if fails event should be emitted
   */
  private _emitOnFails = true;

  /**
   * Private method to get attribute data from the input element
   * @param attribute - The TrivuleAttribute to get
   * @param defaults - Default value if attribute is not found
   * @param toJson - Whether to parse the value as JSON
   * @returns The attribute value or default
   */
  private getAttrData<T = unknown>(
    attribute: TrivuleAttribute,
    defaults: unknown = null,
    toJson = false,
  ): T {
    if (!this.inputElement) {
      return defaults as T;
    }

    const attributePrefix = this.parameter.get('attribute');
    let value = this.inputElement.getAttribute(
      `${attributePrefix}${attribute}`,
    );

    if (!!value && toJson) {
      try {
        value = JSON.parse(value);
      } catch (error) {
        value = defaults as string;
      }
    }
    return (value ?? defaults) as T;
  }

  /**
   * Performs validation on the input element. And emits tr.input.validated event if necessary.
   * @returns true if the input element is valid, false otherwise.
   * Example:
   * ```
   * const trivuleInput = new TrivuleInput(inputElement);
   * const isValid = trivuleInput.validate();
   * if (isValid) {
   *   // Proceed with form submission or handle valid input
   * } else {
   *   // Display error messages or handle invalid input
   * }
   * ```
   */
  validate() {
    this.valid();
    this.setValidationClass();
    this.errors = this.validator.getErrors();
    if (this.emitOnValidate) {
      this.emitChangeEvent();
    }
    return this._passed;
  }

  /**
   * Returns the validation rules defined for the input element.
   * @returns An array of validation rules.
   * Example:
   * ```
   * const trivuleInput = new TrivuleInput(inputElement);
   * const rules = trivuleInput.getRules();
   * console.log(rules); // Output: ['required', 'email']
   * ```
   */
  getRules() {
    return this.rules.all();
  }
  /**
   * Checks if the input element has validation rules.
   * @returns A boolean indicating if rules are defined.
   * Example:
   * ```
   * const trivuleInput = new TrivuleInput(inputElement);
   * const hasRules = trivuleInput.hasRules();
   * console.log(hasRules); // Output: true or false
   * ```
   */
  hasRules() {
    return this.rules.length > 0;
  }

  /**
   * Get the validation messages associated with the input element.
   * @returns An object containing the validation messages.
   * Example:
   * ```
   * const trivuleInput = new TrivuleInput(inputElement);
   * const messages = trivuleInput.getMessages();
   * console.log(messages);
   * ```
   */
  getMessages() {
    return this.messages;
  }

  /**
   * Performs validation on the input element using the defined validation rules. Don't emit tr.input.passes or tr.input.fails event
   * @returns true if the input element is valid, false otherwise.
   * Example:
   * ```
   * const trivuleInput = new TrivuleInput(inputElement);
   * const isValid = trivuleInput.valid();
   * if (isValid) {
   *   // Proceed with form submission or handle valid input
   * } else {
   *   // Display error messages or handle invalid input
   * }
   * ```
   */
  valid() {
    this._validateCount++;
    return (this._passed = this.validator.validate(
      this.rules.all(),
      this.value,
      this._type,
    ));
  }

  /**
   * Emits a custom event to the inputElement element.
   *
   * @param e - The name of the custom event to emit.
   * @param data - The additional data to pass with the event.
   */
  emit(e: string, data?: unknown): void {
    const event = new CustomEvent(e, { detail: data });
    this.inputElement.dispatchEvent(event);
  }

  /**
   * Attach an event listener to the inputElement element.
   *
   * @param e - The name of the event to listen to.
   * @param fn - The callback function to execute when the event occurs.
   * This function takes an event of type `Event` as a parameter and returns nothing.
   * Example: `(event) => { ... }`
   */
  on(e: string, fn: EventCallback): void {
    this.inputElement.addEventListener(e, fn);
  }
  /**
   * Emit event if input change
   */
  private emitChangeEvent() {
    if (this._passed) {
      if (this._emitOnPasses) {
        this.emit('tr.input.passes', {
          detail: {
            rules: this.rules,
            input: {},
            element: this.inputElement,
          },
        });
        //Disable on passes emition until, validation failed
        this._emitOnPasses = false;
        //Enable on fails emitions
        this._emitOnFails = true;
      }
    } else {
      if (this._emitOnFails) {
        this.emit('tr.input.fails', {
          detail: {
            rules: this.rules,
            input: {},
            element: this.inputElement,
          },
        });
        //Enable on passes emitions
        this._emitOnPasses = true;
        // Disable on fails emitions, until validation passes
        this._emitOnFails = false;
      }
    }
  }

  getErrors(): Record<string, string> {
    return this.validator.getErrors();
  }
  /**
   * Check if the input element has failed validation.
   * @returns `true` if the input element has failed validation, `false` otherwise.
   * Example:
   * ```
   * const trivuleInput = new TrivuleInput(inputElement);
   * if (trivuleInput.fails()) {
   *   console.log('Validation failed');
   * } else {
   *   console.log('Validation succeeded');
   * }
   * ```
   */
  fails(): boolean {
    return !this.passes();
  }
  /**
   *  Check if the validation was successful passed
   * @returns
   */
  passes() {
    return this.valid();
  }
  /**
   * Invokes the provided function with the given parameters if it is a valid function.
   * @param fn - The function to be called.
   * @param params - The parameters to be passed to the function.
   */
  protected __call(fn?: CallableFunction, ...params: unknown[]) {
    if (typeof fn == 'function') {
      fn(...params);
    }
  }

  filledErrors(errors?: string[]) {
    this.errors = errors ?? this.validator.getErrors();
  }

  /**
   * Sets the CSS class to be applied when the input is considered invalid.
   * @param className The CSS class name to set.
   * @returns This Trivule input instance.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.setInvalidClass("error"); // Sets the CSS class "error" to be applied when the input is invalid
   */
  setInvalidClass(className: string): this {
    this.invalidClass = className;
    return this;
  }
  /**
   * Sets the value of the input element.
   * @param value The value to set for the input element.
   * @returns This Trivule input instance.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.setValue("example"); // Sets the value of the input element to "example"
   */
  setValue(value: string): this {
    this.value = value;
    return this;
  }
  /**
   * Sets the CSS class to be applied when the input is considered valid.
   * @param className The CSS class name to set.
   * @returns This Trivule input instance.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.setValidClass("success"); // Sets the CSS class "success" to be applied when the input is valid
   */
  setValidClass(className: string): this {
    this.validClass = className;
    return this;
  }
  /**
   * Sets whether the input should be automatically validated as the user interacts with it.
   * @param autoValidate A boolean value indicating whether auto-validation should be enabled.
   * @returns This Trivule input instance.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.setAutoValidate(true); // Enables auto-validation for the input
   */
  setAutoValidate(autoValidate: boolean): this {
    this.autoValidate = autoValidate;
    return this;
  }
  /**
   * Sets the events that trigger validation of the input.
   * @param eventTriggers The event or events that trigger validation.
   * @returns This Trivule input instance.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.setEventTriggers(["input", "change"]); // Sets events "input" and "change" to trigger validation
   */
  setEventTriggers(eventTriggers: string | string[]): this {
    this.events = this.eventToArray(eventTriggers);
    return this;
  }

  /**
   * Sets the type of the input element.
   * @param type The type of the input element.
   * @returns This Trivule input instance.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.setType("email"); // Sets the type of the input element to "email"
   */
  setType(type: string): this {
    this._type = type as InputType;
    return this;
  }

  /**
   * Sets a callback function to execute before initializing the Trivule input.
   * @param callback The callback function to execute.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.beforeInit((input) => { console.log("Before init:", input); }); // Sets a callback to execute before initializing the Trivule input
   */
  beforeInit(callback: ITrivuleInputCallback<ITrivuleInput>): this {
    this.addHook('before.init', callback);
    return this;
  }

  /**
   * Sets a callback function to execute after initializing the Trivule input.
   * @param callback The callback function to execute.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.afterInit((input) => { console.log("After init:", input); }); // Sets a callback to execute after initializing the Trivule input
   */
  afterInit(callback: ITrivuleInputCallback<ITrivuleInput>): this {
    this.addHook('after.init', callback);
    return this;
  }
  /**
   * Sets a callback function to execute when a rule fails for this input.
   * @param rule The rule name for which the callback is set.
   * @param callback The callback function to execute.
   * @returns This Trivule input instance.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.onRuleFail("required", (input) => { console.log("Rule failed:", input); }); // Sets a callback for when the "required" rule fails
   */
  onRuleFail(
    rule: string | Rule,
    callback: ITrivuleInputCallback<ITrivuleInput>,
  ): this {
    this.addHook(`after.fails.${rule}`, callback);
    return this;
  }
  /**
   * Sets a callback function to execute when a rule passes for this input.
   * @param rule The rule name for which the callback is set.
   * @param callback The callback function to execute.
   * @returns This Trivule input instance.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.onRulePass("required", (input) => { console.log("Rule passed:", input); }); // Sets a callback for when the "required" rule passes
   */
  onRulePass(
    rule: string | Rule,
    callback: ITrivuleInputCallback<ITrivuleInput>,
  ): this {
    this.addHook(`after.passes.${rule}`, callback);
    return this;
  }
  /**
   * Triggers the validation event manually.
   * @param boolean A boolean value indicating whether to trigger the validation event.
   * @returns This Trivule input instance.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.triggerValidateEvent(true); // Manually triggers the validation event
   */
  triggerValidateEvent(boolean: boolean = true): this {
    this.emitOnValidate = boolean;
    return this;
  }
  /**
   * Sets whether validation should stop after the first error is encountered.
  /**
   * Gets the feedback element associated with this Trivule input.
   * @returns The feedback element if set, otherwise null.
   */
  getFeedbackElement() {
    return this.feedbackElement;
  }
  getRealTimeState() {
    return this.realTime;
  }

  /**
   * Checks if the Trivule input has a specific validation rule.
   *
   * @param rule The name of the rule to check for.
   * @returns  True if the rule exists, false otherwise.
   *
   * @example
   * ```typescript
   * console.log(trivuleInput.hasRule('required')); // Output: true
   * ```
   */
  hasRule(rule: string): boolean {
    return this.rules.has(rule);
  }

  /**
   * Enables real-time validation for the Trivule input. This means that validation will be performed on any event specified in the `events` property (e.g., 'change', 'blur', 'input') as the user interacts with the input.
   *
   * @returns This Trivule input instance.
   */
  enableRealTime() {
    this.realTime = true;
    return this;
  }
  /**
   * Disables real-time validation for the Trivule input. Validation will only be triggered manually or on form submission.
   *
   * @returns This Trivule input instance.
   */
  disableRealTime() {
    this.realTime = false;
    this.events = this._events;
    return this;
  }
  /**
   * Checks if real-time validation is enabled for the Trivule input.
   *
   * @returns True if real-time validation is enabled, false otherwise.
   */
  isRealTimeEnabled() {
    return this.realTime;
  }

  /**
   * Sets the validation rules for this Trivule input instance.
   * @param rules The validation rules to set.
   * @returns This Trivule input instance.
   */
  setRules(rules: Rule[] | string[] | Rule | string) {
    this.$rules.set(rules);
    return this;
  }

  /**
   * Sets the event listeners for the input element.
   * This method determines which events will trigger the validation based on
   * the parameters provided or the attributes defined on the input element.
   *
   * @param events - An optional array of event names to be used for validation. If not provided, it will use the default or attribute-defined events.
   *
   * @example
   * // Setting custom events for validation
   * trivuleInput._setEvent(['focus', 'blur']);
   *
   * // Using attribute-defined events
   * const inputElement = document.querySelector('input[name="email"]');
   * inputElement.setAttribute('data-tr-events', 'input|change');
   * trivuleInput._setEvent();
   */

  protected _setEvent(events?: string[]) {
    const ev = this.getAttrData<string | undefined>('events', undefined);

    if (ev) {
      events = ev.split('|').length ? ev.split('|') : this.param.events;
    }

    this.events = this.eventToArray(events ?? this.param.events);
  }

  /**
   * Sets the input element for validation.
   * This method should be called before calling the 'init' method.
   * @param {ValidatableInput} inputElement - The input element or selector string representing the input element.
   * @throws {Error} If the input element is not valid or cannot be found.
   */
  setInputElement(inputElement: ValidatableInput) {
    if (!(inputElement instanceof Element)) {
      const el = document.querySelector<HTMLElement>(inputElement);
      if (el) {
        inputElement = el as ValidatableInput;
      }
    }

    if (!(inputElement instanceof Element)) {
      throw new Error(
        "The 'inputElement' parameter must be a valide 'ValidatableInput' type. " +
          `"${inputElement} provided"`,
      );
    }

    this.inputElement = inputElement as HTMLInputElement;
    this.param.type = this.inputElement.type;
    if (this.inputElement.tagName.toLowerCase() === 'textarea') {
      this.param.type = 'text';
    }

    return this;
  }

  get name() {
    return this.inputElement.name ?? this.param.name ?? '';
  }
  get value() {
    return this.getValue();
  }
  set value(value) {
    this._value = value;
    if (this.autoValidate) {
      this.validate();
    }
  }

  set errors(value: string[] | Record<string, string>) {
    if (value) {
      if (!Array.isArray(value)) {
        value = Object.keys(value).map(
          (k) => (value as Record<string, string>)[k],
        );
      }
      this._errors = value ?? [];
    }
    this.showErrorMessages();
  }

  /**
   * Sets the element used to display feedback messages for this input.
   * @param selector The CSS selector or element representing the feedback element.
   * @returns This Trivule input instance.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.setFeedbackElement(".feedback"); // Sets the feedback element using CSS selector ".feedback"
   */
  setFeedbackElement(selector?: CssSelector | null) {
    let feedbackElement: HTMLElement | null = null;
    if (selector instanceof HTMLElement) {
      feedbackElement = selector;
    } else {
      let parentElement = this.inputElement.parentElement;
      const inputFeedbackSelector = this.param.feedbackElement;

      if (inputFeedbackSelector) {
        this.parameter.setFeedbackSelector(inputFeedbackSelector);
      }

      selector ??= this.parameter.getFeedbackSelector(this.name);

      if (!selector) {
        return;
      }

      do {
        feedbackElement = selector
          ? getHTMLElementBySelector(selector, parentElement)
          : feedbackElement;
        if (feedbackElement) {
          break;
        }

        parentElement = parentElement?.parentElement || null;
      } while (!!parentElement && !feedbackElement);
    }

    this.feedbackElement = feedbackElement;

    return this;
  }

  /**
   * Shows error messages based on the value of the "tr-show" attribute
   * The "showMessage" property determines how the error messages are displayed.
   *
   */
  private showErrorMessages() {
    this.feedbackElement instanceof HTMLElement;

    //If feedback element existe
    if (this.feedbackElement instanceof HTMLElement) {
      let message = '';
      if (Array.isArray(this._errors)) {
        message = this._errors[0];
      }
      this.feedbackElement.innerHTML = message ?? '';
    }
  }

  private _setTrValidationClass() {
    this.invalidClass = this.param.invalidClass ?? this.invalidClass;
    this.validClass = this.param.validClass ?? this.validClass;

    this.invalidClass = this.getAttrData('invalid-class', this.invalidClass);
    this.validClass = this.getAttrData('valid-class', this.validClass);
  }

  protected setValidationClass() {
    const isValid = this._passed;
    const removeClass = (cls: string) => {
      if (cls.length > 0) {
        this.inputElement.classList.remove(cls);
      }
    };
    const addClass = (cls: string) => {
      if (cls.length > 0) {
        this.inputElement.classList.add(cls);
      }
    };

    if (isValid) {
      this.invalidClass.split(' ').forEach(removeClass);
      this.validClass.split(' ').forEach(addClass);
    } else {
      this.validClass.split(' ').forEach(removeClass);
      this.invalidClass.split(' ').forEach(addClass);
    }
  }

  /**
   * Retrieves the current name of the input element.
   * @returns
   */
  getName() {
    return this.name;
  }
  /**
   * Retrieves the current value of the input element.
   * This method handles different input types, such as 'file', and returns the appropriate value.
   *
   * @returns The value of the input element. For file inputs, it returns the selected files; for other inputs, it returns the element's value.
   *
   * @example
   * // Getting the value of a text input
   * const value = trivuleInput.getInputElemenyValue();
   *
   * // Getting the files of a file input
   * const files = fileInput.getInputElemenyValue();
   */
  getInputElemenyValue() {
    if (this.inputElement.type.toLowerCase() == 'file') {
      return this.inputElement.files ?? null;
    } else {
      return this.inputElement.value;
    }
  }

  /**
   * Retrieves the current value of the input element.
   * @returns
   */
  getValue() {
    return this.getInputElemenyValue();
  }
  /**
   * Sets the parameters for this Trivule input instance.
   * @param params The parameters to set.
   * @returns This Trivule input instance.
   */
  setParams(param?: TrivuleInputParms) {
    if (typeof param === 'object' && typeof param !== 'undefined') {
      this.param = { ...this.param, ...param };
    }
    let json = null;
    if (this.inputElement) {
      const value = this.inputElement.getAttribute('data-tr');
      if (value) {
        try {
          json = JSON.parse(value);
        } catch (error) {
          json = null;
        }
      }
    }
    if (json) {
      this.param = Object.assign(this.param, json);
    }

    return this;
  }
  /**
   * Sets the attribute name used to identify feedback messages for this input.
   * @param attrName The name of the attribute used for feedback messages.
   * @returns This Trivule input instance.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.setMessageAttributeName("data-feedback"); // Sets the feedback message attribute to "data-feedback"
   */
  setMessageAttributeName(attrName?: string): this {
    this.validator.attribute = attrName ?? this.name;
    return this;
  }

  /**
   * Initializes the Trivule input instance.
   * This method sets up the input element from params, feedback element,
   * validation rules, and event listeners for the input validation.
   *
   * @throws {Error} If the input element is not valid or cannot be found.
   */
  private _init() {
    const selector = this.param.selector;

    if (!selector) {
      throw new Error('Input selector is required in TrivuleInputParms');
    }

    this.setInputElement(selector)
      .setMessageAttributeName()
      .setFeedbackElement();

    this._setTrValidationClass();

    this._setEvent(this.param.events ?? this._events);

    //Set the validation rules
    const rules: string | string[] | Rule[] | undefined = this.getAttrData(
      'rules',
      this.param.rules,
    );

    if (rules) {
      const elMessages = this.getAttrData<string>(
        'messages',
        this.param.messages,
      );
      this.rules.set(rules, elMessages);
    }

    this._type = (this.param.type ?? 'text') as InputType;
    this.realTime = this.param.realTime ?? this.realTime;
  }
  /**
   * Get the name of the attribute that
   * will be displayed in the message instead of :field
   * @returns
   */
  getMessageAttributeName() {
    return this.validator.attribute;
  }
  /**
   * Retrieves the current rules messages.
   * @returns
   */
  get messages() {
    return this.rules.getMessages();
  }

  get emitOnValidate() {
    return this._emitOnValidate;
  }

  set emitOnValidate(value: boolean) {
    this._emitOnValidate = value;
  }
  set events(value: string[]) {
    this._events = value;
  }

  get events() {
    return this._events;
  }

  protected eventToArray(value?: string | string[]) {
    let values: string[] = [];
    if (typeof value !== 'string') {
      if (!Array.isArray(value)) {
        return [];
      }
      values = value;
    }
    if (typeof value === 'string') {
      values = value.split('|');
    }
    return values.map((t: string) => t.trim());
  }

  get $rules() {
    return this.rules;
  }

  /**
   * Adds a callback to be executed for a specific hook.
   * @param hook The name of the hook.
   * @param callback The callback function to be executed when the hook is triggered.
   */
  private addHook(
    hook: TrivuleHooks,
    callback: ITrivuleInputCallback<ITrivuleInput>,
  ): void {
    if (!this.hooks[hook]) {
      this.hooks[hook] = [];
    }
    this.hooks[hook].push(callback);
  }

  /**
   * Execute all callbacks for a specific hook.
   * @param hook The name of the hook.
   */
  private executeHooks(hook: TrivuleHooks): void {
    const callbacks = this.hooks[hook];
    if (callbacks) {
      callbacks.forEach((callback) => callback(this));
    }
  }
}
