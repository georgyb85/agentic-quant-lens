
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { X, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import TickerSearch from "./TickerSearch";

interface FilterPanelProps {
  selectedTickers: string[];
  dateFromFilter: string;
  dateToFilter: string;
  keywordSearch: string;
  tickerSearch: string;
  showTickerDropdown: boolean;
  filteredTickerSuggestions: string[];
  onRemoveTicker: (ticker: string) => void;
  onAddTicker: (ticker: string) => void;
  onClearAllFilters: () => void;
  onDateFromChange: (date: string) => void;
  onDateToChange: (date: string) => void;
  onKeywordSearchChange: (keyword: string) => void;
  onTickerSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTickerSearchKeyPress: (e: React.KeyboardEvent) => void;
  onTickerSearchFocus: () => void;
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

const FilterPanel = ({
  selectedTickers,
  dateFromFilter,
  dateToFilter,
  keywordSearch,
  tickerSearch,
  onRemoveTicker,
  onAddTicker,
  onClearAllFilters,
  onDateFromChange,
  onDateToChange,
  onKeywordSearchChange,
  onTickerSearchChange
}: FilterPanelProps) => {
  const availableTickers = ["TSLA", "AMZN", "GOOG", "BTC", "ETH", "AAPL", "MSFT", "NVDA", "META", "NFLX"];

  const handleTickerSearchChange = (value: string) => {
    const syntheticEvent = {
      target: { value }
    } as React.ChangeEvent<HTMLInputElement>;
    onTickerSearchChange(syntheticEvent);
  };

  const dateFromDate = dateFromFilter ? new Date(dateFromFilter) : undefined;
  const dateToDate = dateToFilter ? new Date(dateToFilter) : undefined;

  const handleDateFromSelect = (date: Date | undefined) => {
    if (date) {
      onDateFromChange(format(date, "yyyy-MM-dd"));
    } else {
      onDateFromChange("");
    }
  };

  const handleDateToSelect = (date: Date | undefined) => {
    if (date) {
      onDateToChange(format(date, "yyyy-MM-dd"));
    } else {
      onDateToChange("");
    }
  };

  return (
    <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-100">News Filters</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={onClearAllFilters}
          className="border-red-600/50 text-red-400 hover:bg-red-900/20 bg-transparent hover:text-red-300"
        >
          Clear All Filters
        </Button>
      </div>

      {/* Tickers Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-slate-300">Tickers</h3>
        <div className="flex flex-wrap gap-2">
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
        
        {/* Add Ticker Search with Dropdown */}
        <div className="mt-3">
          <TickerSearch
            value={tickerSearch}
            onChange={handleTickerSearchChange}
            onSelect={onAddTicker}
            availableTickers={availableTickers}
            selectedTickers={selectedTickers}
          />
        </div>
      </div>

      {/* Date Range Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-slate-300">Date Range</h3>
        <div className="flex gap-4 items-center">
          <div className="space-y-1">
            <label className="text-sm text-slate-400">From:</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-40 justify-start text-left font-normal bg-slate-700/50 border-slate-600/50 text-slate-100 hover:bg-slate-600/50",
                    !dateFromDate && "text-slate-400"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                  {dateFromDate ? format(dateFromDate, "MM/dd/yyyy") : <span className="text-slate-400">mm/dd/yyyy</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateFromDate}
                  onSelect={handleDateFromSelect}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-1">
            <label className="text-sm text-slate-400">To:</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-40 justify-start text-left font-normal bg-slate-700/50 border-slate-600/50 text-slate-100 hover:bg-slate-600/50",
                    !dateToDate && "text-slate-400"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                  {dateToDate ? format(dateToDate, "MM/dd/yyyy") : <span className="text-slate-400">mm/dd/yyyy</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateToDate}
                  onSelect={handleDateToSelect}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-slate-300">Search</h3>
        <Input
          placeholder="Search by keyword..."
          value={keywordSearch}
          onChange={(e) => onKeywordSearchChange(e.target.value)}
          className="w-full bg-slate-700/50 border-slate-600/50 text-slate-100 placeholder:text-slate-400"
        />
      </div>
    </div>
  );
};

export default FilterPanel;
