
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, ExternalLink } from "lucide-react";

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
    const tickerMatch = selectedTicker === "all" || item.ticker === selectedTicker;
    const dateMatch = !dateFilter || item.date === dateFilter;
    return tickerMatch && dateMatch;
  });

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-600/90 text-green-100';
      case 'negative': return 'bg-red-600/90 text-red-100';
      default: return 'bg-slate-600/90 text-slate-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-100 via-purple-100 to-slate-200 bg-clip-text text-transparent">
          Market News
        </h2>
        <div className="flex space-x-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Filter by Ticker</label>
            <Select value={selectedTicker} onValueChange={setSelectedTicker}>
              <SelectTrigger className="w-32 bg-slate-800/90 border-slate-600/50 text-slate-100 hover:bg-slate-700/90">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600/50">
                {tickers.map((ticker) => (
                  <SelectItem key={ticker} value={ticker} className="text-slate-100 hover:bg-slate-700 focus:bg-slate-700">
                    {ticker.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Filter by Date</label>
            <div className="relative">
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-40 bg-slate-800/90 border-slate-600/50 text-slate-100 hover:bg-slate-700/90"
              />
              <Calendar className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredNews.map((item) => (
          <Card key={item.id} className="bg-slate-800/70 border-slate-700/50 p-6 hover:bg-slate-800/90 transition-colors backdrop-blur-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <Badge variant="outline" className="border-purple-500/50 text-purple-300 bg-purple-500/10">
                    {item.ticker}
                  </Badge>
                  <Badge className={getSentimentColor(item.sentiment)}>
                    {item.sentiment}
                  </Badge>
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
