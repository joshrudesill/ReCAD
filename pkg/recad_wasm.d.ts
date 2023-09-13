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
/**
* @param {Float32Array} arr
* @returns {Float32Array}
*/
export function return_jsarr(arr: Float32Array): Float32Array;
/**
* @param {Float32Array} sel_box
* @param {Array<any>} real_geo
*/
export function check_geo_collision(sel_box: Float32Array, real_geo: Array<any>): void;
/**
* @param {number} bsx
* @param {number} bsy
* @param {number} bex
* @param {number} bey
* @param {number} gsx
* @param {number} gsy
* @param {number} gex
* @param {number} gey
* @returns {boolean}
*/
export function check_line_collision(bsx: number, bsy: number, bex: number, bey: number, gsx: number, gsy: number, gex: number, gey: number): boolean;
/**
* @param {number} bsx
* @param {number} bsy
* @param {number} bex
* @param {number} bey
* @param {number} gsx
* @param {number} gsy
* @param {number} gex
* @param {number} gey
* @returns {boolean}
*/
export function check_rect_collision(bsx: number, bsy: number, bex: number, bey: number, gsx: number, gsy: number, gex: number, gey: number): boolean;
/**
* @param {number} bsx
* @param {number} bsy
* @param {number} bex
* @param {number} bey
* @param {number} gsx
* @param {number} gsy
* @param {number} gex
* @param {number} gey
* @returns {boolean}
*/
export function check_circle_collision(bsx: number, bsy: number, bex: number, bey: number, gsx: number, gsy: number, gex: number, gey: number): boolean;
/**
* @param {number} bsx
* @param {number} bsy
* @param {number} bex
* @param {number} bey
* @param {number} gsx
* @param {number} gsy
* @param {number} gex
* @param {number} gey
* @param {number} sides
* @returns {boolean}
*/
export function check_polygon_collision(bsx: number, bsy: number, bex: number, bey: number, gsx: number, gsy: number, gex: number, gey: number, sides: number): boolean;
/**
* @param {number} circle_center_x
* @param {number} circle_center_y
* @param {number} circle_radius
* @param {number} point_x
* @param {number} point_y
* @returns {Array<any>}
*/
export function find_circle_tan_points(circle_center_x: number, circle_center_y: number, circle_radius: number, point_x: number, point_y: number): Array<any>;
/**
* @param {number} ptr_x
* @param {number} ptr_y
* @param {number} center_x
* @param {number} center_y
* @param {number} angle
* @returns {Array<any>}
*/
export function rotate_point(ptr_x: number, ptr_y: number, center_x: number, center_y: number, angle: number): Array<any>;
/**
* @param {number} bsx
* @param {number} bsy
* @param {number} bex
* @param {number} bey
* @param {number} c_sx
* @param {number} c_sy
* @param {number} c_mx
* @param {number} c_my
* @param {number} c_ex
* @param {number} c_ey
* @returns {boolean}
*/
export function check_quadratic_curve_intersect(bsx: number, bsy: number, bex: number, bey: number, c_sx: number, c_sy: number, c_mx: number, c_my: number, c_ex: number, c_ey: number): boolean;
/**
*/
export class Geometry {
  free(): void;
}
/**
*/
export class RealGeometry {
  free(): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_geometry_free: (a: number) => void;
  readonly __wbg_realgeometry_free: (a: number) => void;
  readonly derive_actual_pos: (a: number, b: number, c: number) => number;
  readonly get_distance_4p: (a: number, b: number, c: number, d: number) => number;
  readonly return_jsarr: (a: number) => number;
  readonly check_geo_collision: (a: number, b: number) => void;
  readonly check_line_collision: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => number;
  readonly check_rect_collision: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => number;
  readonly check_circle_collision: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => number;
  readonly check_polygon_collision: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => number;
  readonly find_circle_tan_points: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly rotate_point: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly check_quadratic_curve_intersect: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number) => number;
  readonly wasm_bindgen__convert__closures__invoke3_mut__hc8af6d59e1c521d6: (a: number, b: number, c: number, d: number, e: number) => void;
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
