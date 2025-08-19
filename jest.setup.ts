import { TextEncoder, TextDecoder } from "util";

// Try to import webcrypto, fallback to mock if not available
let crypto: any;
let CryptoKey: any;

try {
  const { webcrypto } = require('crypto');
  crypto = webcrypto;
  CryptoKey = webcrypto.CryptoKey;
} catch (error) {
  // Fallback for older Node.js versions or CI environments
  crypto = {
    getRandomValues: (arr: any) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    },
    subtle: {
      digest: jest.fn(),
      sign: jest.fn(),
      verify: jest.fn(),
      generateKey: jest.fn(),
      importKey: jest.fn(),
      exportKey: jest.fn(),
    },
  };
  CryptoKey = class MockCryptoKey {
    constructor(public algorithm: any, public extractable: boolean, public type: string, public usages: string[]) {}
  };
}

// Mock crypto APIs for Jest environment
Object.assign(global, {
  TextDecoder,
  TextEncoder,
  crypto,
  CryptoKey,
  setImmediate: (callback: (...args: any[]) => void, ...args: any[]) => setTimeout(callback, 0, ...args),
});

// Mock window APIs
Object.assign(window, {
  crypto,
  CryptoKey,
});

window.alert = jest.fn();
window.fetch = jest.fn();
