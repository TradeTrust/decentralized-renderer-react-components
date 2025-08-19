import { TextEncoder, TextDecoder } from "util";

Object.assign(global, {
  TextDecoder,
  TextEncoder,
});
window.alert = jest.fn();
window.fetch = jest.fn();

// Mock crypto API for Node.js environment - Enhanced for CI compatibility
class MockCryptoKey {
  constructor(
    public algorithm: any = {},
    public extractable: boolean = true,
    public type: string = 'secret',
    public usages: string[] = []
  ) {}
}

// Enhanced crypto mock that works in both local and CI environments
const mockCrypto = {
  getRandomValues: (arr: any) => {
    if (arr && arr.length) {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
    }
    return arr;
  },
  randomUUID: () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },
  subtle: {
    generateKey: jest.fn().mockImplementation(() => Promise.resolve({
      privateKey: new MockCryptoKey({name: 'ECDSA', namedCurve: 'P-256'}, true, 'private', ['sign']),
      publicKey: new MockCryptoKey({name: 'ECDSA', namedCurve: 'P-256'}, true, 'public', ['verify'])
    })),
    importKey: jest.fn().mockImplementation(() => Promise.resolve(
      new MockCryptoKey({name: 'AES-GCM'}, true, 'secret', ['encrypt', 'decrypt'])
    )),
    exportKey: jest.fn().mockImplementation(() => Promise.resolve(new ArrayBuffer(32))),
    sign: jest.fn().mockImplementation(() => Promise.resolve(new ArrayBuffer(64))),
    verify: jest.fn().mockImplementation(() => Promise.resolve(true)),
    encrypt: jest.fn().mockImplementation(() => Promise.resolve(new ArrayBuffer(32))),
    decrypt: jest.fn().mockImplementation(() => Promise.resolve(new ArrayBuffer(32))),
    digest: jest.fn().mockImplementation(() => Promise.resolve(new ArrayBuffer(32))),
    deriveBits: jest.fn().mockImplementation(() => Promise.resolve(new ArrayBuffer(32))),
    deriveKey: jest.fn().mockImplementation(() => Promise.resolve(
      new MockCryptoKey({name: 'AES-GCM'}, true, 'secret', ['encrypt', 'decrypt'])
    )),
    wrapKey: jest.fn().mockImplementation(() => Promise.resolve(new ArrayBuffer(32))),
    unwrapKey: jest.fn().mockImplementation(() => Promise.resolve(
      new MockCryptoKey({name: 'AES-GCM'}, true, 'secret', ['encrypt', 'decrypt'])
    ))
  },
  // Add webcrypto property for compatibility
  webcrypto: undefined as any
};

// Set webcrypto to point to the same mock
mockCrypto.webcrypto = mockCrypto;

// Comprehensive crypto setup for different environments
const setupCrypto = () => {
  // Global scope (Node.js)
  if (typeof global !== 'undefined') {
    (global as any).crypto = mockCrypto;
    (global as any).CryptoKey = MockCryptoKey;
    // For Node.js webcrypto compatibility
    if (!(global as any).webcrypto) {
      (global as any).webcrypto = mockCrypto;
    }
  }

  // Window scope (browser-like environments)
  if (typeof window !== 'undefined') {
    (window as any).crypto = mockCrypto;
    (window as any).CryptoKey = MockCryptoKey;
  }

  // GlobalThis scope (universal)
  if (typeof globalThis !== 'undefined') {
    (globalThis as any).crypto = mockCrypto;
    (globalThis as any).CryptoKey = MockCryptoKey;
    if (!(globalThis as any).webcrypto) {
      (globalThis as any).webcrypto = mockCrypto;
    }
  }

  // Self scope (web workers)
  if (typeof self !== 'undefined') {
    (self as any).crypto = mockCrypto;
    (self as any).CryptoKey = MockCryptoKey;
  }
};

// Execute crypto setup
setupCrypto();

// Polyfill for setImmediate if not available
if (typeof global.setImmediate === 'undefined') {
  (global as any).setImmediate = (callback: (...args: any[]) => void, ...args: any[]) => {
    return setTimeout(callback, 0, ...args);
  };
}
