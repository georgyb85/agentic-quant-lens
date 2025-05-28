import { useEffect, useRef } from 'react';
import BaseChart, { ChartHandle, OHLCVData } from './BaseChart';
import { useBufferedSeries, Fetcher } from './useBufferedSeries';

/* plain fetch helper */
const fetchSlice: Fetcher = async (sym, from, to) => {
  const url = new URL('http://127.0.0.1/history');
  url.searchParams.set('symbol', sym);
  url.searchParams.set('from', String(from));
  url.searchParams.set('to',   String(to));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as OHLCVData[];
};

interface Props {
  symbol    : string;
  anchorTs  : number;
  barSeconds: number;          // reserved for future
}

const ChartWithBufferedData = ({ symbol, anchorTs }: Props) => {
  /* hooks first, stable order */
  const chartRef = useRef<ChartHandle | null>(null);
  const { bars, maybeLoadMore } = useBufferedSeries(symbol, anchorTs, fetchSlice);

  /* attach / detach watcher after the first slice arrives */
  useEffect(() => {
    if (!chartRef.current || !bars.length) return;

    const unsubscribe = chartRef.current.subscribeRange(() => {
      const r = chartRef.current?.getRange();
      if (r) maybeLoadMore(Math.floor(r.from), Math.ceil(r.to));
    });
    return unsubscribe;
  }, [bars, maybeLoadMore]);

  /* render */
  if (!bars.length) {
    return <div className="h-full flex items-center justify-center text-white">Loading
</div>;
  }

  return (
    <BaseChart
      ref={chartRef}
      data={bars}
      ticker={symbol}
    />
  );
};

export default ChartWithBufferedData;
