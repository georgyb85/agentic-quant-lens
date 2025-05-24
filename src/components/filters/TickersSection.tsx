
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import TickerSearch from "../TickerSearch";

interface TickersSectionProps {
  selectedTickers: string[];
  tickerSearch: string;
  onRemoveTicker: (ticker: string) => void;
  onAddTicker: (ticker: string) => void;
  onTickerSearchChange: (value: string) => void;
  availableTickers: string[];
}

const getTickerDisplayName = (ticker: string) => {
  switch (ticker) {
    case "BTC": return "Bitcoin (BTC)";
    case "ETH": return "Ethereum (ETH)";
    case "TSLA": return "Tesla (TSLA)";
    case "AMZN": return "Amazon (AMZN)";
    case "GOOG": return "Google (GOOG)";
    default: return ticker;
  }
};

const TickersSection = ({
  selectedTickers,
  tickerSearch,
  onRemoveTicker,
  onAddTicker,
  onTickerSearchChange,
  availableTickers
}: TickersSectionProps) => {
  const handleTickerSearchChange = (value: string) => {
    onTickerSearchChange(value);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-slate-300">Tickers</h3>
      <div className="flex flex-wrap gap-2 min-h-[32px]">
        {selectedTickers.map((ticker) => (
          <Badge
            key={ticker}
            className="bg-blue-600 text-white hover:bg-blue-600 px-3 py-1 flex items-center gap-2"
          >
            <span>{getTickerDisplayName(ticker)}</span>
            <X 
              size={14} 
              className="cursor-pointer hover:text-red-300" 
              onClick={() => onRemoveTicker(ticker)}
            />
          </Badge>
        ))}
      </div>
      
      <div className="w-full max-w-md">
        <TickerSearch
          value={tickerSearch}
          onChange={handleTickerSearchChange}
          onSelect={onAddTicker}
          availableTickers={availableTickers}
          selectedTickers={selectedTickers}
        />
      </div>
    </div>
  );
};

export default TickersSection;
