import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, TrendingUp, TrendingDown } from "lucide-react";

interface MacroReport {
  id: string;
  title: string;
  summary: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  category: string;
  date: string;
  source: string;
  link: string;
  keyIndicators: string[];
}

const MacroReportsView = () => {
  const [dateFilter, setDateFilter] = useState("");
  const [reports, setReports] = useState<MacroReport[]>([]);

  useEffect(() => {
    // Generate mock macro reports data
    const mockReports: MacroReport[] = [
      {
        id: "1",
        title: "Federal Reserve Maintains Interest Rates at 5.25-5.50%",
        summary: "The Federal Open Market Committee decided to keep the federal funds rate unchanged, citing ongoing inflation concerns and labor market strength. Fed Chair emphasized data-dependent approach for future policy decisions.",
        sentiment: "neutral",
        category: "Monetary Policy",
        date: "2025-05-22",
        source: "Federal Reserve",
        link: "#",
        keyIndicators: ["Interest Rates", "Inflation", "Employment"]
      },
      {
        id: "2",
        title: "GDP Growth Accelerates to 3.2% in Q1 2025",
        summary: "U.S. economic growth exceeded expectations in the first quarter, driven by strong consumer spending and business investment. The robust growth supports continued economic expansion despite global uncertainties.",
        sentiment: "positive",
        category: "Economic Growth",
        date: "2025-05-20",
        source: "Bureau of Economic Analysis",
        link: "#",
        keyIndicators: ["GDP", "Consumer Spending", "Business Investment"]
      },
      {
        id: "3",
        title: "Inflation Shows Signs of Moderation at 3.1% YoY",
        summary: "Consumer Price Index rose 3.1% year-over-year in April, showing continued moderation from previous highs. Core inflation remains elevated, particularly in services sector, warranting continued Fed attention.",
        sentiment: "positive",
        category: "Inflation",
        date: "2025-05-18",
        source: "Bureau of Labor Statistics",
        link: "#",
        keyIndicators: ["CPI", "Core Inflation", "Services Inflation"]
      },
      {
        id: "4",
        title: "Employment Report: Unemployment Rate Holds at 3.8%",
        summary: "Labor market remains tight with unemployment rate unchanged at 3.8%. Job gains were broad-based across sectors, though pace of hiring has moderated from previous months.",
        sentiment: "positive",
        category: "Employment",
        date: "2025-05-16",
        source: "Bureau of Labor Statistics",
        link: "#",
        keyIndicators: ["Unemployment Rate", "Job Creation", "Labor Participation"]
      },
      {
        id: "5",
        title: "Global Trade Tensions Impact Manufacturing Sector",
        summary: "Manufacturing PMI declined to 48.2, indicating contraction as trade uncertainties and supply chain disruptions continue to weigh on industrial production and business confidence.",
        sentiment: "negative",
        category: "Manufacturing",
        date: "2025-05-14",
        source: "Institute for Supply Management",
        link: "#",
        keyIndicators: ["PMI", "Manufacturing", "Trade"]
      }
    ];

    setReports(mockReports);
  }, []);

  const filteredReports = reports.filter(report => {
    const dateMatch = !dateFilter || report.date === dateFilter;
    return dateMatch;
  });

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-600 text-white hover:bg-green-600';
      case 'negative': return 'bg-red-600 text-white hover:bg-red-600';
      default: return 'bg-gray-600 text-white hover:bg-gray-600';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp className="h-4 w-4" />;
      case 'negative': return <TrendingDown className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Macro Economic Reports</h2>
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

      <div className="space-y-4">
        {filteredReports.map((report) => (
          <Card key={report.id} className="bg-gray-800 border-gray-700 p-6 hover:bg-gray-750 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <Badge variant="outline" className="border-blue-600 text-blue-400">
                    {report.category}
                  </Badge>
                  <Badge className={`${getSentimentColor(report.sentiment)} flex items-center space-x-1`}>
                    {getSentimentIcon(report.sentiment)}
                    <span>{report.sentiment}</span>
                  </Badge>
                  <span className="text-sm text-gray-400">{report.date}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  <a href={report.link} className="hover:text-green-400 transition-colors">
                    {report.title}
                  </a>
                </h3>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed mb-4">{report.summary}</p>

            <div className="flex flex-wrap gap-2 mb-3">
              {report.keyIndicators.map((indicator, index) => (
                <Badge key={index} variant="secondary" className="bg-gray-700 text-gray-300">
                  {indicator}
                </Badge>
              ))}
            </div>

            <div className="flex justify-between items-center text-sm text-gray-400">
              <span>Source: {report.source}</span>
              <a href={report.link} className="text-green-400 hover:text-green-300 transition-colors">
                Read Full Report →
              </a>
            </div>
          </Card>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No macro reports found for the selected date.</p>
        </div>
      )}
    </div>
  );
};

export default MacroReportsView;
