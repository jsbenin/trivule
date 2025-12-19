/**
 * List of Trivule rules grouped by Rule type
 */
export type Rule =
  | 'required'
  | 'email'
  | 'max_length'
  | 'min_length'
  | 'min'
  | 'max'
  | 'string'
  | 'between'
  | 'start_with'
  | 'end_with'
  | 'contains'
  | 'in'
  | 'integer'
  | 'int'
  | 'number'
  | 'len'
  | 'length'
  | 'numeric'
  | 'max_file_size'
  | 'min_file_size'
  | 'size'
  | 'file'
  | 'boolean'
  | 'start_with_upper'
  | 'nullable'
  | 'start_with_lower'
  | 'password'
  | 'date'
  | 'before'
  | 'after'
  | 'url'
  | 'time'
  | 'start_with_string'
  | 'end_with_string'
  | 'has_letter'
  | 'excludes'
  | 'regex'
  | 'lower'
  | 'upper'
  | 'string_between'
  | 'modulo'
  | 'mod'
  | 'only'
  | 'mimes'
  | 'digit'
  | 'min_digit'
  | 'max_digit'
  | 'less_than'
  | 'greater_than'
  | 'gthan'
  | 'lthan'
  | 'file_between'
  | 'date_between'
  | 'number_between'
  | 'equals'
  | 'not_equals';

export type ITrivuleInputCallback<P> = (param: P) => void;

/**
 * Configuration interface
 */
export interface ITrConfig {
  invalidClass?: string;
  validClass?: string;
  feedbackSelector?: CssSelector;
  attributePrefix?: string;
}

export type RuleParam = string | number | undefined;

export interface ITrivuleInputObject {
  value: InputValueType;
  name: string;
}
export type RuleType = {
  name: string;
  message?: string;
  params?: RuleParam;
  callback?: RuleCallBack;
};

export type InputType =
  | 'text'
  | 'date'
  | 'boolean'
  | 'number'
  | 'file'
  | 'date-local';

/**
 * Valid trigger events for validation
 */
export type TriggerEvent = 'input' | 'blur' | 'submit';

export type ValidationState = {
  passes: boolean;
  value: unknown;
  alias?: Rule;
  type?: InputType;
  message?: string[];
};
export interface ITrivuleInput {
  getMessageAttributeName(): string;
  hasRule(rule: Rule | string): boolean;

  getRules(): RuleType[];
}

/**
 * tr.input.validated event details
 */
export type InputEventDetails = {
  rules: Rule[];
  element: HTMLInputElement | HTMLTextAreaElement;
  input: Record<string, string>;
};

/**
 * Input change event
 */
export interface InputChangeEvent {
  details: InputEventDetails;
}

/**
 * Rule callback
 */
export interface RuleCallBack<E = unknown> {
  (
    input: unknown,
    param?: RuleParam,
    type?: InputType,
    element?: E,
  ): ValidationState;
}

export type RulesBag = {
  [ruleName in Rule]: RuleCallBack;
};

export type RulesMessages = {
  [key: string]: string;
};

/**
 * Represents a CSS selector that can be either an HTMLElement or a string.
 * @typedef {HTMLElement | string} CssSelector
 */
export type CssSelector = HTMLElement | string;

/**
 * Represents a validatable HTML form input element.
 */
export type ValidatableInput =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLElement
  | HTMLSelectElement
  | 'select'
  | 'textarea'
  | 'input'
  | string;

/**
 * Represents a validatable HTML form element.
 */
export type ValidatableForm = CssSelector;
/**
 * The possible input types expected to be gotten
 */
export type InputValueType =
  | string
  | Blob
  | File
  | number
  | null
  | boolean
  | undefined
  | FileList
  | File[]
  | Blob[]
  | Record<string, unknown>;

/**
 * An Element or null type
 */
export type ElementOrNull = HTMLElement | null;

/**
 * Indicates whether the message should be displayed
 */
export type WayDisplayError = 'first' | 'last' | 'full';

