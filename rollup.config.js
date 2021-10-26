import pkg from './package.json';
import { terser } from 'rollup-plugin-terser';
import fs from 'fs';

const now = new Date().toGMTString();
const banner = fs.readFileSync('./src/banner.js').toString().replace('{{DATE}}', now);

const terserConfig = {
    format: {
        comments: function (node, comment) {
            const text = comment.value;
            const type = comment.type;
            if (type == "comment2") {
                // multiline comment
                return /@license/i.test(text);
            }
        }
    }
};

const module = (format, output, options = {}) => ({
      input: "src/lzjb.js",
      output: [
        {
            format,
            banner,
            file: output,
            ...options
        }
      ]
})


export default [
    module('es', pkg.module),
    module('umd', pkg.unpkg, { name: 'lzjb', exports: 'named', sourcemap: true, plugins: [terser(terserConfig)] }),
    module('cjs', pkg.main, { exports: 'named' })
];