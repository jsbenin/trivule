import { TrLocal } from '../../src/locale/tr-local';

describe('TrLocal', () => {
  beforeEach(() => {
    // Reset the messages to the default state before each test
    TrLocal.addMessage('required', 'This field is required.');
    TrLocal.addMessage('email', 'Please enter a valid email address.');
    TrLocal.addMessage(
      'maxLength',
      'The maximum length is {length} characters.',
    );
    TrLocal.addMessage('default', 'The field is invalid.');
  });

  describe('getRuleMessage', () => {
    it('should return the message for the specified rule and language', () => {
      const message = TrLocal.getRuleMessage('required', 'en');
      expect(message).toBe('This field is required.');
    });

    it('should return the default message if the rule message is not found', () => {
      const message = TrLocal.getRuleMessage('unknownRule', 'en');
      expect(message).toBe('The field is invalid.');
    });

    it('should return the message for the default language if no language is specified', () => {
      const message = TrLocal.getRuleMessage('required');
      expect(message).toBe('This field is required.');
    });
  });

  describe('addMessage', () => {
    it('should add a new message for the specified rule and language', () => {
      TrLocal.addMessage(
        'minlength',
        'The minimum length is {length} characters.',
        'en',
      );
      const subsMessage = TrLocal.getRuleMessage('minlength', 'en');
      expect(subsMessage).toEqual('The minimum length is {length} characters.');
    });
  });

  describe('addMessage (batch)', () => {
    it('should update multiple messages for the specified language', () => {
      TrLocal.addMessage('required', 'Field is required.', 'en');
      TrLocal.addMessage('email', 'Enter a valid email address.', 'en');
      const messages = TrLocal.getMessages('en');
      expect(messages.required).toBe('Field is required.');
      expect(messages.email).toBe('Enter a valid email address.');
    });

    it('should add messages for a new language', () => {
      TrLocal.addMessage('required', 'Champ requis.', 'fr');
      TrLocal.addMessage(
        'email',
        'Veuillez saisir une adresse e-mail valide.',
        'fr',
      );
      TrLocal.addMessage(
        'maxLength',
        'La longueur maximale est de {length} caractères.',
        'fr',
      );
      const messages = TrLocal.getMessages('fr');
      expect(messages.required).toBe('Champ requis.');
      expect(messages.email).toBe('Veuillez saisir une adresse e-mail valide.');
      expect(messages.maxLength).toBe(
        'La longueur maximale est de {length} caractères.',
      );
    });
  });

  describe('rewrite', () => {
    it('should rewrite the message for the specified rule and language', () => {
      TrLocal.rewrite('en', 'required', 'Please fill out this field.');
      const message = TrLocal.getRuleMessage('required', 'en');
      expect(message).toBe('Please fill out this field.');
    });
  });

  describe('local', () => {
    it('should set the current translation language', () => {
      TrLocal.local('fr');
      const currentLanguage = TrLocal.getLocal();
      expect(currentLanguage).toBe('fr');
    });

    it('should throw an error if the language is not a valid string', () => {
      expect(() => {
        TrLocal.local('');
      }).toThrow('The language must be a valid string');
    });
  });
});
