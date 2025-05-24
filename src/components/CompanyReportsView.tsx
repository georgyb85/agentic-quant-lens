
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import TickerSearch from "./TickerSearch";

interface CompanyReport {
  id: string;
  company: string;
  ticker: string;
  reportType: 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'Annual';
  year: number;
  quarter?: number;
  title: string;
  summary: string;
  keyMetrics: {
    revenue: string;
    netIncome: string;
    eps: string;
    guidance?: string;
  };
  date: string;
  link: string;
}

const CompanyReportsView = () => {
  const [selectedTicker, setSelectedTicker] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [tickerSearch, setTickerSearch] = useState("");
  const [reports, setReports] = useState<CompanyReport[]>([]);

  const availableTickers = ["AMZN", "GOOG", "TSLA"];
  const reportTypes = ["all", "Q1", "Q2", "Q3", "Q4", "Annual"];
  const years = ["all", "2024", "2025"];

  useEffect(() => {
    // Generate mock company reports data
    const mockReports: CompanyReport[] = [
      {
        id: "1",
        company: "Amazon.com, Inc.",
        ticker: "AMZN",
        reportType: "Q1",
        year: 2025,
        quarter: 1,
        title: "Q1 2025",
        summary: "Amazon exceeded expectations with AWS growth accelerating to 37% YoY and significant margin improvements in North American retail. International segment reached profitability for the first time in 8 quarters.",
        keyMetrics: {
          revenue: "$142.7B",
          netIncome: "$18.3B",
          eps: "$1.78"
        },
        date: "Apr 25, 2025",
        link: "#"
      },
      {
        id: "2",
        company: "Alphabet Inc.",
        ticker: "GOOG",
        reportType: "Q1",
        year: 2025,
        quarter: 1,
        title: "Q1 2025",
        summary: "Google Cloud continued its strong momentum with 45% YoY growth. YouTube ad revenue recovered, growing 18% YoY after several challenging quarters. AI-related services contributed significantly to overall growth.",
        keyMetrics: {
          revenue: "$86.5B",
          netIncome: "$28.2B",
          eps: "$2.15"
        },
        date: "Apr 22, 2025",
        link: "#"
      },
      {
        id: "3",
        company: "Tesla, Inc.",
        ticker: "TSLA",
        reportType: "Q1",
        year: 2025,
        quarter: 1,
        title: "Q1 2025",
        summary: "Tesla reported strong Q1 results with revenue growth of 22% YoY, driven primarily by increased vehicle deliveries and energy storage deployments. EPS beat analyst estimates by $0.12.",
        keyMetrics: {
          revenue: "$25.5B",
          netIncome: "$4.2B",
          eps: "$1.45"
        },
        date: "Apr 18, 2025",
        link: "#"
      },
      {
        id: "4",
        company: "Amazon.com, Inc.",
        ticker: "AMZN",
        reportType: "Annual",
        year: 2024,
        title: "FY 2024",
        summary: "Amazon reported record revenue and operating income for FY 2024. AWS maintained its position as the leading cloud provider with 34% market share. Significant improvements in logistics efficiency contributed to margin expansion.",
        keyMetrics: {
          revenue: "$587.3B",
          netIncome: "$70.8B",
          eps: "$6.92"
        },
        date: "Jan 31, 2025",
        link: "#"
      },
      {
        id: "5",
        company: "Tesla, Inc.",
        ticker: "TSLA",
        reportType: "Annual",
        year: 2024,
        title: "FY 2024",
        summary: "Tesla achieved record deliveries of 2.1M vehicles in 2024, representing 37% YoY growth. Energy business grew 74% with Megapack production reaching new highs. Full Self-Driving subscription revenue became a meaningful contributor.",
        keyMetrics: {
          revenue: "$96.8B",
          netIncome: "$15.7B",
          eps: "$5.45"
        },
        date: "Jan 24, 2025",
        link: "#"
      }
    ];

    setReports(mockReports);
  }, []);

  const filteredReports = reports.filter(report => {
    const tickerMatch = !selectedTicker || report.ticker === selectedTicker;
    const typeMatch = selectedType === "all" || report.reportType === selectedType;
    const yearMatch = selectedYear === "all" || report.year.toString() === selectedYear;
    return tickerMatch && typeMatch && yearMatch;
  });

  const getReportTypeBadgeColor = (type: string) => {
    if (type.startsWith('Q')) return "bg-emerald-600 text-white hover:bg-emerald-600";
    return "bg-orange-600 text-white hover:bg-orange-600";
  };

  const handleTickerSelect = (ticker: string) => {
    setSelectedTicker(ticker);
    setTickerSearch("");
  };

  const clearTickerFilter = () => {
    setSelectedTicker("");
    setTickerSearch("");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-50">Company Reports</h2>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-200">Company</label>
            <div className="flex items-center gap-2">
              <TickerSearch
                value={tickerSearch}
                onChange={setTickerSearch}
                onSelect={handleTickerSelect}
                availableTickers={availableTickers}
                selectedTickers={selectedTicker ? [selectedTicker] : []}
                placeholder="Search company..."
                className="w-full sm:w-40"
              />
              {selectedTicker && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearTickerFilter}
                  className="text-xs px-2 py-1 h-8 flex-shrink-0"
                >
                  Clear
                </Button>
              )}
            </div>
            {selectedTicker && (
              <div className="text-xs text-blue-400">
                Filtered by: {selectedTicker}
              </div>
            )}
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-200">Report Type</label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-32 bg-slate-900/50 border-slate-700/50 text-slate-50">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900/95 border-slate-700/50 backdrop-blur-sm">
                {reportTypes.map((type) => (
                  <SelectItem key={type} value={type} className="text-slate-50 hover:bg-slate-800/50 focus:bg-slate-800/50">
                    {type === "all" ? "All Types" : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-200">Year</label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-full sm:w-32 bg-slate-900/50 border-slate-700/50 text-slate-50">
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900/95 border-slate-700/50 backdrop-blur-sm">
                {years.map((year) => (
                  <SelectItem key={year} value={year} className="text-slate-50 hover:bg-slate-800/50 focus:bg-slate-800/50">
                    {year === "all" ? "All Years" : year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Reports Grid - Mobile responsive */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <Card key={report.id} className="bg-slate-900/80 border-slate-800/60 p-3 sm:p-6 hover:bg-slate-900/90 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center space-x-2 sm:space-x-3 mb-2 gap-y-2">
                  <Badge variant="outline" className="border-purple-600 text-purple-400 bg-purple-600/10 hover:border-purple-600 hover:text-purple-400 hover:bg-purple-600/10 pointer-events-none">
                    {report.company}
                  </Badge>
                  <Badge className={`${getReportTypeBadgeColor(report.reportType)} flex-shrink-0`}>
                    {report.reportType}
                  </Badge>
                  <span className="text-xs sm:text-sm text-slate-300">{report.date}</span>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-50 mb-2">
                  <span className="text-blue-400 font-semibold">{report.ticker}</span> - {report.title}
                </h3>
              </div>
            </div>

            <p className="text-slate-200 leading-relaxed mb-4 text-sm sm:text-base">{report.summary}</p>
            
            {/* Metrics */}
            <div className="space-y-2 mb-4">
              <div className="grid grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div className="min-w-0">
                  <span className="text-slate-300 block">Revenue</span>
                  <span className="text-slate-50 font-semibold truncate block">{report.keyMetrics.revenue}</span>
                </div>
                <div className="min-w-0">
                  <span className="text-slate-300 block">EPS</span>
                  <span className="text-slate-50 font-semibold truncate block">{report.keyMetrics.eps}</span>
                </div>
                <div className="min-w-0">
                  <span className="text-slate-300 block">Net Income</span>
                  <span className="text-slate-50 font-semibold truncate block">{report.keyMetrics.netIncome}</span>
                </div>
              </div>
            </div>
            
            {/* Footer with link */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-xs sm:text-sm text-slate-300">
              <span>Released: {report.date}</span>
              <a href={report.link} className="text-green-400 hover:text-green-300 transition-colors">
                Read Full Report →
              </a>
            </div>
          </Card>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-300">No reports found for the selected filters.</p>
        </div>
      )}
    </div>
  );
};

export default CompanyReportsView;
