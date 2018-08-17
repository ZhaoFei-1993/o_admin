module.exports = {
  "root": true,
  "parser": "babel-eslint",
  "extends": ["standard"],
  "plugins": [
    "html"
  ],
  "env": {
    "browser": true,
    "node": true
  },
  "globals": {
    "ga": true
  },
  "rules": {
    "space-before-function-paren": [
      2,
      {
        anonymous: 'always',
        named: 'never',
      },
    ],
    "no-multi-spaces": [0], // todo: 看一下如何允许注释的格式化前面的空格
    "semi": [2, "always"],
    "no-console": 0,
    "comma-dangle": [2, {
      "arrays": "always-multiline",
      "objects": "ignore",            // 对象并不总是需要的
      "imports": "always-multiline",
      "exports": "always-multiline",
      "functions": "ignore",
    }],
    "no-var": 2,
    "prefer-const": 2,
  }
}
