import { TrConfig } from './tr.config';
import { Trivule, RuleRegistry, TrivuleForm, TrivuleInput } from './core';

// Export TrBag as an alias for backward compatibility
export const TrBag = RuleRegistry;

declare global {
  interface Window {
    TrivuleInput: typeof TrivuleInput;
    TrivuleForm: typeof TrivuleForm;
    Trivule: typeof Trivule;
    TrBag: typeof TrBag;
  }
}

if (typeof window !== 'undefined') {
  window.TrivuleInput = window.TrivuleInput ?? TrivuleInput;
  window.TrivuleForm = window.TrivuleForm ?? TrivuleForm;
  window.Trivule = window.Trivule ?? Trivule;
  window.TrBag = window.TrBag ?? TrBag;
}

export { Trivule, TrivuleForm, TrivuleInput, TrConfig, RuleRegistry };
