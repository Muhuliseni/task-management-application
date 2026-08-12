"use strict";

export default [
    {
        files: ["**/*.js"],
        ignores: ["node_modules/**", "coverage/**"],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            globals: {
                document: "readonly",
                window: "readonly",
                localStorage: "readonly",
                alert: "readonly",
                console: "readonly",
                describe: "readonly",
                test: "readonly",
                expect: "readonly",
                beforeEach: "readonly",
                jest: "readonly"
            }
        },
        rules: {
            "no-unused-vars": "warn",
            "no-var": "error",
            eqeqeq: "error",
            "prefer-const": "warn",
            "no-console": "off"
        }
    }
];
