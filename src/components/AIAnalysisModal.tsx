
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { NewsItem } from "@/types/news";
import { Loader2 } from "lucide-react";

interface AIAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  newsItem: NewsItem;
}

const promptTemplates = {
  summary: "Provide a concise summary of this news article in 2-3 sentences.",
  sentiment: "Analyze the sentiment of this news article. Is it positive, negative, or neutral? Explain your reasoning.",
  analysis: "Provide a detailed analysis of this news article, including potential market implications and key insights.",
  impact: "Analyze the potential impact of this news on the stock market and related companies.",
  keywords: "Extract the key topics, companies, and important terms mentioned in this article.",
  questions: "Generate 3-5 insightful questions that this news article raises for further research."
};

const llmModels = [
  "chatgpt-o3",
  "chatgpt-o4", 
  "chatgpt-4.1",
  "claude-4-sonnet",
  "gemini-2.5-flash",
  "gemini-2.5-pro"
];

const AIAnalysisModal = ({ isOpen, onClose, newsItem }: AIAnalysisModalProps) => {
  const [selectedPrompt, setSelectedPrompt] = useState<keyof typeof promptTemplates>("summary");
  const [customPrompt, setCustomPrompt] = useState(promptTemplates.summary);
  const [selectedModel, setSelectedModel] = useState("chatgpt-o4");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePromptChange = (value: keyof typeof promptTemplates) => {
    setSelectedPrompt(value);
    setCustomPrompt(promptTemplates[value]);
  };

  const handleRunQuery = async () => {
    setIsLoading(true);
    setResult("");
    
    try {
      // Simulate API call - replace with actual AI service integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response based on prompt type
      let mockResult = "";
      switch (selectedPrompt) {
        case "summary":
          mockResult = `Summary: ${newsItem.title} represents a significant development in the ${newsItem.ticker} ecosystem. The key points indicate potential market movements and strategic implications for stakeholders.`;
          break;
        case "sentiment":
          mockResult = `Sentiment Analysis: This article exhibits a ${newsItem.sentiment} sentiment. The language used suggests ${newsItem.sentiment === 'positive' ? 'optimistic market outlook' : newsItem.sentiment === 'negative' ? 'cautious investor sentiment' : 'neutral market positioning'} with moderate confidence levels.`;
          break;
        case "analysis":
          mockResult = `Detailed Analysis: This news about ${newsItem.ticker} indicates several market dynamics at play. The implications suggest potential volatility in the short term, with longer-term prospects depending on execution and market conditions. Key factors to monitor include regulatory responses and competitor reactions.`;
          break;
        default:
          mockResult = `AI Analysis Result: Based on the selected prompt and ${selectedModel} model, this article about ${newsItem.ticker} provides valuable insights into current market conditions and future prospects.`;
      }
      
      setResult(mockResult);
    } catch (error) {
      setResult("Error: Failed to generate AI analysis. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-900/95 border-slate-700/50 text-slate-50">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-50">AI Analysis</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* News Content */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-200 block mb-1">$TITLE$</label>
              <div className="p-3 bg-slate-800/50 rounded-md border border-slate-700/50">
                <p className="text-slate-100">{newsItem.title}</p>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-200 block mb-1">$DESCRIPTION$</label>
              <div className="p-3 bg-slate-800/50 rounded-md border border-slate-700/50">
                <p className="text-slate-100">{newsItem.summary}</p>
              </div>
            </div>
          </div>

          {/* AI Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-200 block mb-2">Prompt Type</label>
              <Select value={selectedPrompt} onValueChange={handlePromptChange}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-slate-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900/95 border-slate-700/50 backdrop-blur-sm">
                  {Object.keys(promptTemplates).map((key) => (
                    <SelectItem key={key} value={key} className="text-slate-50 hover:bg-slate-800/50 focus:bg-slate-800/50">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-200 block mb-2">LLM Model</label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-slate-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900/95 border-slate-700/50 backdrop-blur-sm">
                  {llmModels.map((model) => (
                    <SelectItem key={model} value={model} className="text-slate-50 hover:bg-slate-800/50 focus:bg-slate-800/50">
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Editable Prompt */}
          <div>
            <label className="text-sm font-medium text-slate-200 block mb-2">Prompt</label>
            <Textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="bg-slate-800/50 border-slate-700/50 text-slate-50 min-h-[100px]"
              placeholder="Enter your custom prompt..."
            />
          </div>

          {/* Run Query Button */}
          <Button 
            onClick={handleRunQuery}
            disabled={isLoading || !customPrompt.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Running Analysis...
              </>
            ) : (
              "Run Query"
            )}
          </Button>

          {/* Result Display */}
          {result && (
            <div>
              <label className="text-sm font-medium text-slate-200 block mb-2">Result</label>
              <div className="p-4 bg-slate-800/50 rounded-md border border-slate-700/50">
                <p className="text-slate-100 whitespace-pre-wrap">{result}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIAnalysisModal;
