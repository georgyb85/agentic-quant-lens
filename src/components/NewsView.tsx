
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";

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
  const [selectedTicker, setSelectedTicker] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [news, setNews] = useState<NewsItem[]>([]);

  const tickers = ["all", "TSLA", "AMZN", "GOOG", "BTC", "ETH"];

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
        link: "#"
      },
      {
        id: "2",
        title: "Amazon Web Services Faces Increased Competition",
        summary: "AWS market share under pressure as competitors Microsoft Azure and Google Cloud gain ground in enterprise cloud services.",
        sentiment: "negative",
        ticker: "AMZN",
        date: "2025-05-23",
        link: "#"
      },
      {
        id: "3",
        title: "Google's AI Breakthrough in Quantum Computing",
        summary: "Alphabet announces significant advancement in quantum computing technology, potentially revolutionizing AI capabilities.",
        sentiment: "positive",
        ticker: "GOOG",
        date: "2025-05-22",
        link: "#"
      },
      {
        id: "4",
        title: "Bitcoin ETF Approval Drives Institutional Adoption",
        summary: "SEC approval of spot Bitcoin ETFs leads to increased institutional investment and price stability in cryptocurrency markets.",
        sentiment: "positive",
        ticker: "BTC",
        date: "2025-05-21",
        link: "#"
      },
      {
        id: "5",
        title: "Ethereum Network Upgrade Improves Scalability",
        summary: "Latest Ethereum upgrade reduces transaction costs and improves network throughput, addressing long-standing scalability concerns.",
        sentiment: "positive",
        ticker: "ETH",
        date: "2025-05-20",
        link: "#"
      }
    ];

    setNews(mockNews);
  }, []);

  const filteredNews = news.filter(item => {
    const tickerMatch = selectedTicker === "all" || item.ticker === selectedTicker;
    const dateMatch = !dateFilter || item.date === dateFilter;
    return tickerMatch && dateMatch;
  });

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-600';
      case 'negative': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Market News</h2>
        <div className="flex space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Filter by Ticker</label>
            <Select value={selectedTicker} onValueChange={setSelectedTicker}>
              <SelectTrigger className="w-32 bg-gray-800 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {tickers.map((ticker) => (
                  <SelectItem key={ticker} value={ticker} className="text-white hover:bg-gray-700">
                    {ticker.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Filter by Date</label>
            <div className="relative">
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-40 bg-gray-800 border-gray-600 text-white"
              />
              <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredNews.map((item) => (
          <Card key={item.id} className="bg-gray-800 border-gray-700 p-6 hover:bg-gray-750 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <Badge variant="outline" className="border-green-600 text-green-400">
                    {item.ticker}
                  </Badge>
                  <Badge className={getSentimentColor(item.sentiment)}>
                    {item.sentiment}
                  </Badge>
                  <span className="text-sm text-gray-400">{item.date}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  <a href={item.link} className="hover:text-green-400 transition-colors">
                    {item.title}
                  </a>
                </h3>
                <p className="text-gray-300 leading-relaxed">{item.summary}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No news found for the selected filters.</p>
        </div>
      )}
    </div>
  );
};

export default NewsView;
