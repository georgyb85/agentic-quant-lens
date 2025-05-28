import { useCallback, useEffect, useRef, useState } from 'react';

export interface OHLCV {
  time: number; open: number; high: number; low: number; close: number; volume?: number;
}
export interface Range { from: number; to: number; bars: OHLCV[]; }

const CHUNK       = 1000;   // bars per HTTP slice
const BUFFER      = 300;    // bars kept each side of viewport
const DEBOUNCE_MS = 200;    // throttle for edge watcher

export type Fetcher = (sym: string, from: number, to: number) => Promise<OHLCV[]>;

/* =================================================================== */
export function useBufferedSeries(
  symbol : string,
  anchor : number,
  fetcher: Fetcher,
) {
  const [bars, setBars]     = useState<OHLCV[]>([]);
  const ranges              = useRef<Range[]>([]);
  const pending             = useRef<Record<string, Promise<void>>>({});
  const debounceFlag        = useRef<NodeJS.Timeout | null>(null);

  /* ---------- merge helper ---------- */
  const merge = (slice: OHLCV[]) => {
    if (!slice.length) return;
    const from = slice[0].time, to = slice[slice.length - 1].time;
    ranges.current.push({ from, to, bars: slice });
    ranges.current.sort((a, b) => a.from - b.from);

    const merged: Range[] = [];
    for (const r of ranges.current) {
      const last = merged[merged.length - 1];
      if (last && r.from <= last.to + 1) {
        last.to   = Math.max(last.to, r.to);
        last.bars = [...last.bars, ...r.bars];
      } else merged.push({ ...r });
    }
    ranges.current = merged;
    setBars(merged.flatMap(r => r.bars));
  };

  /* ---------- initial seed ---------- */
  useEffect(() => {
    (async () => {
      const half = CHUNK / 2;
      const slice = await fetcher(symbol, anchor - half, anchor + half);
      merge(slice);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol, anchor, fetcher]);   // run once per (symbol, anchor)

  /* ---------- main API ---------- */
  const maybeLoadMore = useCallback(async (viewFrom: number, viewTo: number) => {
    if (!ranges.current.length) return;                 // seed not done yet

    /* throttle watcher */
    if (debounceFlag.current) return;
    debounceFlag.current = setTimeout(() => { debounceFlag.current = null; }, DEBOUNCE_MS);

    const first = ranges.current[0];
    const last  = ranges.current[ranges.current.length - 1];
    const needLeft  = viewFrom - BUFFER < first.from;
    const needRight = viewTo   + BUFFER > last.to;
    if (!needLeft && !needRight) return;

    const dir  = needLeft ? 'older' : 'newer';
    const edge = needLeft ? first.from : last.to;
    const from = dir === 'older' ? edge - CHUNK : edge + 1;
    const to   = dir === 'older' ? edge - 1     : edge + CHUNK;
    const key  = `${from}-${to}`;
    if (pending.current[key]) return;                   // already in flight

    pending.current[key] = fetcher(symbol, from, to)
      .then(merge)
      .finally(() => { delete pending.current[key]; });
  }, [fetcher, symbol]);

  return { bars, maybeLoadMore };
}
