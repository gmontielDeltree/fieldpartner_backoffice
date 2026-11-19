module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
  },
  overrides: [
    {
      // Deuda: estos archivos exportan hooks/helpers junto a componentes, lo que
      // rompe Fast Refresh (HMR recarga el módulo completo). Al separarlos en
      // archivos propios, sacar la excepción.
      files: [
        'src/components/LayoutApp/AuthLayout.tsx',
        'src/components/ui/ListKit.tsx',
        'src/components/ui/Pills.tsx',
        'src/themes/ColorMode.tsx',
        'src/themes/fieldpartnerTheme.tsx',
      ],
      rules: {
        'react-refresh/only-export-components': 'off',
      },
    },
  ],
}
