
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { NewsItem } from "@/types/news";

interface NewsCardProps {
  item: NewsItem;
}

const getSentimentColor = (sentiment: string) => {
  switch (sentiment) {
    case 'positive': return 'bg-green-600/90 text-green-100 border-green-900/70';
    case 'negative': return 'bg-red-600/90 text-red-100 border-red-900/70';
    default: return 'bg-slate-600/90 text-slate-100 border-slate-900/70';
  }
};

const NewsCard = ({ item }: NewsCardProps) => {
  return (
    <Card className="bg-slate-900/80 border-slate-800/60 p-6 hover:bg-slate-900/90 transition-colors backdrop-blur-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <Badge variant="outline" className="border-purple-500/50 text-purple-300 bg-purple-500/10">
              {item.ticker}
            </Badge>
            <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getSentimentColor(item.sentiment)}`}>
              {item.sentiment}
            </div>
            <span className="text-sm text-slate-300">{item.date}</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-50 mb-2">
            {item.title}
          </h3>
          <p className="text-slate-200 leading-relaxed mb-3">{item.summary}</p>
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
  );
};

export default NewsCard;
