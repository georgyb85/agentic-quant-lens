
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Bot } from "lucide-react";
import { NewsItem } from "@/types/news";
import { useState } from "react";
import AIAnalysisModal from "./AIAnalysisModal";

interface NewsCardProps {
  item: NewsItem;
}

const NewsCard = ({ item }: NewsCardProps) => {
  const [showAIModal, setShowAIModal] = useState(false);

  return (
    <>
      <Card className="bg-slate-900/80 border-slate-800/60 p-6 hover:bg-slate-900/90 transition-colors backdrop-blur-sm">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <Badge variant="outline" className="border-purple-500/50 text-purple-300 bg-purple-500/10">
                {item.ticker}
              </Badge>
              <button
                onClick={() => setShowAIModal(true)}
                className="inline-flex items-center rounded-full border border-blue-500/50 px-2.5 py-0.5 text-xs font-semibold bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 hover:border-blue-400/50 transition-colors"
                title="AI Analysis"
              >
                <Bot size={12} className="mr-1" />
                AI
              </button>
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

      <AIAnalysisModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        newsItem={item}
      />
    </>
  );
};

export default NewsCard;
