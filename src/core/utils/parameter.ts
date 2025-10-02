import { CssSelector } from '../../types';

export class TrParameter {
  private static _instance: TrParameter | null = null;
  private bag = {
    attribute: 'data-tr-',
  };
  /**
   * The attribute that will be used to display the error message
   * {attr} will be replaced by the value of attribute property
   * {name} will be replaced by the input name
   */
  feedbackSelector: CssSelector | null = '[data-tr-feedback={name}]';
  inputSelector: CssSelector | null = '[name={name}]';
  getFeedbackSelector(name: string): CssSelector | null {
    if (typeof this.feedbackSelector === 'string') {
      if (name.trim().length < 1) {
        return null;
      }

      return this.feedbackSelector.replace('{name}', name);
    }
    return this.feedbackSelector;
  }

  setFeedbackSelector(selector?: string | HTMLElement | null) {
    if (!selector) {
      return this;
    }

    this.feedbackSelector = selector;
    return this;
  }
  getInputSelector(name: unknown) {
    if (typeof this.inputSelector === 'string' && typeof name === 'string') {
      if (name.trim().length < 1) {
        return null;
      }
      return this.inputSelector.replace('{name}', name);
    }
    return this.inputSelector;
  }

  get(key: keyof typeof this.bag) {
    return this.bag[key];
  }
  set(key: keyof typeof this.bag, value: string) {
    this.bag[key] = value;
    return this;
  }

  static instance(): TrParameter {
    if (!TrParameter._instance) {
      TrParameter._instance = new TrParameter();
    }
    return TrParameter._instance;
  }
}
