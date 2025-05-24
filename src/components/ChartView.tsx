
import { useState } from "react";
import TradingViewWidget from "@/components/TradingViewWidget";
import TickerSearch from "./TickerSearch";

const ChartView = () => {
  const [selectedTicker, setSelectedTicker] = useState("TSLA");
  const [tickerSearch, setTickerSearch] = useState("");

  const tickers = ["TSLA", "AMZN", "GOOG", "BTC", "ETH", "AAPL", "MSFT", "NVDA", "META", "NFLX"];

  const handleTickerSelect = (ticker: string) => {
    setSelectedTicker(ticker);
    setTickerSearch("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-50 via-purple-100 to-slate-100 bg-clip-text text-transparent">
          Chart Analysis
        </h2>
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-1">Ticker</label>
          <TickerSearch
            value={tickerSearch}
            onChange={setTickerSearch}
            onSelect={handleTickerSelect}
            availableTickers={tickers}
            selectedTickers={selectedTicker ? [selectedTicker] : []}
            placeholder="Search ticker..."
            className="w-32"
          />
          {selectedTicker && (
            <div className="text-xs text-blue-400 mt-1">
              Selected: {selectedTicker}
            </div>
          )}
        </div>
      </div>

      <div className="h-[600px]">
        {selectedTicker ? (
          <TradingViewWidget ticker={selectedTicker} timeframe="1D" />
        ) : (
          <div className="h-full flex items-center justify-center bg-slate-900/60 border border-slate-800/50 rounded-lg">
            <p className="text-slate-300">Select a ticker to view the chart</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartView;
