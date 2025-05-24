
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import CandlestickChart from "@/components/CandlestickChart";

const ChartView = () => {
  const [selectedTicker, setSelectedTicker] = useState("TSLA");
  const [selectedTimeframe, setSelectedTimeframe] = useState("1D");

  const tickers = ["TSLA", "AMZN", "GOOG", "BTC", "ETH"];
  const timeframes = ["1M", "5M", "15M", "1H", "4H", "1D"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Chart Analysis</h2>
        <div className="flex space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Ticker</label>
            <Select value={selectedTicker} onValueChange={setSelectedTicker}>
              <SelectTrigger className="w-32 bg-gray-800 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {tickers.map((ticker) => (
                  <SelectItem key={ticker} value={ticker} className="text-white hover:bg-gray-700">
                    {ticker}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Timeframe</label>
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-24 bg-gray-800 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {timeframes.map((timeframe) => (
                  <SelectItem key={timeframe} value={timeframe} className="text-white hover:bg-gray-700">
                    {timeframe}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Card className="bg-gray-800 border-gray-700 p-6">
        <CandlestickChart ticker={selectedTicker} timeframe={selectedTimeframe} />
      </Card>
    </div>
  );
};

export default ChartView;
