/**
 * @file funcs.ts
 * The utility functions for the project.
 * 
 * Developed bt @NeuroNexul / Arif Sardar
 * @license MIT
 */

import deepmerge from 'deepmerge';

export function stringifyNumberData(num: number) {
    if (num < 1000) return num.toString();
    if (num < 1000000) return `${(num / 1000).toFixed(1)}K`;
    if (num < 1000000000) return `${(num / 1000000).toFixed(1)}M`;
    return `${(num / 1000000000).toFixed(1)}B`;
}

export function merge(...objects: object[]) {
    return deepmerge.all(objects, { arrayMerge: (target, source) => source })
}
