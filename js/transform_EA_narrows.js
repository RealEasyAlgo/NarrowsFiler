function transform_EA_narrow(narrows, exchange_symbols, exchange_priority, header) {
    const resultLines = [];
    const assignedSymbols = new Set();
    // exchangeBuckets[exchange][section] = [symbols]
    const exchangeBuckets = {};

    // Parse BYBIT narrows into ordered trend sections (###ABOVE, ###IN BETWEEN, ...).
    // Symbols before any header (or files with no headers) go in an unnamed default section.
    const sectionOrder = [];        // section names in order of first appearance
    const sectionSymbols = {};      // section name -> [symbols]
    let currentSection = '';        // '' == default (no divider)

    for (const rawLine of narrows.split('\n')) {
        const line = rawLine.trim();
        if (line === '') continue;

        if (line.startsWith('###')) {
            currentSection = line.replace(/^###/, '').trim();
            continue;
        }

        if (!line.startsWith('BYBIT:')) continue;
        const symbol = line.replace('BYBIT:', '');

        if (!(currentSection in sectionSymbols)) {
            sectionSymbols[currentSection] = [];
            sectionOrder.push(currentSection);
        }
        sectionSymbols[currentSection].push(symbol);
    }

    // For each symbol, assign it to the first exchange in priority list that supports it,
    // preserving the trend section it came from.
    for (const section of sectionOrder) {
        for (const symbol of sectionSymbols[section]) {
            if (assignedSymbols.has(symbol)) continue;

            for (const exchange of exchange_priority) {
                const symbols = exchange_symbols[exchange];
                if (symbols && symbols.includes(symbol)) {
                    if (!exchangeBuckets[exchange]) exchangeBuckets[exchange] = {};
                    if (!exchangeBuckets[exchange][section]) exchangeBuckets[exchange][section] = [];
                    exchangeBuckets[exchange][section].push(symbol);
                    assignedSymbols.add(symbol);
                    break;
                }
            }
        }
    }

    // Start with the unmodified header
    let hdr = header.replace(/\s+$/, '').replace(/\n\s*\n+/g, '\n')
    const headerLines = hdr.split('\n');
    const resultHeader = [];

    for (const line of headerLines) {
        resultHeader.push(line);
        // if (line.trim() === '###NARROWS') break;
    }

    // Begin result string with the header
    resultLines.push(...resultHeader);

    // Now append sections, nested exchange (priority order) -> trend section (input order).
    for (const exchange of exchange_priority) {
        const buckets = exchangeBuckets[exchange];
        if (!buckets) continue;

        for (const section of sectionOrder) {
            const bucket = buckets[section];
            if (!bucket || bucket.length === 0) continue;

            const dividerName = section ? `${exchange} ${section}` : exchange;
            resultLines.push(`###${dividerName}`);
            for (const symbol of bucket) {
                resultLines.push(`${exchange}:${symbol}`);
            }
        }
    }

    let rslt = resultLines.join('\n')

    return rslt.replace(/\n\s*\n+/g, '\n');
}
