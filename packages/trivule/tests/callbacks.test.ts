import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TrivuleForm } from '../src/core/form';
import { attr } from '../src/utils';

describe('TrivuleForm Callbacks', () => {
    let formElement: HTMLFormElement;
    let inputElement: HTMLInputElement;
    let trivuleForm: TrivuleForm;

    beforeEach(() => {
        document.body.innerHTML = '';
        formElement = document.createElement('form');
        inputElement = document.createElement('input');
        inputElement.name = 'email';
        inputElement.setAttribute(attr('rules'), 'required|email');
        formElement.appendChild(inputElement);
        document.body.appendChild(formElement);

        trivuleForm = new TrivuleForm();
        trivuleForm.init(formElement);
    });

    it('should call onError when form is submitted with invalid data', () => {
        const onErrorSpy = vi.fn();
        trivuleForm.onError(onErrorSpy);

        inputElement.value = '';

        formElement.dispatchEvent(new Event('submit', { cancelable: true }));

        expect(onErrorSpy).toHaveBeenCalled();
        const errorData = onErrorSpy.mock.calls[0][0];
        expect(errorData.errors.length).toBeGreaterThan(0);
        expect(errorData.errors[0].field).toBe('email');
    });

    it('should call onSuccess when form is submitted with valid data', () => {
        const onSuccessSpy = vi.fn();
        trivuleForm.onSuccess(onSuccessSpy);

        inputElement.value = 'test@example.com';

        formElement.dispatchEvent(new Event('submit', { cancelable: true }));

        expect(onSuccessSpy).toHaveBeenCalled();
        const successData = onSuccessSpy.mock.calls[0][0];
        expect(successData.values.email).toBe('test@example.com');
    });
});
