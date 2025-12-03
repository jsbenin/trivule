# Docs - Trivule

<p align="center">
  <img src="icon.png" alt="Trivule Icon" width="100">
</p>

<p align="center">
  Professional documentation for Trivule, a user-friendly JavaScript library for HTML form validation.
</p>

<p align="center">
  <a href="https://trivule.com">View Online</a> •
  <a href="https://github.com/jsbenin/trivule">GitHub</a> •
  <a href="#contributing">Contributing</a>
</p>

## About

Trivule is a user-friendly JavaScript library for HTML form validation. It allows you to quickly add validation rules to your form fields using custom HTML attributes, without the need to write additional JavaScript code. Trivule's custom HTML attributes are easy to understand and use, enabling you to quickly set up a robust validation system without spending a lot of time creating custom validation functions or writing complex JavaScript code.

This documentation site is built with Next.js and [Fumadocs](https://github.com/fuma-nama/fumadocs), providing a seamless experience for developers and contributors.

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- pnpm (only package manager supported; others will be rejected)

### Installation

Clone the repository:

```bash
git clone https://github.com/jsbenin/trivule-docs.git
cd trivule-docs
```

Install dependencies:

```bash
pnpm install
```

### Development

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

| Route                     | Description                                            |
| ------------------------- | ------------------------------------------------------ |
| `app/(home)`              | The route group for your landing page and other pages. |
| `app/docs`                | The documentation layout and pages.                    |
| `app/api/search/route.ts` | The Route Handler for search.                          |

Key files:
- `lib/source.ts`: Content source adapter using Fumadocs API.
- `lib/layout.shared.tsx`: Shared layout options.
- `source.config.ts`: Configuration for MDX and frontmatter.

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on how to get started.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Run tests and linting: `pnpm lint`
5. Commit your changes: `git commit -m "Add your message"`
6. Push to your branch: `git push origin feature/your-feature`
7. Open a Pull Request

## Resources

- [Trivule Library](https://trivule.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [Fumadocs](https://fumadocs.vercel.app)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
