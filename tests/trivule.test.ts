import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Trivule } from '../src/core/trivule';
import { JSDOM } from 'jsdom';

describe('Trivule', () => {
  beforeEach(() => {
    // Setup a basic DOM environment
    const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    global.document = dom.window.document as any;
    global.window = dom.window as any;
  });

  describe('getAttributePrefix', () => {
    it('should return the default attribute prefix when no config is provided', () => {
      const trivule = Trivule.init();
      expect(trivule.getAttributePrefix()).toBe('@v:');
    });

    it('should return the custom attribute prefix data-tr- when provided in config', () => {
      const trivule = Trivule.init({ attributePrefix: 'data-tr-' });
      expect(trivule.getAttributePrefix()).toBe('data-tr-');
    });

    it('should return the custom attribute prefix data-custom- when provided in config', () => {
      const trivule = Trivule.init({ attributePrefix: 'data-custom-' });
      expect(trivule.getAttributePrefix()).toBe('data-custom-');
    });

    it('should return the custom attribute prefix with different format', () => {
      const trivule = Trivule.init({ attributePrefix: 'x-' });
      expect(trivule.getAttributePrefix()).toBe('x-');
    });

    it('should return the updated attribute prefix after reconfiguration', () => {
      const trivule = Trivule.init({ attributePrefix: '@v:' });
      expect(trivule.getAttributePrefix()).toBe('@v:');

      // Reconfigure with new prefix
      Trivule.init({ attributePrefix: 'data-new-' });
      expect(trivule.getAttributePrefix()).toBe('data-new-');
    });

    it('should maintain the same prefix across multiple calls', () => {
      const trivule = Trivule.init({ attributePrefix: 'data-validation-' });
      const firstCall = trivule.getAttributePrefix();
      const secondCall = trivule.getAttributePrefix();

      expect(firstCall).toBe('data-validation-');
      expect(secondCall).toBe('data-validation-');
      expect(firstCall).toBe(secondCall);
    });
  });

  describe('init', () => {
    it('should create a singleton instance', () => {
      const trivule1 = Trivule.init();
      const trivule2 = Trivule.init();
      expect(trivule1).toBe(trivule2);
    });

    it('should initialize with default configuration', () => {
      const trivule = Trivule.init();
      expect(trivule).toBeDefined();
      expect(trivule.parameter).toBeDefined();
    });

    it('should apply custom configuration', () => {
      const trivule = Trivule.init({
        attributePrefix: 'data-custom-',
        invalidClass: 'error',
        validClass: 'success',
      });

      expect(trivule.getAttributePrefix()).toBe('data-custom-');
      expect(trivule.parameter.invalidClass).toBe('error');
      expect(trivule.parameter.validClass).toBe('success');
    });
  });
});
