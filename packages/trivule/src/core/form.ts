import {
  EventCallback,
  TriggerEvent,
  TrivuleFormConfig,
  TrivuleFormHandler,
  TrivuleInputParms,
  RuleCallBack,
  ValidatableForm,
  ITrivuleInputObject,
  ITrivuleInputCallback,
  ValidatableInput,
  CssSelector,
  TrivuleAttribute,
  FormSuccessData,
  FormErrorData,
  FormFieldError,
  InputValueType,
} from '../types';
import { isNumber } from '../rules';
import {
  getHTMLElementBySelector,
  transformToArray,
  attrSelector,
} from '../utils';
import { TrivuleInput } from './input';
import { TrParameter } from './utils/parameter';

/**
 * TrivuleForm is responsible for applying live validation to an HTML form.
 * Creates an instance of TrivuleForm.
 * Example:
 * ```
 * const formElement = document.getElementById("myForm") as HTMLFormElement;
 * const trivuleForm = new TrivuleForm();
 * trivuleForm.setConfig(formElement);
 * trivuleForm.init();
 * ```
 */
export class TrivuleForm {
  private _eventCallbacks: Record<string, EventCallback[]> = {};
  private _registerInputs: Record<string | number, TrivuleInputParms> = {};

  private __calledCount = 0;
  /**
   * This status indicates the current state of the form
   */
  private _passed = false;

  /**
   * The class that indicates the submit button is enabled
   */
  private _trEnabledClass = 'tr-enabled';
  /**
   * The class that indicates the submit button is disabled
   */
  private _trDisabledClass = 'tr-disabled';

  /**
   * The html form
   */
  private container: HTMLElement | null = null;

  /**
   * The inputs rules
   */
  private _trivuleInputs: Record<string, TrivuleInput> = {};
  /**
   * The submition input
   */
  submitButton!: HTMLElement;

  /**
   * Shared parameter/configuration instance
   */
  parameter: TrParameter;

  private _wasInit = false;
  private _wasBound = false;

  /**
   * Form state properties
   */
  private _isDirty = false;
  private _validated = false;

  /**
   * Events that trigger form validation
   */
  private _triggerEvents: ('input' | 'blur' | 'submit')[] = ['submit'];

  constructor(parameter?: TrParameter) {
    this.parameter = parameter ?? TrParameter.instance();
  }

  /**
   * Private method to get attribute data from an element
   * @param element - The HTMLElement to get attribute from (can be null)
   * @param attribute - The TrivuleAttribute to get
   * @param defaults - Default value if attribute is not found
   * @param toJson - Whether to parse the value as JSON
   * @returns The attribute value or default
   */
  private getAttrData<T = unknown>(
    element: HTMLElement | null | undefined,
    attribute: TrivuleAttribute,
    defaults: unknown = null,
    toJson = false,
  ): T {
    if (!element) {
      return defaults as T;
    }
    const attributePrefix = this.parameter.get('attribute');
    let value = element.getAttribute(`${attributePrefix}${attribute}`);
    if (!!value && toJson) {
      try {
        value = JSON.parse(value);
      } catch (error) {
        value = defaults as string;
      }
    }
    return (value ?? defaults) as T;
  }

  setSubmitButton(selector?: CssSelector) {
    let submitButton: HTMLButtonElement | null = null;
    if (selector) {
      submitButton = getHTMLElementBySelector<HTMLButtonElement>(selector);
    }
    if (!submitButton && this.container) {
      submitButton = this.container?.querySelector<HTMLButtonElement>(
        attrSelector('submit'),
      );
    }

    if (submitButton) {
      this.submitButton = submitButton;
    }
  }

