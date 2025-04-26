#!/usr/bin/env node
import { intro, multiselect, note, outro, spinner, text } from "@clack/prompts";
import boxen from "boxen";
import { execSync } from "child_process";
import { mkdir, writeFile } from "fs/promises";
import { randomUUID } from "node:crypto";
import { parseArgs } from "node:util";
import path from "path";
import color from "picocolors";

// Parse CLI arguments
const { values } = parseArgs({
    options: {
        db: { type: "boolean" },
        auth: { type: "boolean" },
        million: { type: "boolean" },
        yes: { type: "boolean" },
    },
});

async function main() {
    // Show intro
    intro(
        color.cyan(
            boxen("Create Unstack", {
                padding: 1,
                margin: 1,
                borderStyle: "double",
                title: "🚀 Next.js Scaffolding Tool",
            }),
        ),
    );

    // Project name
    let projectName = "";
    if (values.yes) {
        projectName = "my-app";
        note(`Using default project name: ${color.green(projectName)}`);
    } else {
        projectName = (await text({
            message: "What is your project name?",
            placeholder: "my-app",
            validate(value) {
                if (!value) return "Please enter a project name";
                if (!/^[a-z0-9-_]+$/.test(value))
                    return "Project name can only contain lowercase letters, numbers, hyphens, and underscores";
                return undefined;
            },
        })) as string;
    }

    // Features selection
    let features = {
        db: values.db ?? false,
        auth: values.auth ?? false,
        million: values.million ?? false,
    };

    if (!values.yes) {
        const selectedFeatures = (await multiselect({
            message: "Select optional features:",
            options: [
                { value: "db", label: "MongoDB" },
                { value: "auth", label: "Better-Auth (Authentication)" },
                { value: "million", label: "Million.js (Performance)" },
            ],
        })) as string[];

        features = {
            db: selectedFeatures.includes("db"),
            auth: selectedFeatures.includes("auth"),
            million: selectedFeatures.includes("million"),
        };
    }

    // If auth is selected without db, enable db automatically
    if (features.auth && !features.db) {
        features.db = true;
        note(
            color.yellow(
                "Authentication requires a database. MongoDB has been automatically enabled.",
            ),
        );
    }

    // Create project directory
    const projectDir = path.join(process.cwd(), projectName);
    const s = spinner();
    s.start("Creating project directory");

    try {
        await mkdir(projectDir, { recursive: true });
        s.stop("Project directory created");
    } catch (error) {
        s.stop("Failed to create project directory");
        process.exit(1);
    }

    // Scaffold project
    s.start("Scaffolding project files");

    try {
        // Create package.json
        await writeFile(
            path.join(projectDir, "package.json"),
            JSON.stringify(generatePackageJson(projectName, features), null, 2),
        );
        if (features.million) {
            execSync("npx million@latest", { cwd: projectDir });

        }
        // Create next.config.js
        await writeFile(
            path.join(projectDir, "next.config.js"),
            generateNextConfig(features),
        );

        // Create tsconfig.json
        await writeFile(
            path.join(projectDir, "tsconfig.json"),
            JSON.stringify(generateTsConfig(), null, 2),
        );

        // Create .env and .env.example
        await writeFile(
            path.join(projectDir, ".env"),
            generateEnvFile(projectName),
        );

        await writeFile(
            path.join(projectDir, ".env.example"),
            generateEnvFile(projectName),
        );

        // Create .gitignore
        await writeFile(path.join(projectDir, ".gitignore"), generateGitignore());

        // Create README.md
        await writeFile(
            path.join(projectDir, "README.md"),
            generateReadme(projectName, features),
        );

        await mkdir(path.join(projectDir, "config"), { recursive: true });
        await writeFile(
            path.join(projectDir, "config", "site.ts"),
            generateSite(),
        )
        await writeFile(
            path.join(projectDir, "config", "fonts.ts"),
            generateFonts(),
        );
        // Create app directory structure
        await mkdir(path.join(projectDir, "app"), { recursive: true });
        await writeFile(
            path.join(projectDir, "app", "layout.tsx"),
            generateLayout(),
        );
        await writeFile(
            path.join(projectDir, "app", "page.tsx"),
            generateHomePage(),
        );
        // Create styles folder
        await mkdir(
            path.join(projectDir, "styles"),
            { recursive: true },
        )
        await writeFile(
            path.join(projectDir, "styles", "globals.css"),
            generateGlobalCss(),
        );

        // Create components directory
        await mkdir(path.join(projectDir, "components"), { recursive: true });
        await mkdir(path.join(projectDir, "components", "ui"), { recursive: true });

        // Create lib directory
        await mkdir(path.join(projectDir, "lib"), { recursive: true });
        await writeFile(path.join(projectDir, "lib", "utils.ts"), generateUtils());

        // Create tailwind.config.js
        await writeFile(
            path.join(projectDir, "tailwind.config.js"),
            generateTailwindConfig(),
        );
        // Create components.json
        await writeFile(
            path.join(projectDir, "components.json"),
            JSON.stringify(generateComponentsJson(), null, 2),
        );
        // Create app/providers.tsx
        await writeFile(
            path.join(projectDir, "app", "providers.tsx"),
            generateProviders(),
        );

        // Create postcss.config.js
        await writeFile(
            path.join(projectDir, "postcss.config.js"),
            generatePostcssConfig(),
        );

        // Create eslint.config.mjs
        await writeFile(
            path.join(projectDir, "eslint.config.mjs"),
            generateEslintConfig(),
        );

        // Create .prettierrc
        await writeFile(
            path.join(projectDir, ".prettierrc"),
            JSON.stringify(generatePrettierConfig(), null, 2),
        );

        // Create .vscode directory and settings
        await mkdir(path.join(projectDir, ".vscode"), { recursive: true });
        await writeFile(
            path.join(projectDir, ".vscode", "settings.json"),
            JSON.stringify(generateVsCodeSettings(), null, 2),
        );

        // Add MongoDB if selected
        if (features.db) {
            await writeFile(
                path.join(projectDir, "lib", "db.ts"),
                generateMongoDbConfig(),
            );
        }

        if (features.auth) {
            // Create @/lib/auth.ts
            await writeFile(
                path.join(projectDir, "lib", "auth.ts"),
                generateAuthConfig(),
            );

            await writeFile(
                path.join(projectDir, "lib", "auth-client.ts"),
                generateAuthClient(),
            );
            await mkdir(
                path.join(projectDir, "app", "api"),
                { recursive: true },
            )
            await mkdir(
                path.join(
                    projectDir,
                    "app",
                    "api",
                    "auth",
                ),
                { recursive: true },
            )
            await mkdir(
                path.join(
                    projectDir,
                    "app",
                    "api",
                    "auth",
                    "[...all]"
                ),
                { recursive: true },
            )
            await writeFile(
                path.join(
                    projectDir,
                    "app",
                    "api",
                    "auth",
                    "[...all]",
                    "route.ts"
                ),
                generateAuthRoute(),
            )
        }

        s.stop("Project files created successfully");
    } catch (error) {
        s.stop(`Failed to scaffold project: ${error}`);
        process.exit(1);
    }

    // Initialize git repository
    s.start("Initializing git repository");
    try {
        execSync("git init", { cwd: projectDir });
        execSync("git add .", { cwd: projectDir });
        execSync('git commit -m "Initial commit from create-untraceable-stack"', {
            cwd: projectDir,
        });
        s.stop("Git repository initialized");
    } catch (error) {
        s.stop("Failed to initialize git repository");
    }

    // Show success message
    outro(
        boxen(
            `${color.green("✅ Success!")} Your project ${color.cyan(projectName)} has been created.\n\n` +
            `To get started:\n\n` +
            `  ${color.yellow("cd")} ${projectName}\n` +
            `  ${color.yellow("bun install")} ${color.dim("# or npm install / yarn")}\n` +
            `  ${color.yellow("bun dev")} ${color.dim("# or npm run dev / yarn dev")}\n\n` +
            `${color.dim("Happy coding! 🚀")}`,
            {
                padding: 1,
                margin: 1,
                borderStyle: "round",
                title: "🎉 Next Steps",
            },
        ),
    );
}

