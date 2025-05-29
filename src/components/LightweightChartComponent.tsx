
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
  time  : number;            // unix seconds
  open  : number;
  high  : number;
  low   : number;
  close : number;
  volume?: number;
}
export interface ChartHandle { keepViewport(n: number): void; }
interface Props {
  data          : OHLCVData[];
  ticker        : string;
  onNeedMoreData: (dir: 'older' | 'newer', edgeTs: number) => void;
}

/* =================================================================== */
const LightweightChartComponent = forwardRef<ChartHandle, Props>(
  ({ data, ticker, onNeedMoreData }, ref) => {
    /* ----- refs ----- */
    const containerRef = useRef<HTMLDivElement>(null);
    const chartRef     = useRef<IChartApi | null>(null);
    const candleRef    = useRef<ISeriesApi<'Candlestick', Time> | null>(null);
    const volumeRef    = useRef<ISeriesApi<'Histogram', Time> | null>(null);

    const dataRef      = useRef<OHLCVData[]>(data);
    const lastPrepend  = useRef(0);

    useImperativeHandle(ref, () => ({
      keepViewport(n: number) { lastPrepend.current = n; },
    }));

    /* ───────── initialise chart once ───────── */
    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;

      let unsub: (() => void) | undefined;
      let ro  : ResizeObserver | undefined;

      const init = () => {
        if (chartRef.current) return;

        chartRef.current = createChart(el, {
          width  : el.clientWidth,
          height : el.clientHeight,
          layout : {
            background:{ type:ColorType.Solid, color:'#131722' },
            textColor :'rgba(255,255,255,0.9)',
          },
          grid:{
            vertLines:{ color:'rgba(197,203,206,0.2)', style:LineStyle.Solid },
            horzLines:{ color:'rgba(197,203,206,0.2)', style:LineStyle.Solid },
          },
          crosshair      : { mode:CrosshairMode.Normal },
          rightPriceScale: { borderColor:'rgba(197,203,206,0.8)' },
          timeScale      : {
            borderColor          :'rgba(197,203,206,0.8)',
            timeVisible          : true,
            secondsVisible       : false,
            rightBarStaysOnScroll: true,
            fixRightEdge         : false,
          },
        });

        candleRef.current = chartRef.current.addCandlestickSeries({
          upColor        : '#26a69a',
          downColor      : '#ef5350',
          borderUpColor  : '#26a69a',
          borderDownColor: '#ef5350',
          wickUpColor    : '#26a69a',
          wickDownColor  : '#ef5350',
        });
        candleRef.current.priceScale().applyOptions({
          scaleMargins:{ top:0, bottom:0.25 },
        });

        volumeRef.current = chartRef.current.addHistogramSeries({
          color       : '#26a69a80',
          priceFormat : { type:'volume' },
          priceScaleId: 'vol',
        });
        volumeRef.current.priceScale().applyOptions({
          scaleMargins:{ top:0.75, bottom:0 },
          visible:false,
        });

        /* edge watcher */
        const watch = () => {
          const range  = chartRef.current!.timeScale().getVisibleLogicalRange();
          const len    = dataRef.current.length;
          if (!range || !len) return;

          const leftGap  = range.from;
          const rightGap = len - range.to!;
          if (leftGap  < 20) onNeedMoreData('older', dataRef.current[0].time);
          if (rightGap < 20) onNeedMoreData('newer', dataRef.current[len - 1].time);
        };
        chartRef.current.timeScale().subscribeVisibleLogicalRangeChange(watch);
        unsub = () => chartRef.current?.timeScale().unsubscribeVisibleLogicalRangeChange(watch);

        /* resize observer */
        ro = new ResizeObserver(() => {
          if (chartRef.current)
            chartRef.current.resize(el.clientWidth, el.clientHeight);
        });
        ro.observe(el);
      };

      init();

      /* cleanup */
      return () => {
        unsub?.();
        ro?.disconnect();
        chartRef.current?.remove();
        /* clear refs so later effects don't call disposed objects */
        chartRef.current = null;
        candleRef.current = null;
        volumeRef.current = null;
      };
    }, [onNeedMoreData]);

    /* ───────── update series when data changes ───────── */
    useEffect(() => {
      dataRef.current = data;                 // for watcher

      if (!candleRef.current || !volumeRef.current || !data.length) return;

      candleRef.current.setData(
        data.map(d => ({
          time : d.time as Time,
          open : d.open,
          high : d.high,
          low  : d.low,
          close: d.close,
        }))
      );

      volumeRef.current.setData(
        data.map(d => ({
          time : d.time as Time,
          value: d.volume ?? 0,
          color: d.close >= d.open
            ? 'rgba(38,166,154,0.6)'
            : 'rgba(239,83,80,0.6)',
        }))
      );

      /* keep viewport after prepend */
      if (lastPrepend.current && chartRef.current) {
        const ts = chartRef.current.timeScale();
        const r  = ts.getVisibleLogicalRange();
        if (r)
          ts.setVisibleLogicalRange({
            from: r.from + lastPrepend.current,
            to  : r.to   + lastPrepend.current,
          });
        lastPrepend.current = 0;
      }
    }, [data, ticker]);

    return <div ref={containerRef} className="h-full w-full" />;
  }
);

export default LightweightChartComponent;
