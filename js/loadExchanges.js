/**
 * js/loadExchanges.js
 *
 * Loads the list of exchange names from Exchanges.json (located alongside index.html).
 * Exposes a global `loadExchanges()` function returning a Promise<string[]>.
 */

async function loadExchanges() {
  const resp = await fetch('Exchanges.json');
  if (!resp.ok) {
    throw new Error(`Failed to load Exchanges.json: ${resp.status} ${resp.statusText}`);
  }
  return resp.json();
}

// Make available globally
window.loadExchanges = loadExchanges;
