module.exports = {
    extends: "stylelint-config-standard",
    plugins: [
        "stylelint-scss"
    ],
    rules: {
        "at-rule-no-unknown": null,
        "scss/at-rule-no-unknown": true,
        "no-empty-source": null,
        "function-name-case": null,
        "indentation": 4,
        "number-max-precision": 3,
        "declaration-no-important": true,
        "declaration-block-no-redundant-longhand-properties": true,
        "hue-degree-notation": "angle",
        "length-zero-no-unit": true,
        "font-weight-notation": "numeric",
        "unit-blacklist": ["em", "cm", "ex", "in", "mm", "pc", "pt"],
        "shorthand-property-no-redundant-values": true,
        "color-no-invalid-hex": true,
        "declaration-block-no-duplicate-properties": true,
        "no-extra-semicolons": true,
        "selector-pseudo-element-colon-notation": "double",
        "no-unknown-animations": true,
        "value-list-comma-space-after": "always",
        "string-quotes": "single",
        "function-url-quotes": "always",
        "selector-attribute-quotes": "always",
        "at-rule-semicolon-space-before": "never",
        "max-empty-lines": 1,
        "no-descending-specificity": null
    }
}