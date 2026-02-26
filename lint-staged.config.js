module.exports = {
  '*': ['eslint --fix --no-warn-ignored -f json'],
  '**/*.ts?(x)': () => 'bun run check-types',
};
