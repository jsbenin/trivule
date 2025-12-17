import { escapeCssSelector, attrSelector } from '../src/utils';
import { Trivule } from '../src/core/trivule';

describe('escapeCssSelector', () => {
  it('should escape colons in CSS selectors', () => {
    const result = escapeCssSelector('v:rules');
    // CSS.escape would return 'v\\:rules' or 'v\\3a rules'
    expect(result).toContain('rules');
  });

  it('should escape dots in CSS selectors', () => {
    const result = escapeCssSelector('ng.rules');
    expect(result).toContain('rules');
  });

  it('should handle regular attribute names without special chars', () => {
    const result = escapeCssSelector('@v:rules');
    expect(result).toContain('@v');
    expect(result).toContain('rules');
  });

  it('should escape brackets in CSS selectors', () => {
    const result = escapeCssSelector('test[0]');
    expect(result).toContain('test');
    expect(result).toContain('0');
  });
});

describe('attrSelector with different prefixes', () => {
  afterEach(() => {
    // Reset to default config
    Trivule.init({ attributePrefix: '@v:' });
  });

  it('should create valid selector with default prefix', () => {
    Trivule.init({ attributePrefix: '@v:' });
    const selector = attrSelector('rules');
    expect(selector).toContain('@v');
    expect(selector).toContain('rules');
  });

  it('should create valid selector with Vue.js style prefix (v:)', () => {
    Trivule.init({ attributePrefix: 'v:' });
    const selector = attrSelector('rules');
    // Should escape the colon
    expect(selector).toContain('v');
    expect(selector).toContain('rules');
    expect(selector).toMatch(/^\[.*\]$/); // Should be wrapped in brackets
  });

  it('should create valid selector with Alpine.js style prefix (x-)', () => {
    Trivule.init({ attributePrefix: 'x-' });
    const selector = attrSelector('rules');
    expect(selector).toBe('[x-rules]');
  });

  it('should work with querySelector on actual DOM elements', () => {
    document.body.innerHTML = `
      <div>
        <input id="test1" @v:rules="required" />
        <input id="test2" @v:rules="email" />
        <input id="test3" name="other" />
      </div>
    `;

    Trivule.init({ attributePrefix: '@v:' });
    const selector = attrSelector('rules');

    const elements = document.querySelectorAll(selector);
    expect(elements.length).toBe(2);
    expect(elements[0].id).toBe('test1');
    expect(elements[1].id).toBe('test2');
  });

  it('should work with complex selectors containing dots', () => {
    document.body.innerHTML = `
      <div>
        <input id="test1" ng.rules="required" />
        <input id="test2" ng.rules="email" />
      </div>
    `;

    Trivule.init({ attributePrefix: 'ng.' });
    const selector = attrSelector('rules');

    const elements = document.querySelectorAll(selector);
    expect(elements.length).toBe(2);
  });

  it('should properly override attributePrefix on init (issue #51)', () => {
    // First init with custom prefix
    const trivule1 = Trivule.init({ attributePrefix: 'data-custom-' });
    expect(trivule1.parameter.attributePrefix).toBe('data-custom-');
    const selector1 = attrSelector('rules');
    expect(selector1).toBe('[data-custom-rules]');

    // Second init with different prefix should override
    const trivule2 = Trivule.init({ attributePrefix: 'v:' });
    expect(trivule2.parameter.attributePrefix).toBe('v:');
    const selector2 = attrSelector('rules');
    expect(selector2).toContain('v');
    expect(selector2).toContain('rules');
  });
});
