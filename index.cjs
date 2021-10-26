/**@license
 *
 * No Dependency fast LZJB Compression for Browser and Node
 *
 * Copyright (c) 2021 Jakub T. Jankiewicz https://jcubic.pl/me
 * Released under BSD-3-Clause License
 *
 * build: Tue, 26 Oct 2021 18:34:12 GMT
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/*
 * source https://github.com/copy/jslzjb-k
 * Based on jslzjb: https://code.google.com/p/jslzjb/
 * Heavily modified for speed
 */
// Constants was used for compress/decompress function.
const
/** @const */ NBBY = 8,
      /** @const */ MATCH_BITS = 6,
      /** @const */ MATCH_MIN = 3,
      /** @const */ MATCH_MAX = ((1 << MATCH_BITS) + (MATCH_MIN - 1)),
      /** @const */ OFFSET_MASK = ((1 << (16 - MATCH_BITS)) - 1),
      /** @const */ LEMPEL_SIZE = 256;

/**
  * Because of weak of javascript's natural, many compression algorithm
  * become useless in javascript implementation. The main problem is
  * performance, even the simple Huffman, LZ77/78 algorithm will take many
  * many time to operate. We use LZJB algorithm to do that, it suprisingly
  * fulfills our requirement to compress string fastly and efficiently.
  *
  * Our implementation is based on
  * http://src.opensolaris.org/source/raw/onnv/onnv-gate/
  * usr/src/uts/common/os/compress.c
  * It is licensed under CDDL.
  *
  * Compress byte array using fast and efficient algorithm.
  *
  * @param {Uint8Array} sstart  The buffer to compress
  * @param {Uint8Array} dstart  The buffer to write into
  * @return {number} compressed length (number of bytes written to the
  *                  output buffer). May be bigger than the size of the
  *                  output buffer, in which case some bytes are lost
  */
function compress(sstart, dstart) {
    var slen = 0,
        src = 0,
        dst = 0,
        cpy = 0,
        copymap = 0,
        copymask = 1 << (NBBY - 1),
        mlen = 0,
        offset = 0,
        hp = 0,
        lempel = new Int32Array(LEMPEL_SIZE),
        i = 0;

    // Initialize lempel array.
    for(i = 0; i < LEMPEL_SIZE; i++) {
        lempel[i] = -858993460;
    }

    slen = sstart.length;

    while (src < slen) {
        if ((copymask <<= 1) == (1 << NBBY)) {
            copymask = 1;
            copymap = dst;
            dstart[dst++] = 0;
        }

        if (src > slen - MATCH_MAX) {
            dstart[dst++] = sstart[src++];
            continue;
        }

        hp = ((sstart[src] + 13) ^
              (sstart[src + 1] - 13) ^
              sstart[src + 2]) &
            (LEMPEL_SIZE - 1);

        offset = (src - lempel[hp]) & OFFSET_MASK;
        lempel[hp] = src;
        cpy = src - offset;

        if (cpy >= 0 && cpy != src &&
            sstart[src] == sstart[cpy] &&
            sstart[src + 1] == sstart[cpy + 1] &&
            sstart[src + 2] == sstart[cpy + 2]) {
            dstart[copymap] |= copymask;
            for (mlen = MATCH_MIN; mlen < MATCH_MAX; mlen++)
                if (sstart[src + mlen] != sstart[cpy + mlen])
                    break;
            dstart[dst++] = ((mlen - MATCH_MIN) << (NBBY - MATCH_BITS)) |
                (offset >> NBBY);
            dstart[dst++] = offset;
            src += mlen;
        } else {
            dstart[dst++] = sstart[src++];
        }
    }

    console.assert(sstart.length >= src);

    return dst;
}

/**
  * Our implementation is based on
  * http://src.opensolaris.org/source/raw/onnv/onnv-gate/
  * usr/src/uts/common/os/compress.c
  * It is licensed under CDDL.
  *
  * Decompress byte array using fast and efficient algorithm.
  *
  * @param {Uint8Array} sstart  The buffer to decompress
  * @param {number} slen  compressed length
  * @param {Uint8Array} dstart  The buffer to write into
  * @return {number} decompressed length
  */