  /**
   * Initializes live validation on the form element with optional configuration.
   * Example:
   * ```
   * const trivuleForm = new TrivuleForm();
   * trivuleForm.init(formElement, config);
   * ```
   */
  init(
    containerOrConfig?: ValidatableForm | TrivuleFormConfig,
    config?: TrivuleFormConfig,
  ) {
    // Handle configuration
    if (
      typeof containerOrConfig === 'string' ||
      containerOrConfig instanceof HTMLElement
    ) {
      // If the first parameter is a container (string or HTMLElement)
      if (config) {
        this.parameter.configure(config);
        if (config.triggerEvents) {
          this._triggerEvents = config.triggerEvents;
        }
      }
      this.bind(containerOrConfig);
    } else {
      // If the first parameter is a config object (or undefined)
      config = config ?? containerOrConfig;
      this.parameter.configure(config);
      if (config?.triggerEvents) {
        this._triggerEvents = config.triggerEvents;
      }
      if (config?.element) {
        this.bind(config.element);
      }
    }

    if (!this._wasInit) {
      this._wasInit = true;

      // this.emit('tr.form.init', this);

      this._onSubmit();

      this.onFails(() => {
        this.disableButton();
      });

      this.onPasses(() => {
        this.enableButton();
      });
    }
  }

  /**
   * Disables the submit button and updates its CSS classes.
   */
  disableButton() {
    if (this.submitButton) {
      this.submitButton.setAttribute('disabled', 'true');
      if (this._trDisabledClass) {
        //removeClass enable
        const classArrayEnabled: string[] = this._trEnabledClass.split(' ');
        for (const value of classArrayEnabled) {
          this.submitButton.classList.remove(value);
        }
        //add class en disabled dataset
        this._trDisabledClass = this.getAttrData(
          this.submitButton,
          'disabled-class',
          this._trDisabledClass,
        );
        const classArray: string[] = this._trDisabledClass.split(' ');
        for (const value of classArray) {
          this.submitButton.classList.add(value);
        }
      }
    }
  }

  /**
   * Enables the submit button and updates its CSS classes based on the configuration.
   *
   * This method checks if the submit button exists and removes the 'disabled' attribute,
   * making the button clickable. It also manages the CSS classes by removing the disabled
   * classes and adding the enabled classes.
   *
   * @remarks
   * - The method will remove the 'disabled' attribute from the submit button, thus enabling it.
   * - It manages the CSS classes by removing the disabled classes and adding the enabled classes
   *   based on the configuration.
   *
   * @example
   * ```typescript
   * this.enableButton();
   * ```
   */
  enableButton() {
    if (this.submitButton) {
      this.submitButton.removeAttribute('disabled');
      if (this._trEnabledClass) {
        //removeClass disabled
        const classArrayDisabled: string[] = this._trDisabledClass.split(' ');
        for (const value of classArrayDisabled) {
          this.submitButton.classList.remove(value);
        }
        //add class en enabled dataset
        this._trEnabledClass = this.getAttrData(
          this.submitButton,
          'enabled-class',
          this._trEnabledClass,
        );
        const classArray: string[] = this._trEnabledClass.split(' ');
        for (const value of classArray) {
          this.submitButton.classList.add(value);
        }
      }
    }
  }

  /**
   * Retrieves all inputs from the form.
   *
   * @param strict If true, returns objects with only the name, value, and validation status of each input; otherwise, returns `TrivuleInput` instances.
   * @returns An array of all inputs based on the strict flag.
   */
  inputs(strict = true): ITrivuleInputObject[] | TrivuleInput[] {
    if (strict) {
      return this.inputsToArray().map(this.getInputsMap);
    }
    return this.inputsToArray();
  }

  /**
   * Retrieves the list of validated inputs.
   * @param strict - If true, returns objects with only name, value, and validation status of each input; otherwise, returns TrivuleInput instances.
   * @returns An array of validated inputs based on the strict flag.
   */
  getValidatedInputs(
    strict: boolean = true,
  ): ITrivuleInputObject[] | TrivuleInput[] {
    if (strict) {
      return this.inputsToArray()
        .filter((t) => t.passes())
        .map(this.getInputsMap);
    }
    return this.inputsToArray().filter((t) => t.passes());
  }

  /**
   * Retrieves the list of failed inputs.
   * @param strict - If true, returns objects with only name, value, and validation status of each input; otherwise, returns TrivuleInput instances.
   * @returns An array of failed inputs based on the strict flag.
   */

  failed(strict: boolean = true): ITrivuleInputObject[] | TrivuleInput[] {
    if (strict) {
      return this.inputsToArray()
        .filter((t) => t.fails())
        .map(this.getInputsMap);
    }
    return this.inputsToArray().filter((t) => t.fails());
  }

