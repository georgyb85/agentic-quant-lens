
import { useState, useEffect } from "react";
import { NewsItem } from "@/types/news";
import { generateMockNews } from "@/utils/mockNewsData";
import FilterPanel from "./FilterPanel";
import NewsCard from "./NewsCard";

const NewsView = () => {
  const [selectedTickers, setSelectedTickers] = useState<string[]>(["BTC", "ETH", "TSLA", "AMZN", "GOOG"]);
  const [dateFromFilter, setDateFromFilter] = useState("");
  const [dateToFilter, setDateToFilter] = useState("");
  const [keywordSearch, setKeywordSearch] = useState("");
  const [tickerSearch, setTickerSearch] = useState("");
  const [showTickerDropdown, setShowTickerDropdown] = useState(false);
  const [news, setNews] = useState<NewsItem[]>([]);

  const availableTickers = ["TSLA", "AMZN", "GOOG", "BTC", "ETH", "AAPL", "MSFT", "NVDA", "META", "NFLX"];

  useEffect(() => {
    setNews(generateMockNews());
  }, []);

  const filteredNews = news.filter(item => {
    const tickerMatch = selectedTickers.length === 0 || selectedTickers.includes(item.ticker);
    const dateFromMatch = !dateFromFilter || item.date >= dateFromFilter;
    const dateToMatch = !dateToFilter || item.date <= dateToFilter;
    const keywordMatch = !keywordSearch || 
      item.title.toLowerCase().includes(keywordSearch.toLowerCase()) ||
      item.summary.toLowerCase().includes(keywordSearch.toLowerCase());
    return tickerMatch && dateFromMatch && dateToMatch && keywordMatch;
  });

  const removeTicker = (tickerToRemove: string) => {
    setSelectedTickers(prev => prev.filter(ticker => ticker !== tickerToRemove));
  };

  const addTicker = (ticker: string) => {
    if (ticker && 
        availableTickers.includes(ticker) && 
        !selectedTickers.includes(ticker)) {
      setSelectedTickers(prev => [...prev, ticker]);
      setTickerSearch("");
      setShowTickerDropdown(false);
    }
  };

  const clearAllFilters = () => {
    setSelectedTickers([]);
    setDateFromFilter("");
    setDateToFilter("");
    setKeywordSearch("");
  };

  const filteredTickerSuggestions = availableTickers.filter(ticker => 
    ticker.toLowerCase().includes(tickerSearch.toLowerCase()) &&
    !selectedTickers.includes(ticker)
  );

  const handleTickerSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTickerSearch(value);
    setShowTickerDropdown(value.length > 0 && filteredTickerSuggestions.length > 0);
  };

  const handleTickerSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && filteredTickerSuggestions.length > 0) {
      addTicker(filteredTickerSuggestions[0]);
    }
  };

  const handleTickerSearchFocus = () => {
    if (tickerSearch.length > 0 && filteredTickerSuggestions.length > 0) {
      setShowTickerDropdown(true);
    }
  };

  return (
    <div className="space-y-6">
      <FilterPanel
        selectedTickers={selectedTickers}
        dateFromFilter={dateFromFilter}
        dateToFilter={dateToFilter}
        keywordSearch={keywordSearch}
        tickerSearch={tickerSearch}
        showTickerDropdown={showTickerDropdown}
        filteredTickerSuggestions={filteredTickerSuggestions}
        onRemoveTicker={removeTicker}
        onAddTicker={addTicker}
        onClearAllFilters={clearAllFilters}
        onDateFromChange={setDateFromFilter}
        onDateToChange={setDateToFilter}
        onKeywordSearchChange={setKeywordSearch}
        onTickerSearchChange={handleTickerSearchChange}
        onTickerSearchKeyPress={handleTickerSearchKeyPress}
        onTickerSearchFocus={handleTickerSearchFocus}
      />

      {/* News Content */}
      <div className="space-y-4">
        {filteredNews.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="text-center py-8">
          <p className="text-slate-400">No news found for the selected filters.</p>
        </div>
      )}
    </div>
  );
};

export default NewsView;
