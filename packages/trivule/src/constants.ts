import { TrivuleAttribute } from './types';

/**
 * Trivule Custom Events
 */
export const TR_EVENTS = {
  FORM: {
    INIT: 'tr.form.init',
    PASSES: 'tr.form.passes',
    FAILS: 'tr.form.fails',
    VALIDATE: 'tr.form.validate',
    UPDATED: 'tr.form.updated',
  },
  INPUT: {
    VALIDATED: 'tr.input.validated',
  },
} as const;

/**
 * HTML Attribute names (without prefix)
 */
export const TR_ATTRIBUTES: Record<string, TrivuleAttribute> = {
  FORM: 'form',
  RULES: 'rules',
  EVENTS: 'events',
  MSG: 'msg',
  INVALID_CLASS: 'invalid-class',
  VALID_CLASS: 'valid-class',
  FEEDBACK: 'feedback',
  SUBMIT: 'submit',
  ENABLED_CLASS: 'enabled-class',
  DISABLED_CLASS: 'disabled-class',
  NAME: 'name',
  LANG: 'lang',
  SHOW: 'show',
  DEBOUNCE: 'debounce',
} as const;
