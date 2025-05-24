
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
    if (type.startsWith('Q')) return "bg-emerald-500 text-white";
    return "bg-orange-500 text-white";
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
        <h2 className="text-2xl font-bold text-slate-100">Company Reports</h2>
        
        {/* Filters */}
        <div className="flex items-center space-x-6">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300">Company</label>
            <div className="flex items-center gap-2">
              <TickerSearch
                value={tickerSearch}
                onChange={setTickerSearch}
                onSelect={handleTickerSelect}
                availableTickers={availableTickers}
                selectedTickers={selectedTicker ? [selectedTicker] : []}
                placeholder="Search company..."
                className="w-40"
              />
              {selectedTicker && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearTickerFilter}
                  className="text-xs px-2 py-1 h-8"
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
            <label className="text-sm font-medium text-slate-300">Report Type</label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-32 bg-slate-800/50 border-slate-600/30 text-slate-100">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800/95 border-slate-600/30 backdrop-blur-sm">
                {reportTypes.map((type) => (
                  <SelectItem key={type} value={type} className="text-slate-100 hover:bg-slate-700/50 focus:bg-slate-700/50">
                    {type === "all" ? "All Types" : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300">Year</label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32 bg-slate-800/50 border-slate-600/30 text-slate-100">
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800/95 border-slate-600/30 backdrop-blur-sm">
                {years.map((year) => (
                  <SelectItem key={year} value={year} className="text-slate-100 hover:bg-slate-700/50 focus:bg-slate-700/50">
                    {year === "all" ? "All Years" : year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {filteredReports.map((report) => (
          <Card key={report.id} className="bg-slate-800/40 border-slate-600/30 backdrop-blur-sm p-4 space-y-3 hover:bg-slate-700/40 transition-colors">
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="text-blue-400 font-semibold text-lg">{report.ticker}</span>
              <Badge className={`${getReportTypeBadgeColor(report.reportType)} px-2 py-1 text-xs`}>
                {report.reportType}
              </Badge>
            </div>
            
            {/* Company Info */}
            <div className="space-y-1">
              <h3 className="text-slate-100 font-medium">{report.company}</h3>
              <p className="text-slate-100 font-semibold">{report.title}</p>
              <p className="text-slate-400 text-sm">Released: {report.date}</p>
            </div>
            
            {/* Metrics */}
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block">Revenue</span>
                  <span className="text-slate-100 font-semibold">{report.keyMetrics.revenue}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">EPS</span>
                  <span className="text-slate-100 font-semibold">{report.keyMetrics.eps}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Net Income</span>
                  <span className="text-slate-100 font-semibold">{report.keyMetrics.netIncome}</span>
                </div>
              </div>
            </div>
            
            {/* Summary */}
            <p className="text-slate-300 text-xs leading-relaxed line-clamp-4">{report.summary}</p>
            
            {/* Action Button */}
            <Button 
              variant="default" 
              size="sm" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0"
            >
              View Full Report
            </Button>
          </Card>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400">No reports found for the selected filters.</p>
        </div>
      )}
    </div>
  );
};

export default CompanyReportsView;
