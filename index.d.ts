/**@license
 *
 * No Dependency fast and small LZJB Compression for Browser and Node
 *
 * Copyright (c) 2021 Jakub T. Jankiewicz https://jcubic.pl/me
 * Released under BSD-3-Clause License
 *
 */

type Options = {
    magic?: boolean;
};
    
type BinaryInput = Uint8Array | Buffer;

export function pack(input: BinaryInput, options?: Options): Uint8Array;
export function unpack(input: BinaryInput, options?: Options): Uint8Array;