function decompress(sstart, slen, dstart) {
    slen = slen | 0;

    var src = 0,
        dst = 0,
        cpy = 0,
        copymap = 0,
        copymask = 1 << (NBBY - 1 | 0),
        mlen = 0,
        offset = 0;

    //var avg_mlen = [];

    while (src < slen) {
        if ((copymask <<= 1) === (1 << NBBY)) {
            copymask = 1;
            copymap = sstart[src];
            src = src + 1 | 0;
        }

        if (copymap & copymask) {
            mlen = (sstart[src] >> (NBBY - MATCH_BITS | 0)) + MATCH_MIN | 0;
            offset = ((sstart[src] << NBBY) | sstart[src + 1 | 0]) & OFFSET_MASK;
            src = src + 2 | 0;

            cpy = dst - offset | 0;
            //if (cpy >= 0)
            {
                //console.log(mlen);
                //avg_mlen.push(mlen);

                //dstart.set(dstart.subarray(cpy, cpy + mlen | 0), dst);
                //dst = dst + mlen | 0;
                //cpy = cpy + mlen | 0;

                //mlen = mlen - 1 | 0;
                while (mlen > 4) {
                    dstart[dst] = dstart[cpy];
                    dst = dst + 1 | 0;
                    cpy = cpy + 1 | 0;

                    dstart[dst] = dstart[cpy];
                    dst = dst + 1 | 0;
                    cpy = cpy + 1 | 0;

                    dstart[dst] = dstart[cpy];
                    dst = dst + 1 | 0;
                    cpy = cpy + 1 | 0;

                    dstart[dst] = dstart[cpy];
                    dst = dst + 1 | 0;
                    cpy = cpy + 1 | 0;

                    mlen = mlen - 4 | 0;
                }

                while (mlen > 0) {
                    dstart[dst] = dstart[cpy];
                    dst = dst + 1 | 0;
                    cpy = cpy + 1 | 0;
                    mlen = mlen - 1 | 0;
                }
            }
            //else
            //{
            //    /*
            //     * offset before start of destination buffer
            //     * indicates corrupt source data
            //     */
            //    console.warn("possibly corrupt data");
            //    return dstart;
            //}
        } else {
            dstart[dst] = sstart[src];
            dst = dst + 1 | 0;
            src = src + 1 | 0;
        }
    }

    //console.log(avg_mlen.reduce(function(a, x) { return a + x; }, 0) / avg_mlen.length);

    //console.assert(dstart.length >= dst);
    //console.assert(sstart.length >= src);

    return dst;
}


function encode_magic() {
    const encoder = new TextEncoder('utf-8');
    return encoder.encode(MAGIC_STRING);
}

const MAGIC_STRING = '@lzjb';
const MAGIC = encode_magic();

function merge_uint8_array(...args) {
    if (args.length > 1) {
        const len = args.reduce((acc, arr) => acc + arr.length, 0);
        const result = new Uint8Array(len);
        let offset = 0;
        args.forEach(item => {
            result.set(item, offset);
            offset += item.length;
        });
        return result;
    } else if (args.length) {
        return args[0];
    }
}

function number_to_bytes(number) {
    const len = Math.ceil(Math.log2(number) / 8);
    const byteArray = new Uint8Array(len);

    for (let index = 0; index < byteArray.length; index ++ ) {
        const byte = number & 0xff;
        byteArray[index] = byte;
        number = (number - byte) / 256;
    }

    return byteArray;
}

function bytes_to_number(byteArray) {
    let result = 0;
    for (let i = byteArray.length - 1; i >= 0; i--) {
        result = (result * 256) + byteArray[i];
    }

    return result;
}

function pack(input) {
    const out = new Uint8Array(Math.max(input.length * 1.5 | 0, 16 * 1024));
    const len = compress(input, out);
    const len_array = number_to_bytes(input.length);
    return merge_uint8_array(
        MAGIC,
        Uint8Array.of(len_array.length),
        len_array,
        out.slice(0, len)
    );
}

function unpack(input) {
    const decoder = new TextDecoder('utf-8');
    const magic = decoder.decode(input.slice(0, MAGIC.length));
    if (magic !== MAGIC_STRING) {
        throw new Error('Invalid magic value');
    }
    const size = input[MAGIC.length];
    const start = MAGIC.length + 1;
    const end = MAGIC.length + size + 1;
    const len = bytes_to_number(input.slice(start, end));
    input = input.slice(end);
    const out = new Uint8Array(len);
    decompress(input, input.length, out);
    return out;
}

exports.pack = pack;
exports.unpack = unpack;
