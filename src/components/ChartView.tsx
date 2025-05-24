
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import TradingViewWidget from "@/components/TradingViewWidget";
import TickerSearch from "./TickerSearch";

const ChartView = () => {
  const [selectedTicker, setSelectedTicker] = useState("TSLA");
  const [selectedTimeframe, setSelectedTimeframe] = useState("1D");
  const [tickerSearch, setTickerSearch] = useState("");

  const tickers = ["TSLA", "AMZN", "GOOG", "BTC", "ETH", "AAPL", "MSFT", "NVDA", "META", "NFLX"];
  const timeframes = ["1M", "5M", "15M", "1H", "4H", "1D"];

  const handleTickerSelect = (ticker: string) => {
    setSelectedTicker(ticker);
    setTickerSearch("");
  };

  const clearTickerSelection = () => {
    setSelectedTicker("");
    setTickerSearch("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-100 via-purple-100 to-slate-200 bg-clip-text text-transparent">
          Chart Analysis
        </h2>
        <div className="flex space-x-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Ticker</label>
            <div className="flex items-center gap-2">
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearTickerSelection}
                  className="text-xs px-2 py-1 h-8"
                >
                  Clear
                </Button>
              )}
            </div>
            {selectedTicker && (
              <div className="text-xs text-blue-400 mt-1">
                Selected: {selectedTicker}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Timeframe</label>
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-24 bg-slate-800/90 border-slate-600/50 text-slate-100 hover:bg-slate-700/90">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600/50">
                {timeframes.map((timeframe) => (
                  <SelectItem key={timeframe} value={timeframe} className="text-slate-100 hover:bg-slate-700 focus:bg-slate-700">
                    {timeframe}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="h-[600px]">
        {selectedTicker ? (
          <TradingViewWidget ticker={selectedTicker} timeframe={selectedTimeframe} />
        ) : (
          <div className="h-full flex items-center justify-center bg-slate-800/40 border border-slate-600/30 rounded-lg">
            <p className="text-slate-400">Select a ticker to view the chart</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartView;
