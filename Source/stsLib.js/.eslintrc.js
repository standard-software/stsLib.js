module.exports = {
    "env": {
        "browser": true,
        "node": true,
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": [
            "warn",
            2
        ],
        "linebreak-style": [
            "off",
            "windows"
        ],
        "quotes": [
            "warn",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        // "strict": [
        //    "error",
        //    "function"
        // ],
        "no-constant-condition": [
            "warn",
            {
                "checkLoops": false
            }
        ],
        "no-unused-vars": [
            "warn",
            {
              "vars": "all", "args": "after-used",
              "ignoreRestSiblings": false ,
              "argsIgnorePattern": "global|compares|array|index|value|str|s",
              "varsIgnorePattern": "varend|require|testFunc",
            },
        ],
        "no-console": [
            "off",
        ],
        "no-undef": [
            "error",
        ],
        "no-control-regex": [
            "off",
        ],
        "quotes": [
            "warn", "single", { "avoidEscape": true }
        ]
    }
};