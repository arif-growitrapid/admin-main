/**
 * Storage Helper. This file contains all the functions related to local storage.
 * Can only be used in client side.
 * 
 * Developed bt @NeuroNexul / Arif Sardar
 * @license MIT
 */

import "client-only";

export function getLocalStorage(key: string, defaultValue: any) {
    const stickyValue = localStorage.getItem(key);

    return (stickyValue !== null && stickyValue !== 'undefined')
        ? JSON.parse(stickyValue)
        : defaultValue;
}

export function setLocalStorage(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
}