  /**
   * Converts a TrivuleInput instance into an ITrivuleInputObject format.
   * @param trivuleInput - The TrivuleInput instance to convert.
   * @returns An object representing the input data: name, value, and validation status.
   */
  private getInputsMap(trivuleInput: TrivuleInput): ITrivuleInputObject {
    return {
      name: trivuleInput.getName(),
      value: trivuleInput.getValue(),
    };
  }

  /**
   * Validate each input and check if the form is valid.
   * @returns A boolean indicating whether the form is valid after validating each input.
   */
  isValid() {
    const passes: boolean[] = [];
    this.each((trInput) => {
      passes.push(trInput.passes());
    });
    return passes.every((pass) => pass);
  }

  /**
   * Validate each input and check if the form is valid.
   * @returns A boolean indicating whether the form is valid after validating each input.
   */
  passes() {
    return this.isValid();
  }

  /**
   * Handle validation before process submtion
   */
  private _onSubmit() {
    const validateCallback = () => {
      const results: boolean[] = [];
      this.each((trInput) => {
        results.push(trInput.validate());
      });

      // Test whether each rule passed
      if (!results.every((passed) => passed)) {
        //submitEvent.preventDefault();
      }

      return this._passed;
    };
    if (this.submitButton) {
      this.submitButton.addEventListener('click', () => {
        validateCallback();
      });
    }
    this.on('submit', (e: Event) => {
      if (!validateCallback()) {
        e.preventDefault();
      }
    });
  }

  /**
   * Defines a new custom validation rule
   * @param name - The name of the rule
   * @param fn - The validation function
   * @param message - Optional custom error message
   * @returns The TrivuleForm instance for method chaining
   * @example
   * ```typescript
   * const form = trivule.form('#myForm');
   *
   * // Simple rule
   * form.defineRule('positive', (value) => ({ passes: Number(value) > 0, value }));
   *
   * // With custom message
   * form.defineRule('strongPassword', (value) => {
   *   return {
   *     passes: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value),
   *     value
   *   };
   * }, 'Password must be strong');
   *
   * // Chainable
   * form
   *   .defineRule('ruleOne', (value) => ({ passes: true, value }))
   *   .defineRule('ruleTwo', (value) => ({ passes: true, value }));
   * ```
   */
  defineRule(name: string, fn: RuleCallBack, message?: string): this {
    this.parameter.ruleRegistry.defineRule(name, fn, message);
    return this;
  }

  /**
   * Attach an event listener to the container element.
   *
   * @param e - The name of the event to listen to.
   * @param fn - The callback function to execute when the event occurs.
   * This function takes an event of type `Event` as a parameter and returns nothing.
   * Example: `(event) => { ... }`
   */
  on(e: string, fn: EventCallback): void {
    if (this.container) {
      this.container.addEventListener(e, fn);
    } else {
      this._addEvents(e, fn);
    }
  }

  /**
   * Emits a custom event to the container element.
   *
   * @param e - The name of the custom event to emit.
   * @param data - The additional data to pass with the event.
   */
  emit(e: string, data?: unknown): void {
    const event = new CustomEvent(e, { detail: data });
    this.container?.dispatchEvent(event);
  }

  /**
   * Attaches an event listener to handle form validation errors.
   * @param fn - The callback function to execute when validation fails.
   * @example
   * ```typescript
   * form.onError((data) => {
   *   console.log(data.errors);     // [{ field: 'email', message: '...' }]
   *   console.log(data.firstError); // { field: 'email', message: '...' }
   *   console.log(data.values);     // Current input values
   * });
   * ```
   */
  onError(fn: (data: FormErrorData) => void): this {
    this.on('tr.form.fails', () => {
      const data = this._getErrorData();
      fn(data);
    });
    return this;
  }

  /**
   * Attaches an event listener to handle successful form validation.
   * @param fn - The callback function to execute when validation passes.
   * @example
   * ```typescript
   * form.onSuccess((data) => {
   *   console.log(data.values); // { email: '...', password: '...' }
   * });
   * ```
   */
  onSuccess(fn: (data: FormSuccessData) => void): this {
    this.on('tr.form.passes', () => {
      const data = this._getSuccessData();
      fn(data);
    });
    return this;
  }

