
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [selectedTicker, setSelectedTicker] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [reports, setReports] = useState<CompanyReport[]>([]);

  const tickers = ["all", "TSLA", "AMZN", "GOOG"];
  const reportTypes = ["all", "Q1", "Q2", "Q3", "Q4", "Annual"];

  useEffect(() => {
    // Generate mock company reports data
    const mockReports: CompanyReport[] = [
      {
        id: "1",
        company: "Tesla Inc.",
        ticker: "TSLA",
        reportType: "Q4",
        year: 2024,
        quarter: 4,
        title: "Q4 2024 Earnings Report",
        summary: "Tesla delivered record quarterly results with strong vehicle deliveries and improved operational efficiency across all segments.",
        keyMetrics: {
          revenue: "$25.2B",
          netIncome: "$7.9B",
          eps: "$2.27",
          guidance: "50% annual growth target maintained"
        },
        date: "2025-01-24",
        link: "#"
      },
      {
        id: "2",
        company: "Amazon.com Inc.",
        ticker: "AMZN",
        reportType: "Annual",
        year: 2024,
        title: "2024 Annual Report",
        summary: "Amazon's diversified business model showed resilience with strong performance in cloud services and advertising revenue growth.",
        keyMetrics: {
          revenue: "$574.8B",
          netIncome: "$30.4B",
          eps: "$2.90"
        },
        date: "2025-02-01",
        link: "#"
      },
      {
        id: "3",
        company: "Alphabet Inc.",
        ticker: "GOOG",
        reportType: "Q4",
        year: 2024,
        quarter: 4,
        title: "Q4 2024 Financial Results",
        summary: "Google's parent company reported strong growth in search revenue and significant progress in AI initiatives driving future growth.",
        keyMetrics: {
          revenue: "$86.2B",
          netIncome: "$20.6B",
          eps: "$1.64",
          guidance: "Continued investment in AI and cloud infrastructure"
        },
        date: "2025-01-30",
        link: "#"
      }
    ];

    setReports(mockReports);
  }, []);

  const filteredReports = reports.filter(report => {
    const tickerMatch = selectedTicker === "all" || report.ticker === selectedTicker;
    const typeMatch = selectedType === "all" || report.reportType === selectedType;
    return tickerMatch && typeMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Company Reports</h2>
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
            <label className="block text-sm font-medium text-gray-300 mb-1">Report Type</label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-32 bg-gray-800 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {reportTypes.map((type) => (
                  <SelectItem key={type} value={type} className="text-white hover:bg-gray-700">
                    {type === "all" ? "ALL" : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredReports.map((report) => (
          <Card key={report.id} className="bg-gray-800 border-gray-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <FileText className="h-6 w-6 text-green-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">{report.title}</h3>
                  <p className="text-gray-400">{report.company}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="border-green-600 text-green-400">
                  {report.ticker}
                </Badge>
                <Badge className="bg-blue-600">
                  {report.reportType} {report.year}
                </Badge>
                <span className="text-sm text-gray-400">{report.date}</span>
              </div>
            </div>

            <p className="text-gray-300 mb-4">{report.summary}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-gray-700 p-3 rounded">
                <p className="text-sm text-gray-400">Revenue</p>
                <p className="text-lg font-semibold text-white">{report.keyMetrics.revenue}</p>
              </div>
              <div className="bg-gray-700 p-3 rounded">
                <p className="text-sm text-gray-400">Net Income</p>
                <p className="text-lg font-semibold text-white">{report.keyMetrics.netIncome}</p>
              </div>
              <div className="bg-gray-700 p-3 rounded">
                <p className="text-sm text-gray-400">EPS</p>
                <p className="text-lg font-semibold text-white">{report.keyMetrics.eps}</p>
              </div>
              {report.keyMetrics.guidance && (
                <div className="bg-gray-700 p-3 rounded">
                  <p className="text-sm text-gray-400">Guidance</p>
                  <p className="text-sm text-white">{report.keyMetrics.guidance}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button variant="outline" size="sm" className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white">
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No reports found for the selected filters.</p>
        </div>
      )}
    </div>
  );
};

export default CompanyReportsView;
