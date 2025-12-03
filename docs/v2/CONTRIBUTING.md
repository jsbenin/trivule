# Contributing to docs-trivule

Thank you for your interest in contributing to docs-trivule! This project is a Next.js documentation site built with Fumadocs. We welcome contributions from the community.

## Getting Started

1. Fork the repository on GitHub.
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/docs-trivule.git
   cd docs-trivule
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Start the development server:
   ```bash
   pnpm dev
   ```
   Open http://localhost:3000 to view the site.

## Development Workflow

- Use `pnpm lint` to check code quality with Biome.
- Use `pnpm format` to format code automatically.
- Run `pnpm build` to ensure the project builds successfully.
- For TypeScript, ensure no type errors (no dedicated typecheck script, but Next.js handles it during build).

## Contributing to Documentation

- Documentation is written in MDX and located in `content/docs/`.
- Follow the existing structure and conventions from Fumadocs.
- Test your changes by running the dev server and checking the rendered pages.

## Pull Request Process

1. Create a new branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes and commit them:
   ```bash
   git add .
   git commit -m "Description of changes"
   ```
3. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
4. Open a pull request on GitHub with a clear description of your changes.

## Code of Conduct

Please be respectful and constructive in all interactions. We aim to foster an inclusive community.

For questions, open an issue or discuss in your pull request.