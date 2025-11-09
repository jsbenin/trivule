import { Trivule } from './core';

declare global {
  interface Window {
    Trivule: typeof Trivule;
  }
}

window.addEventListener('DOMContentLoaded', function () {
  window.Trivule = window.Trivule ?? Trivule.init();
});

// export { Trivule, TrivuleForm, TrivuleInput, TrConfig, RuleRegistry };
