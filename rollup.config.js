import ts from 'rollup-plugin-typescript2';
import resolvePlugin from '@rollup/plugin-node-resolve';
import commonJs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import json from '@rollup/plugin-json';
import path from 'path';
import pkg from './package.json';
import nodePolyfills from 'rollup-plugin-polyfill-node';
const resolve = (dir) => path.resolve(__dirname, dir);
const pkgName = pkg.name
  .split('-')
  .map((str) => str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase())
  .join('');
export default {
  input: resolve('src/index.ts'),
  output: [
    {
      file: resolve('dist/index.cjs.js'),
      format: 'cjs',
      name: pkgName,
    },
    {
      file: resolve('dist/index.js'),
      format: 'umd',
      name: pkgName,
    },
    {
      file: resolve('dist/index.global.js'),
      format: 'iife',
      name: pkgName,
    },
  ],
  plugins: [
    json({
      namedExports: false,
    }),
    nodePolyfills({ include: ['path'] }),
    resolvePlugin(),
    ts({
      tsconfig: path.resolve(__dirname, 'tsconfig.json'),
      tsconfigOverride: {
        compilerOptions: { module: 'es2015' },
      },
    }),
    commonJs(),
    postcss(),
  ],
};
