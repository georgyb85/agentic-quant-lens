import { useMemo, useState } from 'react';
import LazyChart from '@/components/LazyChart';
import TickerSearch from './TickerSearch';

/** helper: converts timeframe string to seconds. Supported values: '1m', '15m', '1h', '4h', '1d'. */
function tfSec(tf: string): number {
  const unit = tf.slice(-1).toLowerCase();
  const value = parseInt(tf.slice(0, -1), 10);
  if (unit === 'm') return value * 60;
  if (unit === 'h') return value * 3600;
  if (unit === 'd') return value * 86400;
  return 86400;
}

/** anchor on 1-May-2025 00:00 UTC */
const ANCHOR = Math.floor(Date.UTC(2025, 4, 1) / 1000);

export default function ChartView() {
  const [symbol, setSymbol] = useState('TSLA');
  const [query, setQuery] = useState('');
  const [tf, setTf] = useState('1m');

  const barSec = useMemo(() => tfSec(tf), [tf]);

  const availableTickers = [
    'CVX','TSLA','NFLX','GS','V','MDT','F','NKE','T','QCOM','SCHW','MSFT','BMY','ORCL','UNH','NVDA','PFE','AVGO','MA','ADP','GE','KO','INTC','BX','C','PG','COST',
    'JNJ','CAT','WMT','MRK','XOM','CSCO','HON','GOOG','LLY','JPM','UPS','DIS','CRM','BAC','MCD','META','ABT','AAPL','IBM','DHR','HD','PEP',
  ];
  const timeframes = ['1m','15m','1h','4h','1d'];

  return (
    <div className="space-y-6">
      {/* Header + Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-50 via-purple-100 to-slate-100 bg-clip-text text-transparent">
          Chart Analysis
        </h2>

        <div className="flex flex-col sm:flex-row items-start gap-4 w-full sm:w-auto">
          {/* Ticker Selector */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">
              Ticker
            </label>
            <TickerSearch
              value={query}
              onChange={setQuery}
              onSelect={s => { setSymbol(s); setQuery(''); }}
              availableTickers={availableTickers}
              selectedTickers={[symbol]}
              placeholder="Search"
              className="w-full sm:w-32"
            />
            <div className="text-xs text-blue-400 mt-1">
              Selected: {symbol}
            </div>
          </div>

          {/* Timeframe Buttons */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">
              Timeframe
            </label>
            <div className="flex space-x-1">
              {timeframes.map(option => (
                <button
                  key={option}
                  onClick={() => setTf(option)}
                  className={`px-2 py-1 text-xs rounded ${tf === option ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-[600px] bg-slate-900/60 border border-slate-800/50 rounded-lg p-1">
        <LazyChart
          key={`chart-${symbol}-${tf}`}
          symbol={symbol}
          anchorTs={ANCHOR}
          barSec={barSec}
          timeframe={tf}
        />
      </div>
    </div>
  );
}
