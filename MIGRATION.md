# Migration Guide: Trivule Updates

This guide helps you migrate from previous versions of Trivule to the latest version.

## Breaking Changes

### Phone Number Validation Removed (v2.x)

**⚠️ Important Change**: The built-in phone number validation has been removed to reduce bundle size and allow users to choose their preferred phone validation library.

**Before (❌ No longer supported):**

```javascript
// Built-in phone validation
<input data-tr-rules="phone" />
<input data-tr-rules="phone:US,FR,BJ" />
```

**After (✅ Use external libraries):**

```javascript
// Option 1: Use a dedicated phone validation library like libphonenumber-js
import { parsePhoneNumber } from 'libphonenumber-js';

trivule.defineRule('phone', (value, countries) => {
  try {
    const phoneNumber = parsePhoneNumber(value, countries);
    return {
      passes: phoneNumber.isValid(),
      value: value
    };
  } catch {
    return {
      passes: false,
      value: value
    };
  }
}, 'Invalid phone number');

// Option 2: Use a simple regex for basic validation
trivule.defineRule('phone', (value) => {
  const phoneRegex = /^[\+]?[\d\s\-\(\)]+$/;
  return {
    passes: phoneRegex.test(value),
    value: value
  };
}, 'Invalid phone number format');
```

**Migration Steps:**

1. **Remove phone rules** from your HTML/JavaScript:
   ```html
   <!-- Remove this -->
   <input data-tr-rules="phone" />
   ```

2. **Install a phone validation library** (recommended):
   ```bash
   npm install libphonenumber-js
   # or
   npm install google-libphonenumber
   ```

3. **Define your custom phone rule**:
   ```javascript
   import { parsePhoneNumber } from 'libphonenumber-js';
   
   trivule.defineRule('phone', (value, country) => {
     try {
       const phone = parsePhoneNumber(value, country);
       return { passes: phone.isValid(), value };
     } catch {
       return { passes: false, value };
     }
   }, 'Please enter a valid phone number');
   ```

4. **Update your forms**:
   ```html
   <input data-tr-rules="phone:US" />
   ```

### Constructor Access (Previous versions)

**Before (❌ No longer supported):**

```javascript
const trivule = new Trivule();
trivule.init(config);
```

**After (✅ New approach):**

```javascript
const trivule = Trivule.init(config);
```

## Key Changes

### 1. Removed Dependencies
- Phone validation logic and dependencies have been removed
- Reduced bundle size significantly
- Better tree-shaking support

### 2. Private Constructor (Previous versions)

- The `init()` method is now static
- Returns the singleton instance
- Handles both initial creation and re-initialization

### 3. Singleton Pattern

- Only one `Trivule` instance exists at runtime
- Subsequent calls to `Trivule.init()` return the same instance
- Helps maintain consistent state across your application

## Migration Steps

### Step 1: Update Instantiation Code

Replace any occurrence of:

```javascript
const trivule = new Trivule();
trivule.init(config);
```

With:

```javascript
const trivule = Trivule.init(config);
```

### Step 2: Handle Re-initialization

If you were creating multiple instances before:

```javascript
// Old approach - multiple instances
const trivule1 = new Trivule();
trivule1.init(config1);

const trivule2 = new Trivule();
trivule2.init(config2);
```

Now you get the same instance:

```javascript
// New approach - singleton pattern
const trivule1 = Trivule.init(config1);
const trivule2 = Trivule.init(config2); // Same instance as trivule1

console.log(trivule1 === trivule2); // true
```

### Step 3: Update Your Application Logic

If your code relied on having separate Trivule instances with different configurations, you'll need to refactor to use a single configuration or manage configuration changes differently.

## Benefits

### 1. Improved Performance

- Eliminates overhead of multiple instances
- Shared configuration and state management
- More efficient memory usage

### 2. Enhanced Maintainability

- Single source of truth for validation rules
- Consistent behavior across the application
- Easier debugging and configuration management

### 3. Better Developer Experience

- Simplified API with static initialization
- No more confusion about which instance to use
- Clearer initialization pattern

## Compatibility

### What Still Works

- All existing validation rules and methods
- `TrivuleForm` and `TrivuleInput` classes remain unchanged
- All configuration options are still supported
- Event handling and callbacks work as before

### What Doesn't Work

- Direct constructor access: `new Trivule()`
- Creating multiple independent instances
- Instance-based initialization: `instance.init()`

## Examples

### Basic Usage

```javascript
// Initialize Trivule with configuration
const trivule = Trivule.init({
  realTime: true,
  feedbackSelector: '.error-message',
});

// Add custom validation rules
trivule.rule(
  'customRule',
  (value) => {
    return value.includes('custom');
  },
  'Value must contain "custom"',
);

// Access forms
const forms = trivule.forms();
```

### Framework Integration

```javascript
// React/Vue/Angular - same pattern
useEffect(() => {
  const trivule = Trivule.init({
    realTime: true,
  });

  // Use trivule instance
}, []);
```

### Re-initialization with New Config

```javascript
// Initial setup
const trivule = Trivule.init({ realTime: false });

// Later in your app - updates the same instance
const sameInstance = Trivule.init({ realTime: true });

console.log(trivule === sameInstance); // true
```

## Support

If you encounter any issues during migration:

1. Check that you've updated all `new Trivule()` calls to `Trivule.init()`
2. Verify that your code doesn't depend on having multiple independent instances
3. Review your configuration management if you were using different configs for different instances

For additional help, please open an issue on the [GitHub repository](https://github.com/jsbenin/trivule/issues).
