let wasm;

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}
/**
* @param {number} cursor
* @param {number} stage
* @param {number} inverse_z
* @returns {number}
*/
export function derive_actual_pos(cursor, stage, inverse_z) {
    const ret = wasm.derive_actual_pos(cursor, stage, inverse_z);
    return ret;
}

/**
* @param {number} sx
* @param {number} sy
* @param {number} ex
* @param {number} ey
* @returns {number}
*/
export function get_distance_4p(sx, sy, ex, ey) {
    const ret = wasm.get_distance_4p(sx, sy, ex, ey);
    return ret;
}

let stack_pointer = 128;

function addBorrowedObject(obj) {
    if (stack_pointer == 1) throw new Error('out of js stack');
    heap[--stack_pointer] = obj;
    return stack_pointer;
}
/**
* @param {Float32Array} arr
* @returns {Float32Array}
*/
export function return_jsarr(arr) {
    try {
        const ret = wasm.return_jsarr(addBorrowedObject(arr));
        return takeObject(ret);
    } finally {
        heap[stack_pointer++] = undefined;
    }
}

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
export function check_line_collision(bsx, bsy, bex, bey, gsx, gsy, gex, gey) {
    const ret = wasm.check_line_collision(bsx, bsy, bex, bey, gsx, gsy, gex, gey);
    return ret !== 0;
}

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
export function check_rect_collision(bsx, bsy, bex, bey, gsx, gsy, gex, gey) {
    const ret = wasm.check_rect_collision(bsx, bsy, bex, bey, gsx, gsy, gex, gey);
    return ret !== 0;
}

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
export function check_circle_collision(bsx, bsy, bex, bey, gsx, gsy, gex, gey) {
    const ret = wasm.check_circle_collision(bsx, bsy, bex, bey, gsx, gsy, gex, gey);
    return ret !== 0;
}

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
export function check_polygon_collision(bsx, bsy, bex, bey, gsx, gsy, gex, gey, sides) {
    const ret = wasm.check_polygon_collision(bsx, bsy, bex, bey, gsx, gsy, gex, gey, sides);
    return ret !== 0;
}

/**
* @param {number} circle_center_x
* @param {number} circle_center_y
* @param {number} circle_radius
* @param {number} point_x
* @param {number} point_y
* @returns {Array<any>}
*/
export function find_circle_tan_points(circle_center_x, circle_center_y, circle_radius, point_x, point_y) {
    const ret = wasm.find_circle_tan_points(circle_center_x, circle_center_y, circle_radius, point_x, point_y);
    return takeObject(ret);
}

/**
* @param {number} ptr_x
* @param {number} ptr_y
* @param {number} center_x
* @param {number} center_y
* @param {number} angle
* @returns {Array<any>}
*/
export function rotate_point(ptr_x, ptr_y, center_x, center_y, angle) {
    const ret = wasm.rotate_point(ptr_x, ptr_y, center_x, center_y, angle);
    return takeObject(ret);
}

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
export function check_quadratic_curve_intersect(bsx, bsy, bex, bey, c_sx, c_sy, c_mx, c_my, c_ex, c_ey) {
    const ret = wasm.check_quadratic_curve_intersect(bsx, bsy, bex, bey, c_sx, c_sy, c_mx, c_my, c_ex, c_ey);
    return ret !== 0;
}

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
export function check_cap_collision(bsx, bsy, bex, bey, gsx, gsy, gex, gey) {
    const ret = wasm.check_cap_collision(bsx, bsy, bex, bey, gsx, gsy, gex, gey);
    return ret !== 0;
}

/**
*/
export class Geometry {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_geometry_free(ptr);
    }
}
/**
*/
export class RealGeometry {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_realgeometry_free(ptr);
    }
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_number_new = function(arg0) {
        const ret = arg0;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_log_d8f770d99bfae179 = function(arg0, arg1) {
        console.log(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_new_898a68150f225f2e = function() {
        const ret = new Array();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_push_ca1c26067ef907ac = function(arg0, arg1) {
        const ret = getObject(arg0).push(getObject(arg1));
        return ret;
    };
    imports.wbg.__wbg_buffer_085ec1f694018c4f = function(arg0) {
        const ret = getObject(arg0).buffer;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_69193e31c844b792 = function(arg0, arg1, arg2) {
        const ret = new Float32Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_d086a66d1c264b3f = function(arg0) {
        const ret = new Float32Array(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_set_6146c51d49a2c0df = function(arg0, arg1, arg2) {
        getObject(arg0).set(getObject(arg1), arg2 >>> 0);
    };
    imports.wbg.__wbg_length_d7327c75a759af37 = function(arg0) {
        const ret = getObject(arg0).length;
        return ret;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_memory = function() {
        const ret = wasm.memory;
        return addHeapObject(ret);
    };

    return imports;
}

function __wbg_init_memory(imports, maybe_memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedUint8Memory0 = null;


    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(input) {
    if (wasm !== undefined) return wasm;

    if (typeof input === 'undefined') {
        input = new URL('recad_wasm_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await input, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync }
export default __wbg_init;
