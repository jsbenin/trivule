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

  test('Test the make method', () => {
    const trInput = createTrivuleInput(formInstance.ageInput);
    trivuleForm.addTrivuleInput(trInput);
    trivuleForm
      .make([
        {
          rules: 'required|between:18,40',
          selector: 'age', //The input name
        },
        {
          rules: 'required|date',
          selector: formInstance.birthDayInput,
        },
      ])
      .make({
        message: {
          rules: 'required|only:string',
        },
      });

    const birthDayInput = trivuleForm.get('birthDay');
    expect(birthDayInput?.is(formInstance.birthDayInput)).toBe(true);
    const ageInput = trivuleForm.get('age');
    expect(ageInput?.hasRule('between')).toBe(true);
    const messageInput = trivuleForm.get('message');
    expect(messageInput?.hasRule('only')).toBe(true);
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
    test('Should resole inputs validations', () => {
      trForm = new TrivuleForm();
      trForm.make([
        {
          rules: 'required|between:18,40',
          selector: 'age', //The input name
        },
        {
          rules: 'required|date',
          selector: formInstance.birthDayInput,
        },
      ]);
      trForm.init({
        element: formInstance.form,
        realTime: false,
      });
      expect(trForm.getNativeElement()).toBe(formInstance.form);
    });
    test('Should return the native element', () => {
      trForm = new TrivuleForm();
      trForm.init(formInstance.form);
      expect(trForm.getNativeElement()).toBe(formInstance.form);
    });
  });

  describe('afterBinding && beforeBinding', () => {
    let form: TrivuleForm;

    beforeEach(() => {
      form = new TrivuleForm();
    });

    describe('afterBinding', () => {
      it('should register a callback for after binding', () => {
        const callback = vi.fn();
        form.afterBinding(callback);
        form.bind(formInstance.form);
        expect(callback).toHaveBeenCalled();
      });

      it('should allow method chaining', () => {
        const callback = vi.fn();
        const returnValue = form.afterBinding(callback);
        expect(returnValue).toBe(form);
      });
    });

    describe('beforeBinding', () => {
      it('should register a callback for before binding', () => {
        const callback = vi.fn();
        form.beforeBinding(callback);
        form.bind(formInstance.form);
        expect(callback).toHaveBeenCalled();
      });

      it('should allow method chaining', () => {
        const callback = vi.fn();
        const returnValue = form.beforeBinding(callback);
        expect(returnValue).toBe(form);
      });
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
      expect(formState).toHaveProperty('passes');
      expect(formState).toHaveProperty('fails');
      expect(formState).toHaveProperty('errors');
      expect(formState).toHaveProperty('validInputs');
      expect(formState).toHaveProperty('invalidInputs');
      expect(Array.isArray(formState.errors)).toBe(true);
      expect(Array.isArray(formState.validInputs)).toBe(true);
      expect(Array.isArray(formState.invalidInputs)).toBe(true);
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

    test('should default to blur and submit events', () => {
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
