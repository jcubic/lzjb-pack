/**@license
 *
 * No Dependency fast LZJB Compression for Browser and Node
 *
 * Copyright (c) 2021 Jakub T. Jankiewicz https://jcubic.pl/me
 * Released under BSD-3-Clause License
 *
 * build: {{DATE}}
 */

type binaryInput = Uint8Array | Buffer;

export function pack(input: binaryInput): Uint8Array;
export function unpack(input: binaryInput): Uint8Array;
