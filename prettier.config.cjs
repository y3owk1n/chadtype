/** @type {import("prettier").Config & import('@trivago/prettier-plugin-sort-imports').PrettierConfig} */
const config = {
    trailingComma: "es5",
    tabWidth: 4,
    semi: true,
    singleQuote: false,
    bracketSpacing: true,
    jsxSingleQuote: false,
    printWidth: 80,
    arrowParens: "always",
    singleAttributePerLine: true,
    importOrder: [
        "^@(mda|ee)/(.*)$",
        "^@lib/(.*)$",
        "^@components/(.*)$",
        "^@(server|trpc)/(.*)$",
        "^~/(.*)$",
        "^[./]",
    ],
    importOrderSeparation: true,
    plugins: [
        require.resolve("@trivago/prettier-plugin-sort-imports"),
        require.resolve("prettier-plugin-tailwindcss"),
    ],
};

module.exports = config;
