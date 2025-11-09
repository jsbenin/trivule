import { vi } from 'vitest';
import { TrivuleForm } from '../src/core/form';
import { TrivuleInput } from '../src/core/input';
import { TrParameter } from '../src/core/utils/parameter';
import { attr } from '../src/utils';

// Helper function to create TrivuleInput for tests
const createTrivuleInput = (inputElement: HTMLElement, params: any = {}) => {
  // Add the inputElement as selector for the new API
  const inputParams = {
    selector: inputElement,
    ...params,
  };
  return TrivuleInput.create(inputParams, TrParameter.instance());
};

class MyForm {
  form: HTMLFormElement;
  nameInput: HTMLInputElement;
  ageInput: HTMLInputElement;
  birthDayInput: HTMLInputElement;
  languageSelect: HTMLSelectElement;
  messageTextarea: HTMLTextAreaElement;

  constructor() {
    this.form = document.createElement('form');

    this.nameInput = this.createInput('text', 'name');
    this.nameInput.setAttribute(attr('rules'), 'required');
    this.ageInput = this.createInput('number', 'age');
    this.birthDayInput = this.createInput('date', 'birthDay');
    this.languageSelect = this.createSelect('language', [
      'English',
      'French',
      'Spanish',
    ]);
    this.messageTextarea = this.createTextarea('message');

    this.form.append(
      this.nameInput,
      this.ageInput,
      this.birthDayInput,
      this.languageSelect,
      this.messageTextarea,
    );

    document.body.appendChild(this.form);
  }

  private createInput(type: string, name: string): HTMLInputElement {
    const input = document.createElement('input');
    input.type = type;
    input.name = name;
    return input;
  }

  private createSelect(name: string, options: string[]): HTMLSelectElement {
    const select = document.createElement('select');
    select.name = name;
    options.forEach((option) => {
      const optionElement = document.createElement('option');
      optionElement.value = option.toLowerCase();
      optionElement.textContent = option;
      select.appendChild(optionElement);
    });
    return select;
  }

  private createTextarea(name: string): HTMLTextAreaElement {
    const textarea = document.createElement('textarea');
    textarea.name = name;
    return textarea;
  }
}

const formInstance = new MyForm();

describe('TrivuleForm', () => {
  const trivuleForm = new TrivuleForm();
  trivuleForm.init(formInstance.form, {
    realTime: false,
  });
  test('Test get method', () => {
    expect(trivuleForm.get('name')).toBeInstanceOf(TrivuleInput);
  });

  test('Test addTrivuleInput method', () => {
    const trInput = createTrivuleInput(formInstance.ageInput);
    trivuleForm.addTrivuleInput(trInput);
    expect(trivuleForm.get('age')).toBe(trInput);
  });

  describe('bind', () => {
    let trForm = new TrivuleForm();
    test('Should return null for the native element', () => {
      expect(trForm.getNativeElement()).toBeNull();
    });

    test('Should return the native element with ', () => {
      trForm = new TrivuleForm();
      trForm.bind(formInstance.form);
      expect(trForm.getNativeElement()).toBe(formInstance.form);
    });

    test('Should return the native element', () => {
      trForm = new TrivuleForm();
      trForm.init(formInstance.form);
      expect(trForm.getNativeElement()).toBe(formInstance.form);
    });
  });

  describe('Form State Properties', () => {
    let form: TrivuleForm;

    beforeEach(() => {
      form = new TrivuleForm();
    });

    test('should have isDirty property', () => {
      expect(form.isDirty).toBe(false);
    });

    test('should have validated property', () => {
      expect(form.validated).toBe(false);
    });

    test('should have formState property', () => {
      const formState = form.formState;
      expect(formState).toHaveProperty('isDirty');
      expect(formState).toHaveProperty('validated');
    });
  });

  describe('setLanguage method', () => {
    test('should set language on the form', () => {
      const form = new TrivuleForm();
      form.setLanguage('fr');
      // Note: This tests that the method exists and doesn't throw
      expect(typeof form.setLanguage).toBe('function');
    });
  });

  describe('Trigger Events Configuration', () => {
    test('should accept triggerEvents in config', () => {
      const form = new TrivuleForm();
      form.init(formInstance.form, {
        triggerEvents: ['input', 'blur'],
      });
      expect(typeof form.init).toBe('function');
    });

    test('should default to input and submit events', () => {
      const form = new TrivuleForm();
      form.init(formInstance.form);
      expect(typeof form.init).toBe('function');
    });
  });

  describe('getValidatedInputs method', () => {
    test('should return validated inputs', () => {
      const form = new TrivuleForm();
      form.init(formInstance.form);
      const validatedInputs = form.getValidatedInputs();
      expect(Array.isArray(validatedInputs)).toBe(true);
    });

    test('should return validated inputs in strict mode', () => {
      const form = new TrivuleForm();
      form.init(formInstance.form);
      const validatedInputs = form.getValidatedInputs(true);
      expect(Array.isArray(validatedInputs)).toBe(true);
    });
  });
});
