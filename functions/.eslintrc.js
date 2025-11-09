module.exports = {
  root: true,
  env: {es6: true, node: true},
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    // 👇 important: anchor to the functions/ folder
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json", "./tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: ["/lib/**/*", "/generated/**/*"],
  plugins: ["@typescript-eslint", "import"],
  rules: {
    "quotes": ["error", "double"],
    "import/no-unresolved": 0,
    "indent": ["error", 2],
  },
};
