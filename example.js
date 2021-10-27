import { pack, unpack } from './index.js';
import * as fs from 'fs';
import { readFile, writeFile } from 'fs/promises';

readFile('package.json').then(buffer => {
  const output = pack(buffer, { magic: false });
  writeFile('package.json.lzjb', output);
  const decoder = new TextDecoder('utf-8');
  console.log(decoder.decode(unpack(output, { magic: false })));
});