// Helper functions to generate files
function generatePackageJson(
    projectName: string,
    features: { db: boolean; auth: boolean; million: boolean },
) {
    const dependencies: Record<string, string> = {
        next: "^15.3.0",
        "react": "18.3.1",
        "tailwindcss-animate": "^1.0.7",
        "react-dom": "18.3.1",
        "@heroui/system": "2.4.13",
        "@heroui/theme": "2.4.13",
        "@heroui/toast": "^2.0.7",
        "@heroui/button": "2.2.17",
        "next-themes": "^0.4.6",
        "tailwindcss": "3.4.16",
        postcss: "^8.4.31",
        autoprefixer: "^10.4.16",
        "class-variance-authority": "^0.7.1",
        "clsx": "^2.1.1",
        "lucide-react": "^0.292.0",
        "tailwind-merge": "^2.0.0",
    };

    if (features.db) {
        dependencies["mongodb"] = "^6.15.0";
    }

    if (features.auth) {
        dependencies["better-auth"] = "^1.2.7";
    }

    if (features.million) {
        dependencies["@million/lint"] = "^1.0.14";
    }

    const devDependencies: Record<string, string> = {
        "@types/react": "^18.2.37",
        "@types/react-dom": "^18.2.15",
        "@types/node": "^20.9.0",
        typescript: "^5.2.2",
        eslint: "^8.53.0",
        "eslint-config-next": "^14.0.0",
        prettier: "^3.0.3",
        "prettier-plugin-tailwindcss": "^0.5.7",
    };

    return {
        name: projectName,
        version: "0.1.0",
        private: true,
        scripts: {
            dev: "next dev",
            build: "next build",
            start: "next start",
            lint: "next lint",
            format: "prettier --write .",
        },
        dependencies,
        devDependencies,
    };
}

