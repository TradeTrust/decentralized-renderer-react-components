import { Crypto } from "@peculiar/webcrypto";
import { TextEncoder, TextDecoder } from "util";

Object.assign(global, {
  TextDecoder,
  TextEncoder,
});
window.alert = jest.fn();
window.fetch = jest.fn();

// Polyfill Web Crypto
const cryptoInstance = new Crypto();
(globalThis as any).crypto = cryptoInstance;
(global as any).crypto.subtle = cryptoInstance.subtle;

// Polyfill setImmediate
if (typeof setImmediate === "undefined") {
  (global as any).setImmediate = (fn: Function, ...args: any[]) => setTimeout(fn, 0, ...args);
}