  /**
   * Get success data for callback
   */
  private _getSuccessData(): FormSuccessData {
    const values: Record<string, InputValueType> = {};
    this.each((input) => {
      values[input.getName()] = input.getValue();
    });
    return { values };
  }

  /**
   * Get error data for callback
   */
  private _getErrorData(): FormErrorData {
    const values: Record<string, InputValueType> = {};
    const errors: FormFieldError[] = [];

    this.each((input) => {
      values[input.getName()] = input.getValue();
      if (input.fails()) {
        const messages = input.getMessages();
        const firstMessage = Array.isArray(messages) ? messages[0] : messages;
        errors.push({
          field: input.getName(),
          message: firstMessage || 'Validation failed',
        });
      }
    });

    return {
      errors,
      firstError: errors[0],
      values,
    };
  }

  /**
   * @deprecated Use onError instead
   */
  onFails(fn: TrivuleFormHandler<TrivuleForm>): void {
    this.on('tr.form.fails', (e) => {
      this.__call(fn, (e as CustomEvent).detail);
    });
  }

  /**
   * @deprecated Use onSuccess instead
   */
  onPasses(fn: TrivuleFormHandler<TrivuleForm>): void {
    this.on('tr.form.passes', (e) => {
      this.__call(fn, (e as CustomEvent).detail);
    });
  }

  /**
   * Attaches an event listener to the "tr.form.validate" event.
   * This event is triggered when the form is validated.
   * @param fn - The callback function to execute when the event occurs.
   * Example:
   * ```typescript
   * trivuleForm.onValidate((trivuleForm) => {
   *   console.log("Form validation executed", trivuleForm);
   * });
   * ```
   */
  onValidate(fn: TrivuleFormHandler<TrivuleForm>): void {
    this.on('tr.form.validate', (e) => {
      this.__call(fn, (e as CustomEvent).detail);
    });
  }

  /**
   * Attaches an event listener to the "tr.form.updated" event.
   * When this event is triggered, the method initializes and runs the TrivuleInputs for the form,
   * and then calls the provided function with the form instance as a parameter.
   * @param fn - The function to be called when the event occurs.
   * This function takes the form instance as a parameter and returns nothing.
   * Example:
   * ```typescript
   * trivuleForm.observeChanges((form) => {
   *   console.log("Form updated", form);
   * });
   * ```
   */
  observeChanges(fn?: EventCallback): void {
    this.on('tr.form.updated', () => {
      this._initTrivuleInputs();
      this.__call(fn, this);
    });
  }
  /**
   * Triggers the validation process for the form.
   * This method emits the "tr.form.update" event, which initiates the validation of all form inputs.
   * Example:
   * ```typescript
   * trivuleForm.update ();
   * ```
   */
  update() {
    this.emit('tr.form.updated', this);
  }

  /**
   * Initializes TrivuleInputs for the form.
   */
  private _initTrivuleInputs(inputs?: HTMLElement[]) {
    if (this.container) {
      inputs = inputs
        ? inputs
        : Array.from(
            this.container.querySelectorAll<HTMLElement>(attrSelector('rules')),
          );
      inputs.forEach((el, index) => this._bootInputs({ selector: el }, index));
    }
  }

  /**
   * Invokes the provided function with the given parameters if it is a valid function.
   * @param fn - The function to be called.
   * @param params - The parameters to be passed to the function.
   */
  private __call(fn?: CallableFunction, ...params: unknown[]) {
    if (typeof fn == 'function') {
      fn(...params);
    }
  }

  /**
   * Validate form input using javascript code.
   * Use this method to configure or update the parameters for a particular input in the form.
   *
   * @param inputName - The name of the input for which to specify the parameters.
   * @param params - The additional parameters to set for the input.
   *
   * @example
   * const formElement = document.getElementById("myForm") as HTMLFormElement;
   * const trivuleForm = new TrivuleForm();
   * trivuleForm.setConfig(formElement);
   * // Configure additional parameters for an input
   * trivuleForm.with("inputName", { rules: ['required','email']});
   * trivuleForm.init();
   *
   */
  with(inputName: string, params: TrivuleInputParms) {
    const trivuleInput = this.get(inputName);
    if (trivuleInput) {
      trivuleInput.with(params);
      this._trivuleInputs[inputName] = trivuleInput;
    }
  }
  /**
   * Sets multiple input parameters for multiple inputs in the form.
   * @param inputs - An object containing input names as keys and their corresponding parameters as values.
   * Example:
   * ```typescript
   * const inputs = {
   *   input1: {  TrivuleInputParms for input1   },
   *   input2: {  TrivuleInputParms for input2   },
   *   // ...
   * };
   * trivuleForm.withMany(inputs);
   * ```
   */
  withMany(inputs: Record<string, TrivuleInputParms>) {
    for (const [inputName, params] of Object.entries(inputs)) {
      this.with(inputName, params);
    }
  }

