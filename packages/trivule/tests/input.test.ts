import { vi } from 'vitest';
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

describe('TrivuleInput', () => {
  describe('getRules', () => {
    test('should return an array of rules for a given input field', () => {
      // Arrange
      const inputElement = document.createElement('input'); // Create an input element
      inputElement.setAttribute(attr('rules'), 'required|min:30'); // Set rules for the input element
      const rules = [
        { name: 'required', message: 'This field is required' },
        {
          message: "The :field field must be greater than or equal to ':arg0'",
          name: 'min',
          params: '30',
        },
      ];
      const validator = createTrivuleInput(inputElement);

      expect(
        validator.getRules().map((r) => {
          return { name: r.name, message: r.message, params: r.params };
        }),
      ).toEqual(rules); // Assert that the result matches the expected rules array
    });

    test('should return an empty array if no rules are set for a given input field', () => {
      // Arrange
      const inputElement = document.createElement('input');
      const validator = createTrivuleInput(inputElement);

      // Act
      const result = validator.getRules(); // Call the getRules method

      // Assert
      expect(result).toEqual([]); // Assert that the result is an empty array
    });
  });

  describe('hasRules', () => {
    test('should return true if input have rules', () => {
      const inputElement = document.createElement('input'); // Create an input element
      inputElement.setAttribute(attr('rules'), 'required|min:30');
      const validator = createTrivuleInput(inputElement);
      expect(validator.$rules.length > 0).toBe(true);
    });

    test('should return false if rules are empty', () => {
      const inputElement = document.createElement('input');
      const validator = createTrivuleInput(inputElement);
      expect(validator.$rules.length > 0).toBe(false); // Assert that the result is an empty array
    });
  });

  describe('getMessages', () => {
    test('should return  messages set via @v:mgs.<rule>', () => {
      const inputElement = document.createElement('input');
      inputElement.setAttribute(attr('rules'), 'required|min:30');
      inputElement.setAttribute(attr('msg.required'), 'Required message');
      inputElement.setAttribute(attr('msg.min'), 'Min message');
      const validator = createTrivuleInput(inputElement, {
        failsOnfirst: false,
      });
      validator.validate();
      const received = validator.messages;
      expect(received).toEqual({
        required: 'Required message',
        min: 'Min message',
      });
    });

    test('should return false if rules are empty', () => {
      // Arrange
      const inputElement = document.createElement('input');
      const validator = createTrivuleInput(inputElement);

      expect(validator.$rules.length > 0).toBe(false);
    });
  });
  describe('valid', () => {
    test('should return true if input is valid', () => {
      // Arrange
      const inputElement = document.createElement('input');
      inputElement.setAttribute(
        attr('rules'),
        'required|min:2|regex:^(Js&pip;Ts)$',
      );
      inputElement.value = 'Js'; // Set the input value
      const validator = createTrivuleInput(inputElement);

      expect(validator.validate()).toBe(true); // Assert that the input is valid
    });

    test('should return false if input is invalid', () => {
      // Arrange
      const inputElement = document.createElement('input');
      inputElement.setAttribute(attr('rules'), 'required|min:3');
      inputElement.value = ''; // Set the input value to empty
      const validator = createTrivuleInput(inputElement);

      expect(validator.validate()).toBe(false); // Assert that the input is invalid
    });
  });

  describe('validate', () => {
    test('should return true if input is valid', () => {
      // Arrange
      const inputElement = document.createElement('input');
      inputElement.setAttribute(attr('rules'), 'required|min:3');
      inputElement.value = 'test'; // Set the input value
      const validator = createTrivuleInput(inputElement);
      vi.spyOn(validator as any, 'setValidationClass').mockImplementation(
        () => { },
      ); // Mock setValidationClass to prevent side effects

      const result = validator.validate();

      expect(result).toBe(true); // Assert that the input is valid
    });

    test('should return false if input is invalid', () => {
      // Arrange
      const inputElement = document.createElement('input');
      inputElement.setAttribute(attr('rules'), 'required|min:3');
      inputElement.value = ''; // Set the input value to empty
      const validator = createTrivuleInput(inputElement);
      vi.spyOn(validator as any, 'setValidationClass').mockImplementation(
        () => { },
      ); // Mock setValidationClass to prevent side effects

      // Act
      const result = validator.validate();

      // Assert
      expect(result).toBe(false); // Assert that the input is invalid
    });
  });

  describe('getErrors', () => {
    test('should return error messages', () => {
      // Arrange
      const inputElement = document.createElement('input');
      inputElement.setAttribute(attr('rules'), 'required|min:3');
      inputElement.name = 'input-name';
      inputElement.value = ''; // Set the input value to empty
      inputElement.type = 'text';
      const validator = createTrivuleInput(inputElement);

      vi.spyOn(validator as any, 'setValidationClass').mockImplementation(
        () => { },
      ); // Mock setValidationClass to prevent side effects

      validator.validate();
      const result = validator.errors;

      expect(result).toEqual({
        required: 'This field is required',
        min: 'The minimum number of allowed characters is: 3',
      });
    });

    test('should return empty error messages', () => {
      // Arrange
      const inputElement = document.createElement('input');
      inputElement.setAttribute(attr('rules'), 'required|min:3');
      inputElement.type = 'number';
      inputElement.name = 'name-empty';
      inputElement.value = '4';
      const validator = createTrivuleInput(inputElement);

      vi.spyOn(validator as any, 'setValidationClass').mockImplementation(
        () => { },
      ); // Mock setValidationClass to prevent side effects

      validator.validate();
      const result = validator.errors;

      expect(result).toEqual({});
    });
  });

  describe('setFeedbackElement', () => {
    const body = document.createElement('div');
    const inputElement = document.createElement('input');
    const feedbackElement = document.createElement('div');
    body.appendChild(inputElement);
    body.appendChild(feedbackElement);
    const validator = createTrivuleInput(inputElement);
    test('should return the feedback element supplied througth the set method', () => {
      validator.setFeedbackElement(feedbackElement);
      expect(validator.getFeedbackElement() === feedbackElement).toBe(true);
    });

    test('should return true if no feedback element found', () => {
      inputElement.name = 'my-input';
      feedbackElement.setAttribute(attr('feedback'), 'my-input');
      validator.setFeedbackElement('no-select');

      expect(validator.getFeedbackElement() === null).toBe(true);
    });

    test('should return the feedback element supplied througth the attribute', () => {
      inputElement.name = 'my-input';
      feedbackElement.setAttribute(attr('feedback'), 'my-input');
      validator.setFeedbackElement();

      expect(validator.getFeedbackElement() === feedbackElement).toBe(true);
    });
  });

  describe('$rules', () => {
    const inputElement = document.createElement('input');
    const trivuleInput = createTrivuleInput(inputElement, {
      rules: 'required',
    });
    test('should set the message', () => {
      trivuleInput.$rules.set('required', 'test');
      expect(trivuleInput.$rules.getMessage('required')).toBe('test');
    });
  });
  describe('setRules', () => {
    test('should set rules to the inputs', () => {
      const input = document.createElement('input');
      const trivuleInput = createTrivuleInput(input, {
        rules: 'required',
      });

      trivuleInput.setRules('min:2').setRules(['email', 'digit:3']);
      const received = trivuleInput.getRules().map((r) => r.name);
      expect(received).toEqual(['required', 'min', 'email', 'digit']);
    });
  });

  describe('getInputElement', () => {
    test('should return the input element', () => {
      const inputElement = document.createElement('input');
      const trivuleInput = createTrivuleInput(inputElement);
      expect(trivuleInput.getInputElement()).toBe(inputElement);
    });
  });

  describe('event trigger attribute', () => {
    test('should read trigger events from @v:events attribute', () => {
      const inputElement = document.createElement('input');
      inputElement.setAttribute(attr('rules'), 'required');
      inputElement.setAttribute(attr('events'), 'input|blur');

      const validateSpy = vi.fn();
      const trivuleInput = createTrivuleInput(inputElement);
      vi.spyOn(trivuleInput, 'validate').mockImplementation(validateSpy);

      // Trigger input event
      inputElement.dispatchEvent(new Event('input'));
      expect(validateSpy).toHaveBeenCalledTimes(1);

      // Trigger blur event
      inputElement.dispatchEvent(new Event('blur'));
      expect(validateSpy).toHaveBeenCalledTimes(2);
    });

    test('should parse single event from @v:events attribute', () => {
      const inputElement = document.createElement('input');
      inputElement.setAttribute(attr('rules'), 'required');
      inputElement.setAttribute(attr('events'), 'blur');

      const validateSpy = vi.fn();
      const trivuleInput = createTrivuleInput(inputElement);
      vi.spyOn(trivuleInput, 'validate').mockImplementation(validateSpy);

      // Trigger input event - should NOT trigger validation since only blur is set
      inputElement.dispatchEvent(new Event('input'));
      expect(validateSpy).toHaveBeenCalledTimes(0);

      // Trigger blur event - should trigger validation
      inputElement.dispatchEvent(new Event('blur'));
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    test('should ignore submit in per-input events (handled at form level)', () => {
      const inputElement = document.createElement('input');
      inputElement.setAttribute(attr('rules'), 'required');
      inputElement.setAttribute(attr('events'), 'submit|input');

      const validateSpy = vi.fn();
      const trivuleInput = createTrivuleInput(inputElement);
      vi.spyOn(trivuleInput, 'validate').mockImplementation(validateSpy);

      // Submit event should be ignored at input level
      inputElement.dispatchEvent(new Event('submit'));
      expect(validateSpy).toHaveBeenCalledTimes(0);

      // Input event should work
      inputElement.dispatchEvent(new Event('input'));
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    test('should use triggerEvents from params if attribute not set', () => {
      const inputElement = document.createElement('input');
      inputElement.setAttribute(attr('rules'), 'required');

      const validateSpy = vi.fn();
      const trivuleInput = createTrivuleInput(inputElement, {
        triggerEvents: ['input'],
      });
      vi.spyOn(trivuleInput, 'validate').mockImplementation(validateSpy);

      // Trigger input event
      inputElement.dispatchEvent(new Event('input'));
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    test('should filter invalid event names', () => {
      const inputElement = document.createElement('input');
      inputElement.setAttribute(attr('rules'), 'required');
      inputElement.setAttribute(attr('events'), 'input|invalid|blur|unknown');

      const validateSpy = vi.fn();
      const trivuleInput = createTrivuleInput(inputElement);
      vi.spyOn(trivuleInput, 'validate').mockImplementation(validateSpy);

      // Only valid events (input, blur) should be attached
      inputElement.dispatchEvent(new Event('input'));
      expect(validateSpy).toHaveBeenCalledTimes(1);

      inputElement.dispatchEvent(new Event('blur'));
      expect(validateSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('custom messages with msg attribute', () => {
    test('should read custom messages from @v:msg attributes', () => {
      const inputElement = document.createElement('input');
      inputElement.setAttribute(attr('rules'), 'required|email|max_length:32');
      inputElement.setAttribute(attr('msg') + '.required', 'Ce champ est obligatoire');
      inputElement.setAttribute(attr('msg') + '.email', 'Veuillez entrer un email valide');
      inputElement.setAttribute(attr('msg') + '.max_length', 'Maximum 32 caractères');

      const trivuleInput = createTrivuleInput(inputElement);

      expect(trivuleInput.$rules.getMessage('required')).toBe('Ce champ est obligatoire');
      expect(trivuleInput.$rules.getMessage('email')).toBe('Veuillez entrer un email valide');
      expect(trivuleInput.$rules.getMessage('max_length')).toBe('Maximum 32 caractères');
    });

    test('should use default message when custom msg attribute is not provided', () => {
      const inputElement = document.createElement('input');
      inputElement.setAttribute(attr('rules'), 'required|email');

      const trivuleInput = createTrivuleInput(inputElement);

      // Should have default messages
      expect(trivuleInput.$rules.getMessage('required')).toBeTruthy();
      expect(trivuleInput.$rules.getMessage('email')).toBeTruthy();
    });

    test('should handle empty msg attributes', () => {
      const inputElement = document.createElement('input');
      inputElement.setAttribute(attr('rules'), 'required|email');
      inputElement.setAttribute(attr('msg') + '.required', '');

      const trivuleInput = createTrivuleInput(inputElement);

      expect(trivuleInput.$rules.getMessage('required')).toBe('This field is required');
    });
  });
});
