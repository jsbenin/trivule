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
    const result = escapeCssSelector('data-tr-rules');
    expect(result).toBe('data-tr-rules');
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
    Trivule.init({ attributePrefix: 'data-tr-' });
  });

  it('should create valid selector with default prefix', () => {
    Trivule.init({ attributePrefix: 'data-tr-' });
    const selector = attrSelector('rules');
    expect(selector).toBe('[data-tr-rules]');
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
        <input id="test1" v:rules="required" />
        <input id="test2" v:rules="email" />
        <input id="test3" name="other" />
      </div>
    `;

    Trivule.init({ attributePrefix: 'v:' });
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
});
