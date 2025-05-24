
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import TradingViewWidget from "@/components/TradingViewWidget";

const ChartView = () => {
  const [selectedTicker, setSelectedTicker] = useState("TSLA");
  const [selectedTimeframe, setSelectedTimeframe] = useState("1D");

  const tickers = ["TSLA", "AMZN", "GOOG", "BTC", "ETH"];
  const timeframes = ["1M", "5M", "15M", "1H", "4H", "1D"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-200">Chart Analysis</h2>
        <div className="flex space-x-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Ticker</label>
            <Select value={selectedTicker} onValueChange={setSelectedTicker}>
              <SelectTrigger className="w-32 bg-gradient-to-r from-slate-800 to-gray-800 border-slate-600/50 text-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gradient-to-b from-slate-800 to-gray-800 border-slate-600/50">
                {tickers.map((ticker) => (
                  <SelectItem key={ticker} value={ticker} className="text-slate-200 hover:bg-slate-700/50">
                    {ticker}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Timeframe</label>
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-24 bg-gradient-to-r from-slate-800 to-gray-800 border-slate-600/50 text-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gradient-to-b from-slate-800 to-gray-800 border-slate-600/50">
                {timeframes.map((timeframe) => (
                  <SelectItem key={timeframe} value={timeframe} className="text-slate-200 hover:bg-slate-700/50">
                    {timeframe}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-slate-800/50 to-gray-800/50 border-slate-700/50 backdrop-blur-sm p-6 h-[600px] shadow-xl">
        <TradingViewWidget ticker={selectedTicker} timeframe={selectedTimeframe} />
      </Card>
    </div>
  );
};

export default ChartView;
