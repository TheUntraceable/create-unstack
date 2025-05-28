# Create Unstack

![npm](https://img.shields.io/npm/v/create-unstack)
![License](https://img.shields.io/npm/l/create-unstack)
![Downloads](https://img.shields.io/npm/dt/create-unstack)
![Node Version](https://img.shields.io/node/v/create-unstack)

> 🚀 A modern Next.js application scaffolding tool with TailwindCSS, HeroUI, and configurable authentication & database options.

Create Unstack is a streamlined CLI tool that helps you bootstrap complete Next.js applications with a carefully selected tech stack, sensible defaults, and optional features to suit your project needs.

## Features

- 🌐 **[Next.js 15+](https://nextjs.org/)** - The latest version of the React framework
- 🎨 **[TailwindCSS](https://tailwindcss.com/)** - Utility-first CSS framework with pre-configured design tokens
- 🧰 **[HeroUI](https://heroui.org/)** - Modern component library for building beautiful UIs
- 🖌️ **[ShadCN](https://ui.shadcn.com/)** - Pre-configured component library for TailwindCSS
- 🔒 **[Authentication](https://better-auth.com/)** - Optional Better-Auth integration for secure user management
- 🗄️ **[MongoDB](https://www.mongodb.com/)** - Optional MongoDB integration for data storage
- ⚡ **[Million.js](https://million.dev/)** - Optional React performance optimization
- 🔍 **[ESLint & Prettier](https://eslint.org/)** - Pre-configured with sensible defaults
- 📦 **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript with strict configuration
- 🚀 **Fast Start** - Get up and running in seconds, not hours

## Installation

You can use Create Unstack without installing it by using npx:

```bash
npx create-unstack my-app
```

Or install it globally to use it anywhere:

```bash
npm install -g create-unstack
create-unstack my-app
```

## Why?

Create Unstack was made because it took me more time than I wanted to setup a new NextJS project with everything I wanted. I always had to delete a lot of things I didn't want, and I always had to add a lot of things I did want. So I decided to make a CLI that would do it for me. The stack used is what I personally use for my projects. I hope you like it!

## Usage

### Basic Usage

Simply run the CLI command and follow the interactive prompts:

```bash
npx create-unstack my-app
```

### Command Line Options

You can bypass the interactive prompts by using command line flags:

```bash
npx create-unstack my-app --db --auth --million
```

Available options:

- `--db`: Enable MongoDB integration
- `--auth`: Enable Better-Auth authentication
- `--million`: Enable Million.js optimization
- `--yes`: Use default options without prompts

### Project Structure

The generated project follows a clean, modern structure:

```
my-app/
├── app/                 # Next.js App Router
│   ├── layout.tsx       # Root layout with providers
│   ├── page.tsx         # Home page
│   └── providers.tsx    # Client-side providers
├── components/          # Reusable UI components
│   └── ui/              # UI components
├── config/              # Configuration files
│   ├── fonts.ts         # Font definitions
│   └── site.ts          # Site metadata
├── lib/                 # Utility functions and services
│   ├── utils.ts         # Helper functions
│   └── db.ts            # MongoDB client (if enabled)
├── styles/              # Global styles
│   └── globals.css      # TailwindCSS imports and variables
├── .eslintrc.mjs        # ESLint configuration
├── .prettierrc          # Prettier configuration
├── .gitignore           # Git ignore rules
├── next.config.js       # Next.js configuration
├── package.json         # Dependencies and scripts
├── postcss.config.js    # PostCSS configuration
├── tailwind.config.js   # TailwindCSS configuration
└── tsconfig.json        # TypeScript configuration
```

## Generated Tech Stack

The scaffolded application includes:

- **Next.js 15+** with App Router and React Server Components
- **TailwindCSS 3.4+** with design token variables
- **HeroUI** _and_ **ShadCN** setup out of the box for beautiful UI components
- **TypeScript** with strict configuration
- **ESLint & Prettier** with comprehensive rule sets
- **next-themes** for dark/light mode
- **Inter & Fira Code fonts** from Google Fonts

### Optional Features

When selected, these features are seamlessly integrated:

- **MongoDB** - Connection with development mode optimization
- **Better-Auth** - Authentication with MongoDB adapter
- **Million.js** - Performance optimization for React components

## Why Create Unstack?

While there are many starter templates available, Create Unstack offers:

1. **Fine-tuned Tech Selection** - Carefully chosen libraries that work well together
2. **Minimal Boilerplate** - Just enough structure without overwhelming complexity
3. **Optional Features** - Add only what you need
4. **Modern Practices** - Latest patterns and best practices for Next.js development
5. **Developer Experience** - Beautiful CLI, sensible defaults, and clear structure

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [HeroUI](https://heroui.dev/) - Beautiful UI components
- [Better-Auth](https://better-auth.dev/) - Authentication library
- [@clack/prompts](https://github.com/natemoo-re/clack) - Beautiful CLI prompts

---

Made with ❤️ by [The Untraceable](https://github.com/TheUntraceable)
