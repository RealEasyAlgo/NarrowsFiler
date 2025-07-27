#!/usr/bin/env python3

import os
import sys
import json
from datetime import datetime

import requests

# ─── CONFIGURATION ────────────────────────────────────────────────────────────────

# List of CEX exchanges to include
EXCHANGES = [
    "BINANCE",   # 457 assets
    "BINGX",     # 453 assets
    "BITGET",    # 501 assets
    "BITMEX",    #  98 assets
    "BLOFIN",    # 488 assets
    "BYBIT",     # 539 assets
    "GATEIO",    # 600 assets
    "MEXC",      # 708 assets
    "OKX",       # 243 assets
    "PHEMEX",    # 473 assets
    "WEEX",      # 679 assets
    "TOOBIT"     # 442 assets
]

SCAN_URL = "https://scanner.tradingview.com/crypto/scan"

# ─── FUNCTIONS ────────────────────────────────────────────────────────────────────

def fetch_all_symbols():
    """
    Calls the TradingView crypto scanner with an empty JSON payload
    and returns the full list of entries, each a dict with "s": "EXCH:SYMBOL", ...
    """
    resp = requests.post(SCAN_URL, json={})
    resp.raise_for_status()
    body = resp.json()
    return body.get("data", [])

def group_usdt_perps(entries):
    """
    From the full list of entries, build a mapping:
      exchange -> sorted list of tickers ending with 'USDT.P'
    """
    result = { exch: [] for exch in EXCHANGES }

    for item in entries:
        s = item.get("s", "")
        if ":" not in s:
            continue
        exch, ticker = s.split(":", 1)
        # only keep our target exchanges
        if exch not in EXCHANGES:
            continue
        # only USDT perpetuals
        if not ticker.endswith("USDT.P"):
            continue
        result[exch].append(ticker)

    # dedupe & sort each list
    for exch in result:
        result[exch] = sorted(set(result[exch]))

    return result

# ─── MAIN ────────────────────────────────────────────────────────────────────────

def main():
    # fetch everything
    print("Fetching full crypto scan…", file=sys.stderr)
    entries = fetch_all_symbols()
    print(f"→ {len(entries)} total entries", file=sys.stderr)

    # group & filter
    print("Grouping USDT-perpetual symbols by exchange…", file=sys.stderr)
    grouped = group_usdt_perps(entries)

    # write output
    date_tag = datetime.now().strftime("%y%m%d")
    out_name = f"AssetsPerExchange_{date_tag}.json"
    with open(out_name, "w", encoding="utf-8") as f:
        json.dump(grouped, f, ensure_ascii=False, indent=2)

# Print a count of USDT-perpetual assets per exchange
    print("\nAsset counts per exchange:")
    for exch, syms in grouped.items():
        print(f"{exch}: {len(syms)} assets")

    print(f"Done! Wrote file: {out_name}", file=sys.stderr)

if __name__ == "__main__":
    main()
