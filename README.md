# Trivule

Trivule is a powerful, user-friendly JavaScript library designed to simplify form validation for developers. It is a ready-to-integrate solution for modern frameworks with a **streamlined, focused API** that reduces complexity by ~30-40% while maintaining all essential validation features.

To get started with Trivule, please refer to the comprehensive documentation available [here](https://www.trivule.com). You can also follow a quick tutorial of less than 5 minutes [here](https://trivule.com/docs/tuto) to familiarize yourself with Trivule.

## ✨ What's New: Simplified & Streamlined

**Major v2.0 Refactor**: Trivule has been completely streamlined for better performance and maintainability:

## Key Features

```html
<input name="email" type="text" @v:rules="required|email|maxlength:60" />
<p @v:feedback="email" class="invalid-feedback"></p>
```

- **HTML/CSS-Based Validation**: Perfect for quickly setting up validations using just HTML and CSS. Ideal for projects where simplicity and speed are key.
- **Time Efficiency**: Minimize the time spent on scripting validations. Set up once, and let Trivule handle the rest.
- **Intuitive Syntax**: User-friendly attributes make implementing validation rules straightforward, even for those with minimal coding experience.
- **Conditional Validation Ready**: Easily set up conditions for your validations to handle complex scenarios with ease.

**Global Initialization**

```js
// Initialize Trivule globally with custom configuration
const trivule = Trivule.init({
  locale: 'fr',
  invalidClass: 'is-invalid',
  validClass: 'is-valid',
  triggerEvents: ['input', 'blur', 'submit'],
});
```

```html
<!-- This form will be automatically validated -->
<form @v:form>
  <input name="email" @v:rules="required|email" />
  <div @v:feedback="email"></div>
</form>

<!-- This form will be ignored by Trivule -->
<form>
  <input name="search" type="text" />
</form>
```

- **App-Wide Configuration**: Set up validation settings once and apply them across your entire application.
- **Selective Form Validation**: Only forms with the `@v:form` attribute (or configured prefix) are automatically validated.
- **Configurable Attribute Prefix**: Customize the attribute prefix (default: `@v:`) to avoid conflicts with other libraries.
- **Backward Compatibility**: If no forms have the attribute, all forms are validated for existing applications.
- **Consistent Validation Behavior**: Ensure uniform validation feedback and styling throughout your app.

**Custom error Messaging**

```html
<form @v:form>
  <div>
    <label for="email">Email:</label>
    <input
      id="email-1"
      type="text"
      id="email"
      name="email"
      @v:rules="required|email"
      @v:msg.required="Email obligatoire"
      @v:msg.email="Please provide a valid email"
    />
    <p @v:feedback="email" class="is-invalid"></p>
  </div>

  <div>
    <label for="password">Password:</label>
    <input
      id="password-1"
      type="password"
      id="password"
      name="password"
      @v:rules="required|min:6"
      @v:msg.required="Mot de passe obligatoire"
      @v:msg.min="Champ obligatoire"
    />
    <p @v:feedback="password" class="is-invalid"></p>
  </div>

  <button type="submit" @v:submit>Register</button>
</form>
```

- **Customizable Error Messages**: Tailor error messages to fit the context of your application, enhancing user guidance and experience.
- **Localization Support**: Extend your application’s reach with built-in support for multiple languages, making your forms globally accessible.
- **Smart Feedback Management**: Intelligent error feedback ensures users are clearly informed about validation issues, improving form completion rates.

**Robust Validation Rules**

```js
const rules = ['email', 'size:1GB', 'before:now'];
```

- **Intuitive and Understandable Rules**: Each rule is designed to be self-explanatory, providing clear guidance and reducing the learning curve.
- **Extensive Rule Set**: Cover a wide array of scenarios with Trivule’s comprehensive library of predefined validation rules.
- **Easily Extendable**: Add or customize rules as your application requirements grow or change.
- **Rewrite Existing Rules**: Adapt the library to meet specific needs by rewriting existing rules, offering unparalleled flexibility.

**Trivule** is your go-to solution for making form validation not just possible but also a pleasant part of user interactions. Whether you are a developer looking to streamline your workflow or a business aiming to improve user experience, Trivule provides the tools you need to succeed. Start simplifying your forms with Trivule today!

### Validation Made Simple

Effortlessly validate inputs using Trivule, saving valuable development time. Utilize the `@v:rules` attribute to define validation rules directly in your HTML:

```html
<input type="text" @v:rules="required|integer|between:16,50" name="age" />
```

or in javascript

```js
trivuleForm.make({
  age: {
    rules: 'required|integer|between:16,50',
  },
});
```

Display error messages with ease using the `@v:feedback` attribute:

```html
<div @v:feedback="age"></div>
```

or in javascript

```js
trivuleForm.make({
  age: {
    rules: 'required|integer|between:16,50',
    feedbackElement: '[@v:feedback="age"]', //or [@v:feedback]
  },
});
```

## Event-Based Validation

Validation is triggered by configured trigger events (default: `['submit']`). Configure trigger events using `@v:event`, globally or per form.

Usage Examples:

```html
<form @v:form @v:event="input|blur">
  <input name="email" @v:rules="required|email" />
  <input name="name" @v:rules="required|min:3" />
</form>
```

Input-level events override form-level:

```html
<form @v:form @v:event="blur">
  <!-- Uses form default: blur -->
  <input name="email" @v:rules="required|email" />

  <!-- Overrides with its own: input|blur -->
  <input name="name" @v:rules="required" @v:event="input|blur" />
</form>
```

Programmatic configuration:

```js
const form = new TrivuleForm();
form.init('#myForm', { triggerEvents: ['input', 'blur'] });
```

Priority Order:

1. Input's `@v:event` attribute (highest)
2. Form's `@v:event` attribute
3. Config's triggerEvents option
4. Default: `['submit']`

Valid Events:

- `input` - validates on every keystroke
- `blur` - validates when input loses focus
- `submit` - validates on form submission

### Custom Styling

Style your inputs dynamically based on validation results using `@v:invalid-class` or `@v:valid-class` attributes:

```html
<input
  type="text"
  @v:invalid-class="error"
  @v:valid-class="success"
  name="age"
/>
```

or in javascript

```js
trivuleForm.make({
  age: {
    rules: 'required|integer|between:16,50',
    invalidClass: 'error',
    validClass: 'success',
  },
});
```

### Custom Error Messages

You can override the error message for a specific rule with `@v:msg.<rule>`.

```html
<input
  type="text"
  name="age"
  @v:rules="required|integer"
  @v:msg.required="This field is required"
  @v:msg.integer="This field must be an integer"
/>
```

or in javascript

```js
trivuleForm.make({
  age: {
    rules: 'required|integer|between:16,50',
    messages: 'This field is required |This field must be an integer',
  },
});
```

### Add or Edit Rule

For adding or editing a rule in Trivule, you can play with `TrRule` class

```javascript
TrRule.add('notSudo', (input) => {
  return {
    value: input,
    passes: input != 'sudo',
  };
});
```

[Get Started with Trivule](https://www.trivule.com/docs)

## Usage Guide in a Framework

Welcome to the Trivule installation and usage guide.

### Install Trivule with npm

Install Trivule in your project. This guide uses Trivule version v1.3.0. If you are using an older version, you should migrate to version v1.3.0.

```sh
npm install trivule
```

### Imperative Approach

The imperative approach provides direct control over form validation with a clean, simplified API.

## Quick start

- [Single Input Validation](/docs/input-validation.md)
- [Form Validation](/docs/form-validation.md)

## Development

If you would like to contribute to the development of Trivule or customize the library, here's what you need:

### Prerequisites

- Node.js >= 20
- npm installed
- TypeScript

### Installation

To clone and install the Trivule project, follow these steps:

1. Clone the project using the following command:
   ```bash
   git clone https://github.com/trivule/trivule.git
   ```
2. Navigate to the project's root directory.
3. Install the dependencies by running the following command:
   ```bash
   npm install
   ```
4. If the installation is successful, start the development server with the following command:
   ```bash
   npm run dev
   ```
   This will start a local development server, and a link to the Trivule homepage (e.g., `http://localhost:5173`) will be displayed in your terminal. 

To create the bundles, run the following command:

```bash
npm run build
```

This command will generate the `index.mjs` and `index.umd.js` files in the `./dist` folder. The first file is intended for use as an ES6 module, while the second file is suitable for UMD systems. You can also use the `npm run build:watch` command to automatically compile files while you work.

### Directory Structure

The directory structure of the Trivule project is organized as follows:

- `src`: contains the main code of Trivule.
- `src/types`: contains interfaces and types used in Trivule.
- `src/locale`: contains internationalization files for different supported languages.
- `src/messages`: contains message generation files based on validation rules.
- `src/rules`: contains various validation rules available in Trivule.
- `src/utils`: contains utility files for Trivule.
- `src/core`: contains the core logic of Trivule.
- `dist`: contains the bundle files.
- `types`: contains TypeScript declarations.

## Contribution

The Trivule library is available on [GitHub](https://github.com/trivule/trivule) under an open-source license. We welcome contributions from the community. Please refer to our [contribution guidelines](https://trivule.com/docs/contribution) for more information and review our [code of conduct](https://trivule.com/docs/contribution#code-de-conduite) before contributing. Thank you to all the contributors who are involved in the development of Trivule.

## Community

Join the Trivule community:

- Discord: [https://discord.gg/6xKyDWA8TQ](https://discord.gg/6xKyDWA8TQ)
- X: [https://twitter.com/trivule](https://twitter.com/trivule)

## License

Trivule is released under our [license](http://www.trivule.com/docs/license) and developed by [Claude Fassinou](https://github.com/Claudye) and contributors.

Best regards

## Security

If you discover any security-related issues, please contact me directly at [dev.claudy@gmail.com](mailto:dev.claudy@gmail.com) instead of using the issue tracker.
