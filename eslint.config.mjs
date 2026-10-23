import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
    {
        ignores: [
            "src/webview/proofState.js",
            "src/webview/proofStateChat.js",
            "src/webview/main.js",
            "src/webview/chatPanel.js",
            "dist/**",
            "out/**"
        ]
    },
    {
        files: ["**/*.ts"],
        plugins: {
            "@typescript-eslint": typescriptEslint,
        },
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 2022,
            sourceType: "module",
        },
        rules: {
            "@typescript-eslint/naming-convention": ["warn", {
                selector: "import",
                format: ["camelCase", "PascalCase"],
            }],
            curly: ["warn", "multi-line"], 
            eqeqeq: "warn",
            "no-throw-literal": "warn",
            semi: "warn",
        },
    }
];
