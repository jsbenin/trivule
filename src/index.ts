import { TrLocal } from './locale/tr-local';
import { TrConfig } from './tr.config';
import { Trivule, RuleRegistry, TrivuleForm, TrivuleInput } from './core';

declare global {
  interface Window {
    TrivuleInput: typeof TrivuleInput;
    TrivuleForm: typeof TrivuleForm;
    Trivule: typeof Trivule;
    TrLocal: typeof TrLocal;
  }
}

if (typeof window !== 'undefined') {
  window.TrivuleInput = window.TrivuleInput ?? TrivuleInput;
  window.TrivuleForm = window.TrivuleForm ?? TrivuleForm;
  window.Trivule = window.Trivule ?? Trivule;
  window.TrLocal = window.TrLocal ?? TrLocal;
}

export { Trivule, TrivuleForm, TrivuleInput, TrConfig, RuleRegistry, TrLocal };
