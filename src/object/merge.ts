import { BufferCodec } from "../types";

export function merge<A extends {}, CA>(
  a: BufferCodec<A, CA>
): BufferCodec<A, CA>;
export function merge<A extends {}, B extends {}, CA>(
  a: BufferCodec<A, CA>,
  b: BufferCodec<B, A & CA>
): BufferCodec<A & B, CA>;
export function merge<A extends {}, B extends {}, C extends {}, CA>(
  a: BufferCodec<A, CA>,
  b: BufferCodec<B, A & CA>,
  c: BufferCodec<C, A & B & CA>
): BufferCodec<A & B & C, CA>;
export function merge<
  A extends {},
  B extends {},
  C extends {},
  D extends {},
  CA
>(
  a: BufferCodec<A, CA>,
  b: BufferCodec<B, A & CA>,
  c: BufferCodec<C, A & B & CA>,
  d: BufferCodec<D, A & B & C & CA>
): BufferCodec<A & B & C & D, CA>;
export function merge<
  A extends {},
  B extends {},
  C extends {},
  D extends {},
  E extends {},
  CA
>(
  a: BufferCodec<A, CA>,
  b: BufferCodec<B, A & CA>,
  c: BufferCodec<C, A & B & CA>,
  d: BufferCodec<D, A & B & C & CA>,
  e: BufferCodec<E, A & B & C & D & CA>
): BufferCodec<A & B & C & D & E, CA>;
export function merge<
  A extends {},
  B extends {},
  C extends {},
  D extends {},
  E extends {},
  F extends {},
  CA
>(
  a: BufferCodec<A, CA>,
  b: BufferCodec<B, A & CA>,
  c: BufferCodec<C, A & B & CA>,
  d: BufferCodec<D, A & B & C & CA>,
  e: BufferCodec<E, A & B & C & D & CA>,
  f: BufferCodec<E, A & B & C & D & E & CA>
): BufferCodec<A & B & C & D & E & F, CA>;
export function merge<
  A extends {},
  B extends {},
  C extends {},
  D extends {},
  E extends {},
  F extends {},
  G extends {},
  CA
>(
  a: BufferCodec<A, CA>,
  b: BufferCodec<B, A & CA>,
  c: BufferCodec<C, A & B & CA>,
  d: BufferCodec<D, A & B & C & CA>,
  e: BufferCodec<E, A & B & C & D & CA>,
  f: BufferCodec<E, A & B & C & D & E & CA>,
  g: BufferCodec<E, A & B & C & D & E & F & CA>
): BufferCodec<A & B & C & D & E & F & G, CA>;
export function merge<
  A extends {},
  B extends {},
  C extends {},
  D extends {},
  E extends {},
  F extends {},
  G extends {},
  H extends {},
  CA
>(
  a: BufferCodec<A, CA>,
  b: BufferCodec<B, A & CA>,
  c: BufferCodec<C, A & B & CA>,
  d: BufferCodec<D, A & B & C & CA>,
  e: BufferCodec<E, A & B & C & D & CA>,
  f: BufferCodec<E, A & B & C & D & E & CA>,
  g: BufferCodec<E, A & B & C & D & E & F & CA>,
  h: BufferCodec<E, A & B & C & D & E & F & G & CA>
): BufferCodec<A & B & C & D & E & F & G & H, CA>;

/**
 * Creates a codec which merges together multiple codecs, calling each
 * codec in sequence, and merging the object returned by each.
 *
 * ```ts
 * const userCodec = merge(
 *   fields({ userId: number.UInt8 }),
 *   fields({ foo: number.UInt8 })
 * )
 *
 * userCodec.parse(Buffer.from([1234, 1337])).value
 * // => { userId: 1234, foo: 1337 }
 * ```
 */
export function merge<C>(
  ...codecs: BufferCodec<any, C>[]
): BufferCodec<any, C> {
  return {
    parse: (buffer, context) =>
      codecs.reduce(
        ({ value, byteLength }, codec) => {
          const view = buffer.slice(byteLength);
          const result = codec.parse(view, value);
          return {
            value: { ...value, ...result.value },
            byteLength: byteLength + result.byteLength,
          };
        },
        { value: context, byteLength: 0 }
      ),
    serialize: (input) =>
      Buffer.concat(codecs.map((codec) => codec.serialize(input))),
  };
}