function generateNextConfig(features: { million: boolean }) {
    if (features.million) {
        return `const MillionLint = require("@million/lint");
/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = MillionLint.next({
    rsc: true,
})(nextConfig);
`;
    }

    return `/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
`;
}

function generateTsConfig() {
    return {
        compilerOptions: {
            target: "es5",
            lib: ["dom", "dom.iterable", "esnext"],
            allowJs: true,
            skipLibCheck: true,
            strict: true,
            forceConsistentCasingInFileNames: true,
            noEmit: true,
            esModuleInterop: true,
            module: "esnext",
            moduleResolution: "node",
            resolveJsonModule: true,
            isolatedModules: true,
            jsx: "preserve",
            incremental: true,
            plugins: [
                {
                    name: "next",
                },
            ],
            paths: {
                "@/*": ["./*"],
            },
        },
        include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
        exclude: ["node_modules"],
    };
}

function generateEnvFile(projectName: string) {
    return `MONGODB_URI="mongodb://localhost:27017/${projectName}"
BETTER_AUTH_SECRET=${randomUUID()}
BETTER_AUTH_URL="http://localhost:3000"
`;
}

function generateGitignore() {
    return `# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
`;
}

function generateReadme(
    projectName: string,
    features: { db: boolean; auth: boolean; million: boolean },
) {
    let featuresSection = `
## Features

- 🎨 **TailwindCSS** - Utility-first CSS framework
- 🧩 **ShadCN UI** - Accessible and customizable component library
- 🔍 **ESLint & Prettier** - Code linting and formatting
- 🔄 **Git** - Version control with initial commit
`;

    if (features.db) {
        featuresSection += `- 🗄️ **MongoDB** - Database with MongoDB\n`;
    }

    if (features.auth) {
        featuresSection += `- 🔐 **Better-Auth** - Best Authentication system\n`;
    }

    if (features.million) {
        featuresSection += `- ⚡ **Million.js** - Performance optimization for React\n`;
    }

    return `# ${projectName}

This project was bootstrapped with [create-untraceable-stack](https://github.com/TheUntraceable/create-untraceable-stack).

${featuresSection}

## Getting Started

First, install the dependencies:

\`\`\`bash
bun install
# or
npm install
# or
yarn install
\`\`\`

Then, run the development server:

\`\`\`bash
bun dev
# or
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [ShadCN UI Documentation](https://ui.shadcn.com)
${features.db ? "- [MongoDB Documentation](https://mongodb.com/docs)\n" : ""}
${features.auth ? "- [Better-Auth Documentation](https://better-auth.dev)\n" : ""}
${features.million ? "- [Million.js Documentation](https://million.dev)\n" : ""}
`;
}

