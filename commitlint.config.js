module.exports = {
  extends: ['@commitlint/config-conventional'],
  plugins: ['commitlint-plugin-function-rules'],
  rules: {
    'function-rules/scope-enum': [
      2, // level: error
      'always',
      (parsed) => {
        const headerRegex =
          /^(feat|fix|build|chore|ci|docs|style|refactor|test|perf)\!?\:\ [a-z][\ -_><"'\w]*/;
        const isHeaderValid = parsed.header.match(headerRegex);
        if (!parsed.header || isHeaderValid) {
          return [true];
        }
        return [false, `header must match this regex: ${headerRegex}`];
      },
    ],
  },
};
