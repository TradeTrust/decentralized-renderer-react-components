import { TextEncoder, TextDecoder } from "util";

Object.assign(global, {
  TextDecoder,
  TextEncoder,
});
window.alert = jest.fn();
window.fetch = jest.fn();
