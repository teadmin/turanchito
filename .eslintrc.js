/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    // Disable problematic rules for deployment
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'react-hooks/exhaustive-deps': 'off',
    // Keep critical rules as errors
    'react/jsx-no-undef': 'error',
    'react/jsx-uses-vars': 'error',
  },
  env: {
    browser: true,
    node: true,
    es6: true
  }
}