import { describe, it, expect, beforeEach } from 'vitest';
import { same } from '../../src/rules/global';
import { JSDOM } from 'jsdom';

describe('same rule', () => {
    let dom: JSDOM;
    let form: HTMLFormElement;
    let input1: HTMLInputElement;
    let input2: HTMLInputElement;

    beforeEach(() => {
        dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
        global.document = dom.window.document as any;
        global.window = dom.window as any;
        global.HTMLElement = dom.window.HTMLElement as any;

        form = document.createElement('form');
        input1 = document.createElement('input');
        input1.name = 'password';
        input1.value = 'secret123';

        input2 = document.createElement('input');
        input2.name = 'password_confirmation';

        form.appendChild(input1);
        form.appendChild(input2);
        document.body.appendChild(form);
    });

    it('should pass when values are identical', () => {
        const result = same('secret123', 'password', 'text', input2);
        expect(result.passes).toBe(true);
    });

    it('should fail when values are different', () => {
        const result = same('different', 'password', 'text', input2);
        expect(result.passes).toBe(false);
    });

    it('should fail when target element does not exist', () => {
        const result = same('secret123', 'non_existent', 'text', input2);
        expect(result.passes).toBe(false);
    });

    it('should throw error when otherField argument is missing', () => {
        expect(() => same('secret123', undefined as any, 'text', input2)).toThrow();
    });
});
