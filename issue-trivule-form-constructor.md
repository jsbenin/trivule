---
name: Feature Request
about: Refactor TrivuleForm constructor to improve initialization pattern
title: '[FEATURE] Refactor TrivuleForm constructor - Move logic to setConfig method'
labels: enhancement, refactoring, breaking-change
assignees: ''
---

**Is your feature request related to a problem? Please describe.**
Currently, the `TrivuleForm` constructor accepts complex parameters and handles multiple initialization scenarios, which makes the class instantiation complex and less predictable. The constructor handles both container/config parameter combinations, making the API confusing:

```typescript
// Current complex constructor signatures
new TrivuleForm(containerOrConfig?, config?)
```

This leads to:

- Complex constructor logic that's hard to maintain
- Multiple initialization paths that can be confusing
- Tight coupling between instantiation and configuration
- Difficulty in testing different configuration scenarios
- Inconsistent API patterns compared to other parts of the codebase

**Describe the solution you'd like**
Refactor the `TrivuleForm` class to have a parameter-less constructor and move all initialization logic to the `setConfig` method:

1. **Empty Constructor**: The constructor should not accept any parameters and should only initialize basic properties
2. **Enhanced setConfig Method**: Move the current constructor logic to `setConfig` method to handle both container and config parameters
3. **Explicit Initialization**: After instantiation, developers must explicitly call `setConfig()` to configure the form
4. **Cleaner API**: This creates a cleaner, more predictable initialization pattern

**Proposed API:**

```typescript
// New pattern
const trivuleForm = new TrivuleForm();
trivuleForm.setConfig(containerOrConfig, config);
trivuleForm.init();

// Or with method chaining
const trivuleForm = new TrivuleForm()
  .setConfig(containerOrConfig, config)
  .init();
```

## Describe alternatives you've considered

1. **Static Factory Methods**: Create static methods like `TrivuleForm.create()` but this adds complexity
2. **Builder Pattern**: Implement a builder pattern, but it might be overkill for this use case
3. **Keep Current API**: Maintain the current constructor but add deprecation warnings

**Additional context**
This change would:

- Simplify the constructor and make it more predictable
- Improve testability by separating instantiation from configuration
- Align with the overall API consistency goals of the project
- Make the initialization flow more explicit and clear
- Reduce constructor complexity and improve maintainability

**Implementation considerations:**

- This is a breaking change that requires updating all existing code
- All tests need to be updated to use the new pattern
- Documentation and examples must be updated
- Consider providing a migration guide for existing users
- Ensure backward compatibility during a transition period if needed

**Breaking Changes:**

- Existing code using `new TrivuleForm(params)` will need to be updated
- All test files will require modifications
- Integration patterns will change

**Migration Pattern:**

```typescript
// Before
const form = new TrivuleForm(element, config);

// After  
const form = new TrivuleForm();
form.setConfig(element, config);
```
