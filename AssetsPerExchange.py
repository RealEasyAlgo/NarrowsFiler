#!/usr/bin/env python3

import os
import sys
import json
import shutil

from datetime import datetime

import requests

SCAN_URL = "https://scanner.tradingview.com/crypto/scan"
DAILY_UPDATE_DIR = "assetsPerExchange_tmp"
DATELESS_FILE_NAME = "AssetsPerExchange.json"

# ─── FUNCTIONS ────────────────────────────────────────────────────────────────────

def load_exchanges():
    here = os.path.dirname(__file__)
    path = os.path.join(here, 'Exchanges.json')
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def fetch_all_symbols():
    """
    Calls the TradingView crypto scanner with an empty JSON payload
    and returns the full list of entries, each a dict with "s": "EXCH:SYMBOL", ...
    """
    resp = requests.post(SCAN_URL, json={})
    resp.raise_for_status()
    body = resp.json()
    return body.get("data", [])

def group_usdt_perps(exchanges, entries):
    """
    From the full list of entries, build a mapping:
      exchange -> sorted list of tickers ending with 'USDT.P'
    """
    result = { exch: [] for exch in exchanges }

    for item in entries:
        s = item.get("s", "")
        if ":" not in s:
            continue
        exch, ticker = s.split(":", 1)
        # only keep our target exchanges
        if exch not in exchanges:
            continue
        # only USDT perpetuals
        if not ticker.endswith("USDT.P"):
            continue
        result[exch].append(ticker)

    # dedupe & sort each list
    for exch in result:
        result[exch] = sorted(set(result[exch]))

    return result

def write_output(data):
    here = os.path.dirname(__file__)
    date_tag = datetime.now().strftime("%y%m%d")
    out_name = f"apx_{date_tag}.json"
    # out_path = DAILY_UPDATE_DIR
    out_path = os.path.join(here, DAILY_UPDATE_DIR, out_name)
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    return out_name

def reportAssestPerExchange(grouped):
    # Print a count of USDT-perpetual assets per exchange
    print("   ... Asset counts per exchange:")
    for exch, syms in grouped.items():
        print(f"      - {exch}: {len(syms)} assets")

def copyFromSubdir(subdir, orig_name, new_name) -> str:
    src_path = os.path.join(subdir, orig_name)
    if not os.path.isfile(src_path):
        raise FileNotFoundError(f"Source file not found: {src_path}")

    dst_path = os.path.join(os.getcwd(), new_name)
    # copy2 preserves metadata; use copy() or copyfile() if you don’t need that
    shutil.copy2(src_path, dst_path)
    return dst_path

def git_commit_and_push(filepath):
    # Format today as "yy-MM-dd"
    today = datetime.date.today().strftime('%y-%m-%d')
    msg = f"Exchange symbols update for {today}"
    try:
        subprocess.run(['git', 'add', filepath], check=True)
        subprocess.run(['git', 'commit', '-m', msg], check=True)
        subprocess.run(['git', 'push'], check=True)
        print(f"✅ Committed and pushed: {msg}")
    except subprocess.CalledProcessError as e:
        print("⚠️ Git command failed:", e)


# ─── MAIN ────────────────────────────────────────────────────────────────────────

def mainX():
    # fetch everything
    print("Fetching full crypto scan…", file=sys.stderr)
    entries = fetch_all_symbols()
    print(f"→ {len(entries)} total entries", file=sys.stderr)

    # group & filter
    print("Grouping USDT-perpetual symbols by exchange…", file=sys.stderr)
    grouped = group_usdt_perps(entries)

    # write output
    out_file = write_output(grouped)
    # date_tag = datetime.now().strftime("%y%m%d")
    # out_name = f"AssetsPerExchange_{date_tag}.json"
    # with open(out_name, "w", encoding="utf-8") as f:
    #     json.dump(grouped, f, ensure_ascii=False, indent=2)

    # Print a count of USDT-perpetual assets per exchange
    print("\nAsset counts per exchange:")
    for exch, syms in grouped.items():
        print(f"{exch}: {len(syms)} assets")

    print(f"Done! Wrote file: {out_name}", file=sys.stderr)

def main():
    print("\nLoading exchanges: ", file=sys.stderr)
    exchanges = load_exchanges()
    print(f"   ... will work with: {exchanges}")

    print("\nFetching symbols.", file=sys.stderr)
    assets = fetch_all_symbols()
    # print(f"\nSymbols fetched.", file=sys.stderr)

    print("\nGrouping USDT-perpetual symbols by exchange…", file=sys.stderr)
    grouped = group_usdt_perps(exchanges, assets)
    # print(f"   ... grouped symbols.  {grouped}")
    reportAssestPerExchange(grouped)


    print("\nSaving symbols per exchange ...", file=sys.stderr)
    out_file = write_output(grouped)
    print(f"   ... wrote symbols per exchange to {out_file} file", file=sys.stderr)

    copyFromSubdir(DAILY_UPDATE_DIR, out_file, DATELESS_FILE_NAME)
    
    # git_commit_and_push(DATELESS_FILE_NAME)

if __name__ == "__main__":
    main()
