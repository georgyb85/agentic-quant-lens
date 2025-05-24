
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TradingViewWidget from "@/components/TradingViewWidget";

const ChartView = () => {
  const [selectedTicker, setSelectedTicker] = useState("TSLA");
  const [selectedTimeframe, setSelectedTimeframe] = useState("1D");

  const tickers = ["TSLA", "AMZN", "GOOG", "BTC", "ETH"];
  const timeframes = ["1M", "5M", "15M", "1H", "4H", "1D"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-100 via-purple-100 to-slate-200 bg-clip-text text-transparent">
          Chart Analysis
        </h2>
        <div className="flex space-x-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Ticker</label>
            <Select value={selectedTicker} onValueChange={setSelectedTicker}>
              <SelectTrigger className="w-32 bg-slate-800/90 border-slate-600/50 text-slate-100 hover:bg-slate-700/90">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600/50">
                {tickers.map((ticker) => (
                  <SelectItem key={ticker} value={ticker} className="text-slate-100 hover:bg-slate-700 focus:bg-slate-700">
                    {ticker}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
        <TradingViewWidget ticker={selectedTicker} timeframe={selectedTimeframe} />
      </div>
    </div>
  );
};

export default ChartView;
