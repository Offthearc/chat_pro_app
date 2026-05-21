import '@testing-library/jest-dom/vitest'

// Node 26 ships an experimental `localStorage` global that returns `undefined`
// unless --localstorage-file is passed.  vitest's populateGlobal skips
// localStorage because it already exists on the Node global, so jsdom's
// fully-functional implementation never reaches `globalThis`.
// We fix this by reading localStorage from the jsdom JSDOM instance that
// vitest attaches to `global.jsdom`, then redefining the global property.
const g = globalThis as unknown as {
  jsdom?: { window: { localStorage: Storage; sessionStorage: Storage } }
}
if (g.jsdom) {
  const { localStorage: ls, sessionStorage: ss } = g.jsdom.window
  Object.defineProperty(globalThis, 'localStorage', {
    get: () => ls,
    configurable: true,
  })
  Object.defineProperty(globalThis, 'sessionStorage', {
    get: () => ss,
    configurable: true,
  })
}
