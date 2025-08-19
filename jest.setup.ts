import { TextEncoder, TextDecoder } from "util";
import { webcrypto } from "crypto";

// Mock crypto APIs for Jest environment
Object.assign(global, {
  TextDecoder,
  TextEncoder,
  crypto: webcrypto,
  CryptoKey: webcrypto.CryptoKey,
  setImmediate: (callback: (...args: any[]) => void, ...args: any[]) => setTimeout(callback, 0, ...args),
});

// Mock window APIs
Object.assign(window, {
  crypto: webcrypto,
  CryptoKey: webcrypto.CryptoKey,
});

window.alert = jest.fn();
window.fetch = jest.fn();