  /**
   * Iterate over each TrivuleInput in the form and execute a callback function.
   * @param call The callback function to be executed for each TrivuleInput.
   */
  each(call: ITrivuleInputCallback<TrivuleInput>) {
    for (const name in this._trivuleInputs) {
      if (Object.prototype.hasOwnProperty.call(this._trivuleInputs, name)) {
        call(this._trivuleInputs[name]);
      }
    }
  }
  /**
   * Retrieve a TrivuleInput by name from the form.
   * @param name The name of the TrivuleInput to retrieve.
   * @returns The TrivuleInput corresponding to the name, or null if not found.
   */
  get(name: string): TrivuleInput | null {
    return this._trivuleInputs[name] ?? null;
  }
  /**
   * Convert the TrivuleInput objects stored in _trivuleInputs to an array.
   * @returns An array containing all TrivuleInput objects.
   */
  inputsToArray() {
    return Object.keys(this._trivuleInputs).map(
      (key) => this._trivuleInputs[key],
    );
  }
  /**
   * Adds a TrivuleInput to the form and performs necessary updates.
   * @param trInput The TrivuleInput instance to add to the form.
   * @remarks This method handles the addition of a TrivuleInput to the form, including setting feedback elements, updating form state based on input validation, and triggering callbacks.
   */
  addTrivuleInput(trInput: TrivuleInput) {
    const inputFeedback = trInput.getFeedbackElement();

    if (!inputFeedback) {
      const fds = this.parameter.getFeedbackSelector(trInput.getName());

      if (fds) {
        trInput.setFeedbackElement(fds);
      }
    }

    // Add input to the collection
    this._trivuleInputs[trInput.getName()] = trInput;
  }

  /**
   * Set the validity state of the TrivuleForm.
   * @param boolean The boolean value indicating the validity state to set.
   * @remarks This method updates the internal validity state of the TrivuleForm based on the provided boolean value.
   * It increments the internal counter for the number of times this method is called.
   * If the validity state changes to true (passed), it triggers the '_emitTrOnPassesEvent' event.
   * If the validity state changes to false (failed), it triggers the '_emitTrOnFailsEvent' event.
   * Finally, it emits a 'tr.form.validate' event with the updated TrivuleForm instance.
   */
  set valid(boolean: boolean) {
    if (this._passed !== boolean) {
      this._passed = boolean;
      this.__calledCount++;
    }
    this.emit('tr.form.validate', this);
  }
  /**
   * Get the current validity state of the TrivuleForm.
   * @returns The boolean value representing the current validity state of the TrivuleForm.
   * @remarks This method retrieves and returns the current validity state of the TrivuleForm.
   */
  get valid() {
    //this._passed = this.isValid();
    return this._passed;
  }
  /**
   * Retrieve all inputs from the form.
   * @returns An array of all inputs in the form.
   */
  all() {
    return this.inputs();
  }
  /**
   * Retrieve the native element associated with the form.
   * @returns The container element of the form.
   */
  getNativeElement() {
    return this.container;
  }

  /**
   * Binds the form element or selector to the TrivuleForm instance once it is an HTMLElement.
   * Can be called without argument,if argument is not provided
   * it attempts to resolve the element using the element selector indicate on the config
   *
   * @param form - The HTML form element or a CSS selector string for the form to bind.
   * If an HTML element is provided, it directly binds the element. If a selector string is provided,
   * it attempts to resolve the element using `getHTMLElementBySelector`.
   *
   * @example
   * // Bind using an HTML element
   * const formElement = document.getElementById("myForm") as HTMLFormElement;
   * const trivuleForm = new TrivuleForm();
   * trivuleForm.bind(formElement);
   *
   * // Bind using a CSS selector
   * const trivuleForm = new TrivuleForm();
   * trivuleForm.bind("#myForm");
   */

