
import { Button } from "@/components/ui/button";
import TickersSection from "./filters/TickersSection";
import DateRangeSection from "./filters/DateRangeSection";
import KeywordSearchSection from "./filters/KeywordSearchSection";

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

  return (
    <div className="bg-slate-900/70 backdrop-blur-sm border border-slate-800/60 rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-50">News Filters</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={onClearAllFilters}
          className="border-red-600/50 text-red-400 hover:bg-red-900/20 bg-transparent hover:text-red-300"
        >
          Clear All Filters
        </Button>
      </div>

      <TickersSection
        selectedTickers={selectedTickers}
        tickerSearch={tickerSearch}
        onRemoveTicker={onRemoveTicker}
        onAddTicker={onAddTicker}
        onTickerSearchChange={handleTickerSearchChange}
        availableTickers={availableTickers}
      />

      <DateRangeSection
        dateFromFilter={dateFromFilter}
        dateToFilter={dateToFilter}
        onDateFromChange={onDateFromChange}
        onDateToChange={onDateToChange}
      />

      <KeywordSearchSection
        keywordSearch={keywordSearch}
        onKeywordSearchChange={onKeywordSearchChange}
      />
    </div>
  );
};

export default FilterPanel;