function generateLayout() {
    return `import "@/styles/globals.css";
import clsx from "clsx";
import { Metadata, Viewport } from "next";

import { fontSans } from "@/config/fonts";
import { siteConfig } from "@/config/site";

import { Providers } from "./providers";

export const metadata: Metadata = {
    description: siteConfig.description,
    icons: {
        icon: "/favicon.ico",
    },
    title: {
        default: siteConfig.name,
        template: \`%s - \${siteConfig.name}\`,
    },
};

export const viewport: Viewport = {
    themeColor: [
        { color: "white", media: "(prefers-color-scheme: light)" },
        { color: "black", media: "(prefers-color-scheme: dark)" },
    ],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html suppressHydrationWarning lang="en">
            <head />
            <body
                className={clsx(
                    "min-h-screen bg-background font-sans antialiased",
                    fontSans.variable,
                )}
            >
                <Providers
                    themeProps={{ attribute: "class", defaultTheme: "dark" }}
                >
                    <div className="flex flex-col">
                        <main className="grow">{children}</main>
                    </div>
                </Providers>
            </body>
        </html>
    );
}`;
}

function generateFonts() {
    return `import { Fira_Code as FontMono, Inter as FontSans } from "next/font/google";

export const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
});

export const fontMono = FontMono({
    subsets: ["latin"],
    variable: "--font-mono",
});
`
}
function generateSite() {
    return `export type SiteConfig = typeof siteConfig;

export const siteConfig = {
    name: "Create Untraceable Stack",
    description:
        "Get up and running fast with Untraceable Stack.",
};`
}

function generateHomePage() {
    return `import { Button } from '@heroui/button';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-3xl text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Welcome to <span className="text-primary">Untraceable Stack</span>
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          A modern Next.js application with TailwindCSS, ShadCN UI, and more.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="shadow" color="primary>
            <a href="https://heroui.org/docs" target="_blank" rel="noopener noreferrer">
              Next.js Docs
            </a>
          </Button>
          <Button variant="bordered">
            <a href="https://ui.shadcn.com" target="_blank" rel="noopener noreferrer">
              ShadCN UI
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
`;
}

function generateGlobalCss() {
    return `@tailwind base;
@tailwind components;
@tailwind utilities;
 
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;

    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
 
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
 
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
 
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
 
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
 
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
 
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
 
    --radius: 0.5rem;
  }
 
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
 
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
 
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
 
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
 
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
 
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
 
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
 
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
 
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}
 
@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}`;
}

function generateUtils() {
    return `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;
}

function generateTailwindConfig() {
    return `import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
const config = {
    content: [
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-sans)"],
                mono: ["var(--font-mono)"],
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            colors: {
                border: {
                    DEFAULT: "hsl(var(--border))",
                    hover: "hsl(var(--border-hover))",
                },
            },
        },
    },
    darkMode: "class",
    plugins: [heroui(), require("tailwindcss-animate")],
};

module.exports = config;
`;
}

function generatePostcssConfig() {
    return `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;
}