  bind(form?: ValidatableForm) {
    if (this._wasBound) {
      return this;
    }
    if (form) {
      const element = getHTMLElementBySelector(form);
      if (element instanceof HTMLElement) {
        this.container = element;
      }
    }
    if (!(this.container instanceof HTMLElement)) {
      if (this.parameter.element) {
        const element = getHTMLElementBySelector(this.parameter.element);
        if (element instanceof HTMLElement) {
          this.container = element;
        }
      }
    }

    if (this.container instanceof HTMLElement) {
      // Read trigger events from form's @v:event attribute
      this._initTriggerEvents();
      this._initTrivuleInputs();
      this._wasBound = true;
      this._resolveInputValidation();
      this._resolveEventListeners();
    }
  }

  /**
   * Initialize trigger events from form's HTML attribute
   * Parses @v:event="submit|input|blur" format on the form element
   */
  private _initTriggerEvents() {
    const attrEvents: string | null = this.getAttrData(
      this.container,
      'event',
      null,
    );

    if (attrEvents) {
      const events = attrEvents
        .split('|')
        .map((e) => e.trim())
        .filter((e): e is TriggerEvent =>
          ['input', 'blur', 'submit'].includes(e),
        );
      if (events.length > 0) {
        this._triggerEvents = events;
      }
    }
  }

  private _addEvents(string: string, call: EventCallback): void {
    if (!this._eventCallbacks[string]) {
      this._eventCallbacks[string] = [call];
    } else {
      this._eventCallbacks[string].push(call);
    }
  }
  /**
   * Attaches event listeners to the container element.
   *
   * This method iterates over the `_eventCallbacks` object,
   * where keys represent event names and *values are arrays of callback functions.
   *
   */
  private _resolveEventListeners() {
    if (this.container instanceof HTMLElement) {
      transformToArray(this._eventCallbacks, (callbacks, event) => {
        callbacks.forEach((fn) => {
          this.container?.addEventListener(event as string, fn);
        });
      });
    }
  }

  private _resolveInputValidation() {
    transformToArray(this._registerInputs, this._bootInputs.bind(this));
  }

  private _bootInputs(
    param: TrivuleInputParms,
    indexOrInputName: string | number,
  ) {
    if (!this.container) {
      this._registerInputs[indexOrInputName] = param;
      return this;
    }

    // Résolution du sélecteur
    let resolvedSelector = param.selector;
    if (param.selector) {
      resolvedSelector =
        getHTMLElementBySelector(param.selector, this.container) ??
        resolvedSelector;
    }
    if (typeof resolvedSelector === 'string') {
      const s = this.parameter.getInputSelector(resolvedSelector);
      resolvedSelector = getHTMLElementBySelector(s as string, this.container);
    }

    if (!resolvedSelector) {
      const name = isNumber(indexOrInputName).passes
        ? undefined
        : indexOrInputName;
      if (name) {
        const s = this.parameter.getInputSelector(name);
        resolvedSelector =
          getHTMLElementBySelector(s as string, this.container) ?? undefined;
      }
    }

    // Create merged params object with all configured properties
    const mergedParams: TrivuleInputParms = {
      ...param,
      selector: resolvedSelector as ValidatableInput,
      validClass: param.validClass ?? this.parameter.validClass,
      invalidClass: param.invalidClass ?? this.parameter.invalidClass,
      feedbackElement: param.feedbackElement ?? this.parameter.feedbackSelector,
      triggerEvents: this._triggerEvents,
    };

    this.addTrivuleInput(TrivuleInput.create(mergedParams, this.parameter));

    return mergedParams;
  }

  /**
   * Get whether the form has been interacted with
   */
  get isDirty(): boolean {
    return this._isDirty;
  }

  /**
   * Get whether the form has been validated at least once
   */
  get validated(): boolean {
    return this._validated;
  }

  /**
   * Get the current form state
   */
  get formState() {
    return { isDirty: this._isDirty, validated: this._validated };
  }
}