/**
 * Input parameters that can be passed to TrivuleInput instance
 */
export type TrivuleInputParms = {
  selector?: ValidatableInput | null;
  /**
   * The HTML element that will be used to display error messages for this input element.
   */
  feedbackElement?: CssSelector | null;
  /**
   * An array of rules that will be used to validate the input element.
   */
  rules?: Rule[] | string[] | Rule | string;

  /**
   * The name of the input element.
   */
  name?: string;
  /**
   * The way that error messages will be displayed.
   */
  showMessage?: WayDisplayError;
  /**
   * An array of events that will trigger validation of the input element.
   */
  events?: string[];
  /**
   * Check if input will be validated when user tape into input
   */
  autoValidate?: boolean;

  /**
   * The attribute that will be used to display the error message instead of using the input name directly
   */
  attribute?: string;

  /**
   * If this field is true, each time the validation has been performed,
   * a tr.input.validated event will be emitted, on which we can connect listeners for example
   */
  emitEvent?: boolean;

  /**
   * The css class that will be added to the input each time the form is valid
   */
  validClass?: string;

  /**
   * The css class that will be added to the input each time the form is invalid
   */
  invalidClass?: string;
  /**
   * Indicates input type
   */
  type?: string;

  /**
   * Events that trigger validation for this input
   */
  triggerEvents?: TriggerEvent[];

  /**
   * Time in milliseconds to debounce validation
   */
  debounce?: number;
};

/**
 * Callback function for handling events.
 *
 * @param event - The event object.
 */
export type EventCallback = (event: Event) => unknown;

/**
 * Callback function for handling events.
 *
 * @param details - The event object.
 */
export type EventCallbackWithDetails<T> = (details: T) => void;
export type TrivuleFormConfig = {
  /**
   * The css valid class  that will be added to all the input in  the form
   */
  validClass?: string;

  /**
   * The css invalid class that will be added to all the input in the form
   */
  invalidClass?: string;

  feedbackSelector?: CssSelector;
  element?: ValidatableForm;
  /**
   * Events that trigger form validation ('input', 'blur', 'submit')
   */
  triggerEvents?: TriggerEvent[];
};

export type TrivuleHooks = 'before.init' | 'after.init' | 'destroy' | string;

/**
 * Data passed to onSuccess callback
 */
export type FormSuccessData = {
  /** Object with validated input values keyed by input name */
  values: Record<string, InputValueType>;
};

/**
 * Error information for a single field
 */
export type FormFieldError = {
  /** Name of the field that failed validation */
  field: string;
  /** Error message for the field */
  message: string;
  /** Rule that failed */
  rule?: string;
};

/**
 * Data passed to onError callback
 */
export type FormErrorData = {
  /** Array of field errors */
  errors: FormFieldError[];
  /** First error for convenience */
  firstError?: FormFieldError;
  /** Current input values */
  values: Record<string, InputValueType>;
};

/**
 * Handler function for TrivuleForm lifecycle events
 * @template T - The TrivuleForm type (generic to avoid circular dependency)
 */
export type TrivuleFormHandler<T = unknown> = (tr: T) => unknown;

/**
 * Service interface for extending Trivule functionality
 * @template T - The Trivule class type (generic to avoid circular dependency)
 */
export interface TrivuleService<T = unknown> {
  /**
   * Register service with Trivule instance
   * @param trivule The Trivule class
   */
  register(trivule: T): void;
}

/**
 * Closure-based service function type
 * @template T - The Trivule class type (generic to avoid circular dependency)
 */
export type TrivuleServiceFunction<T = unknown> = (trivule: T) => void;

export type TrivuleAttribute =
  | 'rules'
  | 'events'
  | 'msg'
  | 'invalid-class'
  | 'valid-class'
  | 'feedback'
  | 'submit'
  | 'enabled-class'
  | 'disabled-class'
  | 'name'
  | 'lang'
  | 'show'
  | 'debounce'
  | 'form';