function generateEslintConfig() {
    return `import js from "@eslint/js";
import { createRequire } from "node:module";

// Create a require function for importing CommonJS modules
const require = createRequire(import.meta.url);

// Load plugins
const globals = require("globals");
const typescriptPlugin = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const reactPlugin = require("eslint-plugin-react");
const reactHooksPlugin = require("eslint-plugin-react-hooks");
const jsxA11yPlugin = require("eslint-plugin-jsx-a11y");
const prettierPlugin = require("eslint-plugin-prettier");
const importPlugin = require("eslint-plugin-import");
const unusedImportsPlugin = require("eslint-plugin-unused-imports");
const sonarjsPlugin = require("eslint-plugin-sonarjs");
const securityPlugin = require("eslint-plugin-security");
const promisePlugin = require("eslint-plugin-promise");
const tailwindcssPlugin = require("eslint-plugin-tailwindcss");
const unicornPlugin = require("eslint-plugin-unicorn");
const perfectionistPlugin = require("eslint-plugin-perfectionist");
const importHelpersPlugin = require("eslint-plugin-import-helpers");
const nextPlugin = require("@next/eslint-plugin-next");
const performancePlugin = require("eslint-plugin-react-perf");
const eslintCommentsPlugin = require("eslint-plugin-eslint-comments");

export default [
    // Ignore patterns
    {
        ignores: [
            ".now/*",
            "**/*.css",
            "**/.changeset",
            "**/dist",
            "esm/*",
            "public/*",
            "tests/*",
            "scripts/*",
            "**/*.config.js",
            "**/.DS_Store",
            "**/node_modules",
            "**/coverage",
            "**/.next",
            "**/build",
            "!**/.commitlintrc.cjs",
            "!**/.lintstagedrc.cjs",
            "!**/jest.config.js",
            "!**/plopfile.js",
            "!**/react-shim.js",
            "!**/tsup.config.ts",
        ],
    },

    // Base JS configuration
    js.configs.recommended,

    // TypeScript configuration
    {
        files: ["**/*.ts", "**/*.tsx"],
        plugins: {
            "@typescript-eslint": typescriptPlugin,
        },
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 2023,
                sourceType: "module",
                ecmaFeatures: {
                    jsx: true,
                },
                project: "./tsconfig.json",
                tsconfigRootDir: ".",
            },
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {
            ...typescriptPlugin.configs.recommended.rules,
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-non-null-assertion": "warn",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    args: "after-used",
                    ignoreRestSiblings: false,
                    argsIgnorePattern: "^_.*?$",
                },
            ],
            // Enhanced TypeScript rules (type-aware)
            "@typescript-eslint/no-floating-promises": "error",
            "@typescript-eslint/no-misused-promises": "error",
            "@typescript-eslint/await-thenable": "error",
            "@typescript-eslint/no-for-in-array": "error",
            "@typescript-eslint/no-unnecessary-condition": "warn",
            "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
            "@typescript-eslint/prefer-nullish-coalescing": "warn",
            "@typescript-eslint/prefer-optional-chain": "warn",
            "@typescript-eslint/ban-ts-comment": [
                "warn",
                {
                    "ts-ignore": "allow-with-description",
                },
            ],
            "@typescript-eslint/naming-convention": [
                "warn",
                {
                    selector: "interface",
                    format: ["PascalCase"],
                    prefix: ["I"],
                },
                {
                    selector: "typeAlias",
                    format: ["PascalCase"],
                    prefix: ["T"],
                },
                {
                    selector: "enum",
                    format: ["PascalCase"],
                    prefix: ["E"],
                },
            ],
        },
    },

    // React configuration
    {
        files: ["**/*.jsx", "**/*.tsx"],
        plugins: {
            react: reactPlugin,
            "react-hooks": reactHooksPlugin,
            "jsx-a11y": jsxA11yPlugin,
            "react-perf": performancePlugin,
        },
        settings: {
            react: {
                version: "detect",
            },
        },
        rules: {
            ...reactPlugin.configs.recommended.rules,
            ...reactHooksPlugin.configs.recommended.rules,
            ...jsxA11yPlugin.configs.recommended.rules,
            "react/prop-types": "off",
            "react/jsx-uses-react": "off",
            "react/react-in-jsx-scope": "off",
            "react-hooks/exhaustive-deps": [
                "warn",
                {
                    additionalHooks:
                        "(useRecoilCallback|useRecoilTransaction_UNSTABLE)",
                },
            ],
            "jsx-a11y/click-events-have-key-events": "warn",
            "jsx-a11y/interactive-supports-focus": "warn",
            "react/self-closing-comp": "warn",
            "react/jsx-sort-props": [
                "warn",
                {
                    callbacksLast: true,
                    shorthandFirst: true,
                    noSortAlphabetically: false,
                    reservedFirst: true,
                },
            ],
            // Enhanced React rules
            "react/function-component-definition": [
                "warn",
                {
                    namedComponents: "arrow-function",
                    unnamedComponents: "arrow-function",
                },
            ],
            "react/no-array-index-key": "warn",
            "react/jsx-boolean-value": ["warn", "never"],
            "react/jsx-no-useless-fragment": "warn",
            // React performance rules
            "react-perf/jsx-no-new-object-as-prop": "warn",
            "react-perf/jsx-no-new-array-as-prop": "warn",
            "react-perf/jsx-no-new-function-as-prop": "warn",
            "react-perf/jsx-no-jsx-as-prop": "warn",
        },
    },

    // Next.js configuration
    {
        files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
        plugins: {
            "@next/next": nextPlugin,
        },
        rules: {
            ...nextPlugin.configs.recommended.rules,
            "@next/next/no-html-link-for-pages": "error",
            "@next/next/no-img-element": "warn",
            "@next/next/no-unwanted-polyfillio": "warn",
            "@next/next/no-sync-scripts": "warn",
            "@next/next/google-font-display": "warn",
            "@next/next/google-font-preconnect": "warn",
        },
    },

    // Prettier configuration
    {
        files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
        plugins: {
            prettier: prettierPlugin,
        },
        rules: {
            "prettier/prettier": "warn",
        },
    },

    // Import plugins configuration
    {
        files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
        plugins: {
            import: importPlugin,
            "unused-imports": unusedImportsPlugin,
            "import-helpers": importHelpersPlugin,
        },
        settings: {
            "import/resolver": {
                node: {
                    extensions: [".js", ".jsx", ".ts", ".tsx"],
                },
            },
        },
        rules: {
            "no-unused-vars": "off",
            "unused-imports/no-unused-vars": "off",
            "unused-imports/no-unused-imports": "warn",
            "import/order": "off",
            "import-helpers/order-imports": [
                "warn",
                {
                    newlinesBetween: "always",
                    groups: ["module", "/^@/", ["parent", "sibling", "index"]],
                    alphabetize: {
                        order: "asc",
                        ignoreCase: true,
                    },
                },
            ],
            // Enhanced import rules
            "import/no-absolute-path": "error",
            "import/no-self-import": "error",
            "import/no-cycle": ["warn", { maxDepth: 3 }],
            "import/no-useless-path-segments": [
                "warn",
                { noUselessIndex: true },
            ],
            "import/first": "warn",
            "import/no-duplicates": "warn",
            "import/exports-last": "warn",
            "import/no-unresolved": "off",
            "import/prefer-default-export": "off",
            "import/no-named-as-default": "off",
            "import/namespace": "off",
        },
    },

    // SonarJS configuration
    {
        files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
        plugins: {
            sonarjs: sonarjsPlugin,
        },
        rules: {
            ...sonarjsPlugin.configs.recommended.rules,
            "sonarjs/no-duplicate-string": ["warn", { threshold: 3 }],
            "sonarjs/cognitive-complexity": ["warn", 15],
            "sonarjs/no-nested-template-literals": "warn",
            "sonarjs/no-identical-functions": "warn",
            "sonarjs/prefer-immediate-return": "warn",
            "sonarjs/no-empty-collection": "error",
        },
    },

    // Security configuration
    {
        files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
        plugins: {
            security: securityPlugin,
        },
        rules: {
            ...securityPlugin.configs.recommended.rules,
            "security/detect-object-injection": "off",
        },
    },

    // Promise configuration
    {
        files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
        plugins: {
            promise: promisePlugin,
        },
        rules: {
            ...promisePlugin.configs.recommended.rules,
        },
    },

    // Tailwind CSS configuration
    {
        files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
        plugins: {
            tailwindcss: tailwindcssPlugin,
        },
        settings: {
            tailwindcss: {
                callees: ["cn", "cva", "clsx", "twMerge", "twJoin"],
                config: "tailwind.config.js",
                removeDuplicates: true,
                classRegex: "^(class(Name)?|tw)$",
            },
        },
        rules: {
            ...tailwindcssPlugin.configs.recommended.rules,
            "tailwindcss/no-custom-classname": "warn",
            "tailwindcss/classnames-order": "warn",
            "tailwindcss/enforces-negative-arbitrary-values": "warn",
            "tailwindcss/enforces-shorthand": "warn",
            "tailwindcss/migration-from-tailwind-2": "warn",
        },
    },

    // Unicorn configuration
    {
        files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
        plugins: {
            unicorn: unicornPlugin,
        },
        rules: {
            "unicorn/no-null": "off",
            "unicorn/prevent-abbreviations": "off",
        },
    },

    // Perfectionist configuration
    {
        files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
        plugins: {
            perfectionist: perfectionistPlugin,
        },
        rules: {
            "perfectionist/sort-objects": [
                "warn",
                {
                    type: "natural",
                    order: "asc",
                },
            ],
        },
    },

    // ESLint Comments configuration
    {
        files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
        plugins: {
            "eslint-comments": eslintCommentsPlugin,
        },
        rules: {
            "eslint-comments/no-unused-disable": "warn",
            "eslint-comments/no-unlimited-disable": "warn",
            "eslint-comments/require-description": [
                "warn",
                { ignore: ["eslint-enable"] },
            ],
        },
    },

    // General rules
    {
        files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
        rules: {
            "no-console": "warn",
            "padding-line-between-statements": [
                "warn",
                { blankLine: "always", prev: "*", next: "return" },
                {
                    blankLine: "always",
                    prev: ["const", "let", "var"],
                    next: "*",
                },
                {
                    blankLine: "any",
                    prev: ["const", "let", "var"],
                    next: ["const", "let", "var"],
                },
            ],
        },
    },
];`
}

