// src/components/LazyChart.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
  ColorType,
  CrosshairMode,
  LineStyle,
  Time,
  ISeriesApi,
  CandlestickData,
  HistogramData,
  IChartApi,
  IRange,
} from 'lightweight-charts';

// Define our time range type with the required generic type argument.
type TimeRange = IRange<Time>;

/** ───────── your settings ───────── **/
const SLICE_BARS  = 1000;               // bars per HTTP request
const BUFFER_BARS = 200;                // bars of cushion before reloading
const MAX_HOPS    = 10;                 // skip up to 10 empty slices
//const API_URL     = 'http://localhost:8081/history';        // your backend

const API_URL     = 'https://agenticresearch.info/history';        // your backend

/** ───────── types ───────── **/
interface Bar {
  time   : number;
  open   : number;
  high   : number;
  low    : number;
  close  : number;
  volume?: number;
}

interface Props {
  symbol   : string;
  anchorTs : number;  // centre initial load here (unix seconds)
  barSec   : number;  // seconds per bar (60 for 1m, 300 for 5m, etc.)
  timeframe: string;  // timeframe string (1m, 15m, 1h, 4h, 1d)
}

/** ───────── fetch helper ───────── **/
async function getBars(symbol: string, from: number, to: number, timeframe: string): Promise<Bar[]> {
  const params = new URLSearchParams({
    symbol,
    from: String(from),
    to: String(to),
    timeframe
  });
  const res = await fetch(`${API_URL}?${params.toString()}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as Bar[];
}

export default function LazyChart({ symbol, anchorTs, barSec, timeframe }: Props) {
  const divRef    = useRef<HTMLDivElement>(null);
  const chartRef  = useRef<IChartApi>();
  const candleRef = useRef<ISeriesApi<'Candlestick', Time>>();
  const volRef    = useRef<ISeriesApi<'Histogram', Time>>();
  const earliest  = useRef<number>();
  const latest    = useRef<number>();
  const pending   = useRef<Set<string>>(new Set());

  // keep every loaded bar here
  const allBarsRef = useRef<Bar[]>([]);
  // hovered bar from crosshair
  const [hovered, setHovered] = useState<Bar | null>(null);

  // Moved updateViewport inside the component so it can use the refs.
  const updateViewport = () => {
    if (candleRef.current) {
      candleRef.current.setData(
        allBarsRef.current.map(bar => ({
          time: bar.time as Time,
          open: bar.open,
          high: bar.high,
          low: bar.low,
          close: bar.close,
        }))
      );
    }
    if (volRef.current) {
      volRef.current.setData(
        allBarsRef.current.map(bar => ({
          time: bar.time as Time,
          value: bar.volume ?? 0,
          color: bar.close >= bar.open ? "#26a69a80" : "#ef535080"
        }))
      );
    }
  };

  /** ─── mount chart ─── */
  useEffect(() => {
    const el = divRef.current!;
    const chart = createChart(el, {
      width : el.clientWidth,
      height: el.clientHeight,
      layout: {
        background:{ type:ColorType.Solid, color:'#131722' },
        textColor :'rgba(255,255,255,0.9)',
      },
      grid: {
        vertLines:{ color:'rgba(255,255,255,0.1)', style:LineStyle.Solid },
        horzLines:{ color:'rgba(255,255,255,0.1)', style:LineStyle.Solid },
      },
      crosshair      : { mode:CrosshairMode.Normal },
      rightPriceScale: { borderColor:'rgba(255,255,255,0.2)' },
      timeScale      : {
        borderColor          :'rgba(255,255,255,0.2)',
        rightBarStaysOnScroll: false,
        timeVisible          : true,
        secondsVisible       : false,
      },
    });
    chartRef.current = chart;
    chart.timeScale().applyOptions({
      tickMarkFormatter: (time) => {
        const rounded = Math.round(time / barSec) * barSec;
        const date = new Date(rounded * 1000);
        
        // Format based on timeframe for better readability
        if (barSec >= 86400) { // 1 day or more
          return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        } else if (barSec >= 14400) { // 4 hours or more
          return date.toLocaleString([], {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        } else if (barSec >= 3600) { // 1 hour
          return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });
        } else if (barSec >= 900) { // 15 minutes
          return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });
        } else { // 1 minute or less
          return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });
        }
      }
    } as any);

    candleRef.current = chart.addSeries(CandlestickSeries, {
      upColor:'#26a69a', downColor:'#ef5350',
      borderUpColor:'#26a69a', borderDownColor:'#ef5350',
      wickUpColor:'#26a69a', wickDownColor:'#ef5350',
    });
    volRef.current = chart.addSeries(HistogramSeries, {
      priceFormat:{type:'volume'}, priceScaleId:'vol',
    });
    volRef.current.priceScale().applyOptions({
      scaleMargins:{ top:0.8, bottom:0 }, visible:false,
    });

    // subscribe crosshair
    chart.subscribeCrosshairMove(param => {
      if (param.time !== undefined) {
        const t = param.time as Time;
        const found = allBarsRef.current.find(b => b.time === t) || null;
        setHovered(found);
      } else {
        setHovered(null);
      }
    });

    const ro = new ResizeObserver(() =>
      chart.resize(el.clientWidth, el.clientHeight)
    );
    ro.observe(el);
    return () => { ro.disconnect(); chart.remove(); };
  }, []);

  /** ─── initial load ±SLICE_BARS bars ─── */
  useEffect(() => {
    // ── SYMBOL CHANGE: clear all previous data ──
    candleRef.current?.setData([]);
    volRef.current?.setData([]);
    allBarsRef.current = [];
    earliest.current = undefined;
    latest.current   = undefined;
    pending.current.clear();

    let cancel = false;
    (async () => {
      const dur = SLICE_BARS * barSec;
      const from = anchorTs - dur;
      const to   = anchorTs + dur;
      const slice = await getBars(symbol, from, to, timeframe);
      if (cancel || !slice.length) return;
      allBarsRef.current = slice;
      earliest.current = slice[0].time;
      latest.current = slice[slice.length-1].time;
      updateViewport();
      chartRef.current?.timeScale().fitContent();
      candleRef.current!.priceScale().applyOptions({
        autoScale: true,
      });
    })();
    return () => { cancel = true; };
  }, [symbol, anchorTs, barSec, timeframe]);

  useEffect(() => {
    if (chartRef.current) {
      const newOptions = {
        tickMarkFormatter: (time: any) => {
          const rounded = Math.round(time / barSec) * barSec;
          const date = new Date(rounded * 1000);
          
          // Format based on timeframe for better readability
          if (barSec >= 86400) { // 1 day or more
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
          } else if (barSec >= 14400) { // 4 hours or more
            return date.toLocaleString([], {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });
          } else if (barSec >= 3600) { // 1 hour
            return date.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            });
          } else if (barSec >= 900) { // 15 minutes
            return date.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            });
          } else { // 1 minute or less
            return date.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            });
          }
        }
      };
      (chartRef.current.timeScale() as any).applyOptions(newOptions);
    }
  }, [barSec]);

  /** ─── watch time‐range and lazy‐load ─── */
  useEffect(() => {
    const chart = chartRef.current; if (!chart) return;
    const ts = chart.timeScale();

    const handler = (range: TimeRange | null) => {
      if (!range || earliest.current === undefined || latest.current === undefined) return;
      if (pending.current.size > 0) return;
      const pad = BUFFER_BARS * barSec;
      if (Number(range.from) < earliest.current + pad) loadSide('left');
      if (Number(range.to) > latest.current - pad) loadSide('right');
    };

    ts.subscribeVisibleTimeRangeChange(handler);
    return () => ts.unsubscribeVisibleTimeRangeChange(handler);
  }, [symbol, barSec, timeframe]);

  /** ─── fetch & merge one side ─── */
  const loadSide = async (side: 'left'|'right') => {
    let hops = 0;
    while (hops < MAX_HOPS) {
      const edge = side === 'left' ? earliest.current! : latest.current!;
      const from = side === 'left'
        ? edge - SLICE_BARS * barSec
        : edge + barSec;
      const to   = side === 'left'
        ? edge - barSec
        : edge + SLICE_BARS * barSec;
      const key = `${from}-${to}`;
      if (pending.current.has(key)) return;
      pending.current.add(key);

      try {
        const slice = await getBars(symbol, from, to, timeframe);
        if (slice.length) {
          // merge into allBarsRef
          if (side === 'left') {
            allBarsRef.current = [...slice, ...allBarsRef.current];
          } else {
            allBarsRef.current = [...allBarsRef.current, ...slice];
          }
          renderSlice(slice, side);
          if (side === 'left') earliest.current = slice[0].time;
          else                latest.current   = slice[slice.length-1].time;
          return;
        }
        if (side === 'left') earliest.current = from;
        else               latest.current   = to;
        hops++;
      } finally {
        pending.current.delete(key);
      }
    }
  };

  /** ─── draw into the chart (preserving view) ─── */
  const renderSlice = (bars: Bar[], where: 'init'|'left'|'right') => {
    const ts = chartRef.current!.timeScale();
    const prev = ts.getVisibleRange();
    updateViewport();
    if (prev) ts.setVisibleRange(prev);
  };

  return (
    <div className="relative h-full w-full">
      {hovered && (
        <div className="absolute top-2 left-2 z-20 bg-black bg-opacity-70 text-white text-xs p-2 rounded">
          <div><strong>{new Date(hovered.time * 1000).toLocaleString()}</strong></div>
          <div>O: {hovered.open}</div>
          <div>H: {hovered.high}</div>
          <div>L: {hovered.low}</div>
          <div>C: {hovered.close}</div>
          <div>V: {hovered.volume ?? 0}</div>
        </div>
      )}
      <div ref={divRef} className="h-full w-full" />
    </div>
  );
}
