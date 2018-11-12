// Since @babel/plugin-syntax-dynamic-import uses promises and array iterator, but
// @babel/preset-env does not include them specifically for the dynamic imports
// we must explicitly tell to use these features (babel will polyfill if there is no some of them).
// Link: https://github.com/babel/babel/issues/7402

/* eslint-disable */

new Promise((resolve) => {
  resolve();
});
[][Symbol.iterator];
