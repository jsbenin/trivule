import { describe, it, expect, beforeEach } from 'vitest';
import { Trivule } from '../../src/core/trivule';

describe('Trivule Language System', () => {
    beforeEach(() => {
        // Reset the Trivule singleton for clean tests
        (Trivule as any)._instance = null;
    });

    describe('Trivule.message()', () => {
        it('should override a single rule message', () => {
            const customMessage = 'Este campo es obligatorio';
            Trivule.message('required', customMessage);

            const instance = Trivule.init();
            const message = instance.parameter.ruleRegistry.getMessage('required');
            expect(message).toBe(customMessage);
        });

        it('should preserve placeholder syntax in custom messages', () => {
            const customMessage = 'Mínimo :arg0 caracteres requeridos';
            Trivule.message('minlength', customMessage);

            const instance = Trivule.init();
            const message = instance.parameter.ruleRegistry.getMessage('minlength');
            expect(message).toBe(customMessage);
            expect(message).toContain(':arg0');
        });
    });

    describe('Trivule.messages()', () => {
        it('should override multiple rule messages at once', () => {
            Trivule.messages({
                required: 'Champ requis',
                email: 'Email invalide',
                min: 'Valeur trop petite',
            });

            const instance = Trivule.init();
            const registry = instance.parameter.ruleRegistry;

            expect(registry.getMessage('required')).toBe('Champ requis');
            expect(registry.getMessage('email')).toBe('Email invalide');
            expect(registry.getMessage('min')).toBe('Valeur trop petite');
        });

        it('should preserve placeholder syntax in bulk messages', () => {
            Trivule.messages({
                between: 'El valor debe estar entre :arg0 y :arg1',
            });

            const instance = Trivule.init();
            const betweenMessage =
                instance.parameter.ruleRegistry.getMessage('between');
            expect(betweenMessage).toContain(':arg0');
            expect(betweenMessage).toContain(':arg1');
        });
    });
});
