import { getAttrData } from '../src/utils/helpers';

describe('getAttrData function', () => {
  test('should return defaults if element is null or undefined', () => {
    expect(getAttrData(null, 'rules', 'default')).toBe('default');
    expect(getAttrData(undefined, 'rules', 'default')).toBe('default');
  });

  test('should return defaults if dataset attribute is not found', () => {
    const element = document.createElement('div');
    expect(getAttrData(element, 'rules', 'default')).toBe('default');
  });

  test('should return value from dataset attribute', () => {
    const element = document.createElement('div');
    element.setAttribute('data-tr-rules', 'value');
    expect(getAttrData(element, 'rules', 'default')).toBe('value');
  });

  test('should return parsed JSON value if toJson parameter is true', () => {
    const element = document.createElement('div');
    element.setAttribute('data-tr-rules', '{"key": "value"}');
    expect(getAttrData(element, 'rules', 'default', true)).toEqual({
      key: 'value',
    });
  });

  test('should return defaults if parsed JSON value is invalid', () => {
    const element = document.createElement('div');
    element.setAttribute('data-tr-rules', '{invalidJson}');
    expect(getAttrData(element, 'rules', 'default', true)).toBe('default');
  });
});