function generatePrettierConfig() {
    return {
        tabWidth: 4,
        plugins: ["prettier-plugin-tailwindcss"],
    };
}

function generateVsCodeSettings() {
    return {
        "editor.formatOnSave": true,
        "editor.defaultFormatter": "rvest.vs-code-prettier-eslint",
        "editor.codeActionsOnSave": {
            "source.fixAll.eslint": true,
        },
        "typescript.tsdk": "node_modules/typescript/lib",
        "typescript.enablePromptUseWorkspaceTsdk": true,
    };
}

function generateMongoDbConfig() {
    return `import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;

if (process.env.NODE_ENV === "development") {
    let globalWithMongo = global as typeof globalThis & {
        _mongoClient?: MongoClient;
    };

    if (!globalWithMongo._mongoClient) {
        globalWithMongo._mongoClient = new MongoClient(uri, options);
    }
    client = globalWithMongo._mongoClient;
} else {
    client = new MongoClient(uri, options);
}

export { client };`;
}


function generateAuthConfig() {
    return `import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { client } from "@/lib/db";

const db = client.db("auth");

export const auth = betterAuth({
    database: mongodbAdapter(db)
});`;
}

function generateAuthClient() {
    return `import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
    baseURL: "http://localhost:3000"
})`;
}

function generateComponentsJson() {
    return {
        "$schema": "https://ui.shadcn.com/schema.json",
        "style": "new-york",
        "rsc": true,
        "tsx": true,
        "tailwind": {
            "config": "tailwind.config.js",
            "css": "styles/globals.css",
            "baseColor": "zinc",
            "cssVariables": false,
            "prefix": ""
        },
        "aliases": {
            "components": "@/components",
            "utils": "@/lib/utils",
            "ui": "@/components/ui",
            "lib": "@/lib",
            "hooks": "@/hooks"
        },
        "iconLibrary": "lucide"
    }
}

function generateProviders() {
    return `"use client";

import type { ThemeProviderProps } from "next-themes";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/navigation";
import * as React from "react";

import { HeroUIProvider } from "@heroui/system";
import { ToastProvider } from "@heroui/toast";

export interface ProvidersProps {
    children: React.ReactNode;
    themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
    interface RouterConfig {
        routerOptions: NonNullable<
            Parameters<ReturnType<typeof useRouter>["push"]>[1]
        >;
    }
}

export const Providers = ({ children, themeProps }: ProvidersProps) => {
    const router = useRouter();

    return (
        <HeroUIProvider navigate={router.push}>
            <ToastProvider />
            <NextThemesProvider {...themeProps}>
                {children}
            </NextThemesProvider>
        </HeroUIProvider>
    );
};`
}

function generateAuthRoute() {
    return `import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
 
export const { POST, GET } = toNextJsHandler(auth);`
}

main().catch(console.error);
