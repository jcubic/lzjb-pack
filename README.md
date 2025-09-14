# lzjb-pack

[No Dependency fast and small LZJB Compression for Node and browser](https://github.com/jcubic/lzjb-pack)

## Installation

```bash
npm install lzjb-pack
```

## Usage

Packing:

```javascript
import { pack } from 'lzjb-pack';
import * as fs from 'fs';
import { readFile, writeFile } from 'fs/promises';

readFile('package.json').then(buffer => {
  writeFile('package.json.lzjb', pack(buffer));
});

```

Unpacking:

```javascript
import { unpack } from 'lzjb-pack';

import { readFile, writeFile } from 'fs/promises';

readFile('package.json.lzjb').then(buffer => {
  writeFile('package-unpack.json', unpack(buffer));
});
```

## API

* `pack(Uint8Array | Buffer, { magic: boolean }): Uint8Array`
* `unpack(Uint8Array | Buffer, { magic: boolean }): Uint8Array`

if magic option is set to false magic string is not added to the output byte array.

## License
Copyright (c) 2010 Nuwa Information Co., Ltd, and individual contributors.<br/>
Copyright (c) 2021 [Jakub T. Jankiewicz](https://jakub.jankiewicz.org/)<br/>
Released under BSD-3-Clause License
