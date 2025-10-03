# equals and notEquals

New validation rules to compare an input value against a specific value.

- equals:value — passes if the input is equal to value
- notEquals:value — passes if the input is different from value

Both rules accept either string or numeric values. If both the input and the parameter are numeric, comparison is performed numerically. Otherwise, a string (strict) comparison is used.

## Declarative usage

```html
<!-- equals -->
<input type="text" name="points" data-tr-rules="equals:50" />
<div data-tr-feedback="points"></div>

<!-- notEquals -->
<input type="text" name="username" data-tr-rules="notEquals:admin" />
<div data-tr-feedback="username"></div>
```

## Imperative usage

```ts
import { TrivuleForm } from 'trivule';

const form = new TrivuleForm('form');
form.make({
  points: {
    rules: 'equals:50',
    feedbackElement: '[data-tr-feedback="points"]',
  },
  username: {
    rules: 'notEquals:admin',
    feedbackElement: '[data-tr-feedback="username"]',
  },
});
```

## Messages (EN)

- equals: "This field must be equal to ':arg0'"
- notEquals: "This field must be different from ':arg0'"

You can override or translate these messages using `TrLocal.translate` or `TrLocal.rewrite`.

## Notes

- Parameter is required. If omitted or invalid, validation will throw an error.
- Trivule compares numerically when both the input and the parameter are numbers (e.g., `50` vs `"50"` is considered equal). Otherwise, comparison falls back to string equality.
