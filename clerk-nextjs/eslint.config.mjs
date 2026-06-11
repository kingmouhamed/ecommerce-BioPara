import nextVitals from 'eslint-config-next/core-web-vitals';

const ignoredPaths = [
  '.next/**',
  'node_modules/**',
  'coverage/**',
  'public/**',
];

const eslintConfig = [
  {
    ignores: ignoredPaths,
  },
  ...nextVitals,
  {
    rules: {
      'react-hooks/purity': 'off',
      'react-hooks/set-state-in-effect': 'off',
    },
  },
];

export default eslintConfig;
