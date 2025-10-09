# 🤝 Contributing to Trivule

First off all, thank you for taking the time to contribute 💙!  
Trivule is a community-driven project, and every contribution makes it better.

This guide will help you set up your development environment, follow project conventions, and submit useful contributions.

---

## 📋 Ways to Contribute

You can contribute in several ways:

- 🐞 **Report issues** — Bug reports and feature requests in [GitHub Issues](../../issues).
- 🧩 **Add new validation rules** — Expand Trivule’s rule set (we aim for 50+).
- 🌍 **Improve i18n/locales** — Add or improve translations.
- 🛠 **Improve DX** — Documentation, tests, examples, or bundling improvements.
- ✨ **Suggest ideas** — Discussions and proposals are welcome.

---

## 🚀 Getting Started

### 1. Fork & Clone

```bash
git clone https://github.com/YOUR_USERNAME/trivule.git
cd trivule
```

### 2. Install Dependencies

We use **pnpm**

```bash
pnpm install
```

### 3. Run Dev Environment

Start the development build & playground:

```bash
pnpm dev
```

### 4. Run Tests

We use **Vitest** + **Playwright** for unit and integration tests.

```bash
pnpm test
```

---

## 🎨 Code Style

We enforce formatting and linting:

- **Prettier** for formatting (`pnpm format`)
- **ESLint** for linting (`pnpm lint`)
- Commit messages follow **Conventional Commit**:
  - `feat: add min_length rule`
  - `fix: handle async rule resolution`
  - `docs: update readme for locales`
  - `test: add coverage for required_if`

CI will check these before merging.

---

## 🔄 Pull Request Workflow

1. **Create a branch**: `feat/rule-between`, `fix/locale-fr`
2. Push your changes & open a PR against `main`
3. Make sure:
   - ✅ Code passes lint & tests
   - ✅ Changes are documented (README or inline docs)
   - ✅ PR description explains _what_ and _why_
4. A maintainer will review:
   - We may request changes
   - Once approved, your PR gets merged 🎉

---

## 🧪 Testing Guidelines

- Every new rule must have **unit tests**
- Edge cases (empty values, wrong types) should be covered
- Async rules must include mock API tests
- Minimum coverage: 90%

Run coverage locally:

```bash
pnpm test --coverage
```

---

## 🌟 Tips for Contributors

- Keep PRs small and focused (one feature or fix per PR).
- If proposing new APIs/rules, open an issue/discussion first.
- Check bundle size impact (`pnpm size`) – keep Trivule lightweight!
- Think about **DX**: How would a beginner use this feature?

---

## 📜 License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).

---

💡 _Together, let’s make form validation declarative, lightweight, and fun!_
