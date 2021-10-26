import pkg from './package.json';
import { terser } from 'rollup-plugin-terser';

const module = (format, output, options = {}) => ({
      input: "src/lzjb.js",
      output: [
        {
            format,
            file: output,
            ...options
        }
      ]
})


export default [
    module('es', pkg.module),
    module('umd', pkg.unpkg, { name: 'lzjb', exports: 'named', sourcemap: true, plugins: [terser()] }),
    module('cjs', pkg.main, { exports: 'named' })
];