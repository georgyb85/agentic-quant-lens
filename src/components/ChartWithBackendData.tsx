import { useCallback, useEffect, useRef, useState } from 'react';
import LightweightChartComponent, {
  OHLCVData,
  ChartHandle,
} from './LightweightChartComponent';

/* ───────── tunables ───────── */
const INITIAL_CHUNK = 4000;   // first load ≈ 3 days of 1-min bars
const CHUNK         = 1000;   // later incremental loads
const THRESHOLD     = 50;     // bars from edge that triggers load
const MAX_EMPTY_HOPS = 4;     // how many empty slices we skip in a row

interface Props {
  symbol     : string;
  anchorTs   : number; // centre the first window on this timestamp (unix s)
  barSeconds : number; // 60 for 1m, 300 for 5m, etc.
}

/* =================================================================== */
const ChartWithBackendData = ({ symbol, anchorTs, barSeconds }: Props) => {
  const [bars , setBars ] = useState<OHLCVData[]>([]);
  const [error, setError] = useState<string | null>(null);

  const earliest = useRef<number | null>(null);
  const latest   = useRef<number | null>(null);
  const loadOld  = useRef(false);
  const loadNew  = useRef(false);
  const cached   = useRef<Set<string>>(new Set());
  const chartRef = useRef<ChartHandle | null>(null);

  /* ---------- helpers ---------- */
  const key = (a: number, b: number) => `${a}-${b}`;

  const fetchSlice = useCallback(
    async (from: number, to: number): Promise<OHLCVData[]> => {
      const k = key(from, to);
      if (cached.current.has(k)) return [];
      const url = new URL('http://127.0.0.1/history');
      url.searchParams.set('symbol', symbol);
      url.searchParams.set('from' , String(from));
      url.searchParams.set('to'   , String(to));
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const rows: any[] = await res.json();
      cached.current.add(k);
      return rows.map(r => ({
        time  : r.time,
        open  : r.open,
        high  : r.high,
        low   : r.low,
        close : r.close,
        volume: r.volume,
      })).sort((a,b) => a.time - b.time);
    },
    [symbol]
  );

  /* ---------- initial load ---------- */
  useEffect(() => {
    let cancel = false;
    cached.current.clear();
    setBars([]); setError(null);
    earliest.current = null;
    latest.current   = null;

    const half = INITIAL_CHUNK * barSeconds / 2;
    const firstFrom = anchorTs - half;
    const firstTo   = anchorTs + half;

    (async () => {
      try {
        const slice = await fetchSlice(firstFrom, firstTo);
        if (cancel) return;
        if (!slice.length) throw new Error('DB has no rows for this symbol');
        setBars(slice);
        earliest.current = slice[0].time;
        latest.current   = slice[slice.length - 1].time;
      } catch (e:any) {
        if (!cancel) setError(e.message ?? String(e));
      }
    })();

    return () => { cancel = true; };
  }, [symbol, anchorTs, barSeconds, fetchSlice]);

  /* ---------- guarded loader ---------- */
  const loadMore = useCallback(
    async (older: boolean, edgeTs: number) => {
      const guard = older ? loadOld : loadNew;
      if (guard.current) return;
      if (earliest.current === null || latest.current === null) return;

      /* keep fetching past empty gaps until we hit real bars or limit */
      guard.current = true;
      try {
        let hops = 0;
        while (hops < MAX_EMPTY_HOPS) {
          const edge = older ? earliest.current! : latest.current!;
          const from = older
            ? edge - barSeconds * (CHUNK + 1)
            : edge + barSeconds;
          const to   = older
            ? edge - barSeconds
            : edge + barSeconds * CHUNK;

          const slice = await fetchSlice(from, to);
          if (!slice.length) {             // empty -> keep hopping
            hops += 1;
            oldestOrNewestShift(older, edge, barSeconds * CHUNK);
            continue;
          }

          if (older) {
            earliest.current = slice[0].time;
            chartRef.current?.keepViewport(slice.length);
            setBars(prev => [...slice, ...prev]);
          } else {
            latest.current   = slice[slice.length - 1].time;
            setBars(prev => [...prev, ...slice]);
          }
          break;                           // we added real data, stop
        }
      } catch (e:any) {
        setError(e.message ?? String(e));
      } finally {
        guard.current = false;
      }
    },
    [barSeconds, fetchSlice]
  );

  const oldestOrNewestShift = (older: boolean, edge: number, shift: number) => {
    if (older) earliest.current = edge - shift;
    else       latest.current   = edge + shift;
  };

  /* ---------- render ---------- */
  if (error)       return <div className="h-full flex items-center justify-center text-red-400">{error}</div>;
  if (!bars.length) return <div className="h-full flex items-center justify-center text-white">Loading
</div>;

  return (
    <LightweightChartComponent
      ref={chartRef}
      data={bars}
      ticker={symbol}
      onNeedMoreData={(dir, ts) => loadMore(dir === 'older', ts)}
    />
  );
};

export default ChartWithBackendData;
