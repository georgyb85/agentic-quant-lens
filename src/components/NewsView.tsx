
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExternalLink, X } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  ticker: string;
  date: string;
  link: string;
}

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
    // Generate mock news data
    const mockNews: NewsItem[] = [
      {
        id: "1",
        title: "Tesla Reports Strong Q4 Earnings Beat",
        summary: "Tesla exceeded analyst expectations with strong quarterly results driven by increased vehicle deliveries and margin improvements.",
        sentiment: "positive",
        ticker: "TSLA",
        date: "2025-05-24",
        link: "https://example.com/tesla-earnings"
      },
      {
        id: "2",
        title: "Amazon Web Services Faces Increased Competition",
        summary: "AWS market share under pressure as competitors Microsoft Azure and Google Cloud gain ground in enterprise cloud services.",
        sentiment: "negative",
        ticker: "AMZN",
        date: "2025-05-23",
        link: "https://example.com/aws-competition"
      },
      {
        id: "3",
        title: "Google's AI Breakthrough in Quantum Computing",
        summary: "Alphabet announces significant advancement in quantum computing technology, potentially revolutionizing AI capabilities.",
        sentiment: "positive",
        ticker: "GOOG",
        date: "2025-05-22",
        link: "https://example.com/google-quantum"
      },
      {
        id: "4",
        title: "Bitcoin ETF Approval Drives Institutional Adoption",
        summary: "SEC approval of spot Bitcoin ETFs leads to increased institutional investment and price stability in cryptocurrency markets.",
        sentiment: "positive",
        ticker: "BTC",
        date: "2025-05-21",
        link: "https://example.com/bitcoin-etf"
      },
      {
        id: "5",
        title: "Ethereum Network Upgrade Improves Scalability",
        summary: "Latest Ethereum upgrade reduces transaction costs and improves network throughput, addressing long-standing scalability concerns.",
        sentiment: "positive",
        ticker: "ETH",
        date: "2025-05-20",
        link: "https://example.com/ethereum-upgrade"
      }
    ];

    setNews(mockNews);
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

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-600/90 text-green-100';
      case 'negative': return 'bg-red-600/90 text-red-100';
      default: return 'bg-slate-600/90 text-slate-100';
    }
  };

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

  return (
    <div className="space-y-6">
      {/* Filters Panel */}
      <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-100">News Filters</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="border-red-700/50 text-red-400 hover:bg-red-700/10 bg-transparent"
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
                className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-1 flex items-center gap-2"
              >
                <span>{ticker === "BTC" ? "Bitcoin (BTC)" : 
                       ticker === "ETH" ? "Ethereum (ETH)" :
                       ticker === "TSLA" ? "Tesla (TSLA)" :
                       ticker === "AMZN" ? "Amazon (AMZN)" :
                       ticker === "GOOG" ? "Google (GOOG)" :
                       ticker}</span>
                <X 
                  size={14} 
                  className="cursor-pointer hover:text-red-300" 
                  onClick={() => removeTicker(ticker)}
                />
              </Badge>
            ))}
          </div>
          
          {/* Add Ticker Search with Dropdown */}
          <div className="relative mt-3">
            <Input
              placeholder="Search ticker to add..."
              value={tickerSearch}
              onChange={handleTickerSearchChange}
              onKeyPress={handleTickerSearchKeyPress}
              onFocus={() => {
                if (tickerSearch.length > 0 && filteredTickerSuggestions.length > 0) {
                  setShowTickerDropdown(true);
                }
              }}
              className="w-48 bg-slate-700/50 border-slate-600/50 text-slate-100 placeholder:text-slate-400"
            />
            
            {/* Dropdown Menu */}
            {showTickerDropdown && filteredTickerSuggestions.length > 0 && (
              <div className="absolute top-full left-0 w-48 mt-1 bg-slate-800 border border-slate-600/50 rounded-md shadow-lg z-50">
                {filteredTickerSuggestions.map((ticker) => (
                  <div
                    key={ticker}
                    className="px-3 py-2 text-slate-100 hover:bg-slate-700 cursor-pointer text-sm"
                    onMouseDown={() => addTicker(ticker)}
                  >
                    {ticker}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Date Range Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-300">Date Range</h3>
          <div className="flex gap-4 items-center">
            <div className="space-y-1">
              <label className="text-sm text-slate-400">From:</label>
              <Input
                type="date"
                value={dateFromFilter}
                onChange={(e) => setDateFromFilter(e.target.value)}
                className="w-40 bg-slate-700/50 border-slate-600/50 text-slate-100"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-slate-400">To:</label>
              <Input
                type="date"
                value={dateToFilter}
                onChange={(e) => setDateToFilter(e.target.value)}
                className="w-40 bg-slate-700/50 border-slate-600/50 text-slate-100"
              />
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-300">Search</h3>
          <Input
            placeholder="Search by keyword..."
            value={keywordSearch}
            onChange={(e) => setKeywordSearch(e.target.value)}
            className="w-full bg-slate-700/50 border-slate-600/50 text-slate-100 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* News Content */}
      <div className="space-y-4">
        {filteredNews.map((item) => (
          <Card key={item.id} className="bg-slate-800/70 border-slate-700/50 p-6 hover:bg-slate-800/90 transition-colors backdrop-blur-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <Badge variant="outline" className="border-purple-500/50 text-purple-300 bg-purple-500/10">
                    {item.ticker}
                  </Badge>
                  <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getSentimentColor(item.sentiment)}`}>
                    {item.sentiment}
                  </div>
                  <span className="text-sm text-slate-400">{item.date}</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-100 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-300 leading-relaxed mb-3">{item.summary}</p>
                <a 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-purple-300 hover:text-purple-200 transition-colors text-sm"
                >
                  <span>Read full article</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </Card>
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
