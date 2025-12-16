# Trivule

Trivule is a powerful, user-friendly JavaScript library designed to simplify form validation for developers. It is a ready-to-integrate solution for modern frameworks with a **streamlined, focused API** that reduces complexity by ~30-40% while maintaining all essential validation features.

> **Documentation**: Refer to the [comprehensive documentation](https://www.trivule.com) or the [5-minute tutorial](https://trivule.com/docs/tuto) to get started quickly.

## ✨ What's New: Simplified & Streamlined

**Major v2.0 Refactor**: Trivule has been completely streamlined for better performance and maintainability.

---

## 🚀 Installation

Install Trivule via npm:

```bash
npm install trivule
```

---

## ✨ Key Features

- **HTML/CSS-Based Validation**: Perfect for quickly setting up validations using just HTML and CSS.
- **Time Efficiency**: Minimize scripting time. Set up once, and let Trivule handle the rest.
- **Intuitive Syntax**: User-friendly attributes make implementing validation rules straightforward.
- **Conditional Validation**: Easily handle complex scenarios.
- **Localization Support**: Built-in support for multiple languages.
- **Extensible**: Add or customize rules as your application requirements grow.

---

## 💡 Quick Start

### 1. HTML-Based Validation

Effortlessly validate inputs by defining rules directly in your HTML.

```html
<!-- Define rules -->
<input name="email" type="text" @v:rules="required|email|maxlength:60" />

<!-- Display feedback -->
<p @v:feedback="email" class="invalid-feedback"></p>
```

---

## 🛠 Usage & Configuration

### Global Initialization

Initialize Trivule globally with custom configuration to apply settings across your entire application.

```javascript
const trivule = Trivule.init({
  locale: 'fr',
  invalidClass: 'is-invalid',
  validClass: 'is-valid',
  triggerEvents: ['input', 'blur', 'submit'],
});
```

### Form Validation Setup

- **Automatic Validation**: Add `@v:form` to automatically validate a form.
- **Ignore Form**: Forms without the attribute (or configured prefix) are ignored by default in v2.0 (configurable).

```html
<!-- Automatically validated -->
<form @v:form>
  <input name="email" @v:rules="required|email" />
  <div @v:feedback="email"></div>
</form>

<!-- Ignored -->
<form>
  <input name="search" type="text" />
</form>
```

### Event-Based Validation

Control when validation triggers. Default is `['submit']`.

**Priority Order:**

1. Input's `@v:events` (Highest)
2. Form's `@v:events`
3. Global Config
4. Default (`submit`)

```html
<form @v:form @v:events="blur">
  <!-- Uses form default: blur -->
  <input name="email" @v:rules="required|email" />

  <!-- Overrides with input specific events -->
  <input name="name" @v:rules="required" @v:events="input|blur" />
</form>
```

### Custom Styling

Apply classes dynamically based on validation state.

```html
<input
  type="text"
  name="age"
  @v:invalid-class="error"
  @v:valid-class="success"
/>
```

### Custom Error Messages

Override default messages per field.

```html
<input
  type="text"
  name="email"
  @v:rules="required|email"
  @v:msg.required="Email is required"
  @v:msg.email="Please provide a valid email"
/>
```

### Extending Rules

Add your own validation logic using `TrRule`.

```javascript
TrRule.add('notSudo', (input) => {
  return {
    value: input,
    passes: input !== 'sudo',
  };
});
```

---

## 💻 Development & Contribution

If you would like to contribute to the development of Trivule or customize the library, here's what you need:

### Prerequisites

- Node.js >= 20
- npm installed
- TypeScript

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/trivule/trivule.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```
4. Build the project:
   ```bash
   npm run build
   ```

### Directory Structure

- `src/core`: Core logic.
- `src/rules`: Validation rules.
- `src/locale`: Internationalization files.
- `src/messages`: Message generation.

### Contributing

We welcome contributions! Please refer to our [contribution guidelines](https://trivule.com/docs/contribution) and [code of conduct](https://trivule.com/docs/contribution#code-de-conduite).

---

## 🤝 Community & Support

- **Discord**: [Join Server](https://discord.gg/6xKyDWA8TQ)
- **X (Twitter)**: [@trivule](https://twitter.com/trivule)
- **Security**: Contact [jsbenincommunity@gmail.com](mailto:jsbenincommunity@gmail.com) for security issues.

## 📄 License

Trivule is released under the [MIT License](http://www.trivule.com/docs/license). Maintained by the [JS Benin Community](mailto:jsbenincommunity@gmail.com) and developed by [Claude Fassinou](https://github.com/Claudye) and contributors.
