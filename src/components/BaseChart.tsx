
import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
  ColorType,
  CrosshairMode,
  LineStyle,
  UTCTimestamp,
  IChartApi,
  ISeriesApi,
  CandlestickData,
  HistogramData,
  Time,
} from 'lightweight-charts';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';

/* ───────── types ───────── */
export interface OHLCVData {
  time: number;
  open: number;
  high: number;
  low : number;
  close: number;
  volume?: number;
}

export interface ChartHandle {
  /** Keep the viewport still after we prepend N bars */
  keepViewport(n: number): void;
  /** Subscribe to logical-range changes; returns an unsubscribe fn */
  subscribeRange(cb: () => void): () => void;
  /** Get current logical range (or null before first render) */
  getRange(): { from: number; to: number } | null;
}

interface Props {
  data : OHLCVData[];
  ticker: string;
}

/* =================================================================== */
const BaseChart = forwardRef<ChartHandle, Props>(
  ({ data, ticker }, ref) => {
    /* ---------- refs ---------- */
    const containerRef = useRef<HTMLDivElement>(null);
    const chartRef     = useRef<IChartApi | null>(null);
    const candleRef    = useRef<ISeriesApi<'Candlestick', Time> | null>(null);
    const volumeRef    = useRef<ISeriesApi<'Histogram', Time> | null>(null);
    const lastPrepend  = useRef(0);
    const dataRef      = useRef<OHLCVData[]>(data);

    /* ---------- expose API to parent ---------- */
    useImperativeHandle(ref, () => ({
      keepViewport(n) { lastPrepend.current = n; },
      subscribeRange(cb) {
        if (!chartRef.current) return () => {};
        chartRef.current.timeScale().subscribeVisibleLogicalRangeChange(cb);
        return () => chartRef.current?.timeScale().unsubscribeVisibleLogicalRangeChange(cb);
      },
      getRange() {
        return chartRef.current?.timeScale().getVisibleLogicalRange() ?? null;
      },
    }));

    /* ---------- initialise once ---------- */
    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;

      if (!chartRef.current) {
        chartRef.current = createChart(el, {
          width : el.clientWidth,
          height: el.clientHeight,
          layout: {
            background:{ type: ColorType.Solid, color: '#131722' },
            textColor :'rgba(255,255,255,0.9)',
          },
          grid: {
            vertLines:{ color:'rgba(197,203,206,0.2)', style: LineStyle.Solid },
            horzLines:{ color:'rgba(197,203,206,0.2)', style: LineStyle.Solid },
          },
          crosshair      : { mode: CrosshairMode.Normal },
          rightPriceScale: { borderColor:'rgba(197,203,206,0.8)' },
          timeScale      : {
            borderColor:'rgba(197,203,206,0.8)',
            timeVisible:true,
            secondsVisible:false,
            rightBarStaysOnScroll:true,
          },
        });

        /* ----- series (v5 API) ----- */
        candleRef.current = chartRef.current.addCandlestickSeries({
          upColor:'#26a69a', downColor:'#ef5350',
          borderUpColor:'#26a69a', borderDownColor:'#ef5350',
          wickUpColor:'#26a69a', wickDownColor:'#ef5350',
        });
        candleRef.current.priceScale().applyOptions({
          scaleMargins:{ top:0, bottom:0.25 },
        });

        volumeRef.current = chartRef.current.addHistogramSeries({
          color:'#26a69a80',
          priceFormat:{ type:'volume' },
          priceScaleId:'vol',
        });
        volumeRef.current.priceScale().applyOptions({
          scaleMargins:{ top:0.75, bottom:0 },
          visible:false,
        });

        /* ----- resize observer ----- */
        const ro = new ResizeObserver(() => {
          chartRef.current?.resize(el.clientWidth, el.clientHeight);
        });
        ro.observe(el);

        return () => {
          ro.disconnect();
          chartRef.current?.remove();
          chartRef.current = null;
          candleRef.current = null;
          volumeRef.current = null;
        };
      }
    }, []);

    /* ---------- update data ---------- */
    useEffect(() => {
      dataRef.current = data;               // keep for parent watchers
      if (!candleRef.current || !volumeRef.current || !data.length) return;

      /* candles */
      candleRef.current.setData(
        data.map(d => ({
          time : d.time as Time,
          open : d.open,
          high : d.high,
          low  : d.low,
          close: d.close,
        }))
      );

      /* volume */
      volumeRef.current.setData(
        data.map(d => ({
          time : d.time as Time,
          value: d.volume ?? 0,
          color: d.close >= d.open
            ? 'rgba(38,166,154,0.6)'
            : 'rgba(239,83,80,0.6)',
        }))
      );

      /* keep viewport still if we prepended bars */
      if (lastPrepend.current && chartRef.current) {
        const ts = chartRef.current.timeScale();
        const r  = ts.getVisibleLogicalRange();
        if (r) {
          ts.setVisibleLogicalRange({
            from: r.from + lastPrepend.current,
            to  : r.to   + lastPrepend.current,
          });
        }
        lastPrepend.current = 0;
      }
    }, [data, ticker]);

    return <div ref={containerRef} className="h-full w-full" />;
  }
);

export default BaseChart;
