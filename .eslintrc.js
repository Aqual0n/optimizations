module.exports = {
  env: {
      browser: true,
      es2020: true,
      node: true,
      commonjs: true
  },
  extends: [
      "airbnb/base",
      "plugin:vue-libs/recommended"
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
      "parser": "babel-eslint",
      "ecmaVersion": 2020,
      "sourceType": "module"
  },
  plugins: [
      "vue",
      "pug"
  ],
  rules: {
      "no-underscore-dangle": "off",
      "consistent-return": "off",
      "func-names": "off",
      "max-len": ["off", {
          "code": "off",
          "tabWidth": 4,
      }],
      "indent": ["error", 4],
      "no-console": "off",
      "arrow-parens": ["error", "as-needed"],
      "vue/custom-event-name-casing": "off"
  }
}
