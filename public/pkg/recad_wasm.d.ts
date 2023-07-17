/* tslint:disable */
/* eslint-disable */
/**
* @param {number} cursor
* @param {number} stage
* @param {number} inverse_z
* @returns {number}
*/
export function derive_actual_pos(cursor: number, stage: number, inverse_z: number): number;
/**
* @param {number} sx
* @param {number} sy
* @param {number} ex
* @param {number} ey
* @returns {number}
*/
export function get_distance_4p(sx: number, sy: number, ex: number, ey: number): number;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly derive_actual_pos: (a: number, b: number, c: number) => number;
  readonly get_distance_4p: (a: number, b: number, c: number, d: number) => number;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
