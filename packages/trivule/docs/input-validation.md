# Single Input Validation

Trivule offers the capability to validate a single form field.

### Validation in Declarative Mode

```html
<input name="email" type="text" @v:rules="required|email" />
<div @v:feedback="email"></div>
```

```js
const trEmail = new TrivuleInput({
  selector: 'email', // input name or a valid CSS selector
});
```

### Validation in Imperative Mode

```html
<input name="email" type="text" />
```

```js
const trEmail = new TrivuleInput({
  selector: 'email', // input name or a valid CSS selector
  feedbackElement: '#email-feedback', // any valid CSS selector
});
```

Regardless of the chosen validation mode, the instance `trEmail` is available for advanced interactions.

```javascript
trEmail.onPassRule('startWithContact', (trEmail) => {
  // Perform actions on passing the rule
});
```

## Validation

Validation with the emission of events "tr.input.passes" or "tr.input.fails"

```javascript
trEmail.validate();
// Validate the input element
const isValid = trEmail.validate();

// Process the validation outcome
if (isValid) {
  console.log('Input is valid!');
} else {
  console.log('Input failed validation.');
}
```

Validation without emitting events

```javascript
// Perform silent validation
const isValid = trEmail.valid();

if (isValid) {
  console.log('Input is valid!');
} else {
  console.log('Input failed validation.');
}
```

## Handling Validation Status

**1. `onFails`**

- Attach a listener to the `"tr.input.fails"` event, triggered when the input fails validation.
- Define a callback function (`fn`) that accepts a `TrivuleInput` object as its argument.

**Example:**

```typescript
trEmail.onFails((trEmail) => {
  // Handle failed validation
});
```

## Custom Messages

You can customize error messages for individual rules using the `@v:msg` attribute with the rule name as a suffix.

**Example:**

```html
<input 
  name="email" 
  type="text" 
  @v:rules="required|email|maxlength:32"
  @v:msg-required="L'email est obligatoire"
  @v:msg-email="Veuillez entrer une adresse email valide"
  @v:msg-maxlength="L'email ne doit pas dépasser 32 caractères"
/>
<div @v:feedback="email"></div>
```

Each rule can have its own custom message:
- `@v:msg-required` - Custom message for the required rule
- `@v:msg-email` - Custom message for the email rule
- `@v:msg-maxlength` - Custom message for the maxlength rule

**2. `onPasses`**

- Attach a listener to the `"tr.input.passes"` event, activated upon successful validation of the input.
- Define a callback function (`fn`) that takes a `TrivuleInput` object as its argument.

**Example:**

```typescript
trEmail.onPasses((trEmail) => {
  console.log('Input passed validation!');
});
```
