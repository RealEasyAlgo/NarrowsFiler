function transform_EA_narrow(narrows, exchange_symbols, exchange_priority, header) {
    const resultLines = [];
    const assignedSymbols = new Set();
    const exchangeBuckets = {};

    // Extract symbols from BYBIT narrows (ignore duplicates, trim spaces)
    const narrowSymbols = narrows
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('BYBIT:'))
        .map(line => line.replace('BYBIT:', ''));

    // For each symbol, assign it to the first exchange in priority list that supports it
    for (const symbol of narrowSymbols) {
        if (assignedSymbols.has(symbol)) continue;

        for (const exchange of exchange_priority) {
            const symbols = exchange_symbols[exchange];
            if (symbols && symbols.includes(symbol)) {
                if (!exchangeBuckets[exchange]) exchangeBuckets[exchange] = [];
                exchangeBuckets[exchange].push(symbol);
                assignedSymbols.add(symbol);
                break;
            }
        }
    }

    // Start with the unmodified header
    const headerLines = header.replace(/\n+$/, '').split('\n');
    const resultHeader = [];

    for (const line of headerLines) {
        resultHeader.push(line);
        // if (line.trim() === '###NARROWS') break;
    }

    // Begin result string with the header
    resultLines.push(...resultHeader);

    // Now append sections for each exchange (in order)
    for (const exchange of exchange_priority) {
        const bucket = exchangeBuckets[exchange];
        if (!bucket || bucket.length === 0) continue;

        resultLines.push(`###${exchange}`);
        for (const symbol of bucket) {
            resultLines.push(`${exchange}:${symbol}`);
        }
    }

    return resultLines.join('\n');
}
