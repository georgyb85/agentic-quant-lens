
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ChartView from "@/components/ChartView";
import NewsView from "@/components/NewsView";
import CompanyReportsView from "@/components/CompanyReportsView";
import MacroReportsView from "@/components/MacroReportsView";

const Index = () => {
  const [activeView, setActiveView] = useState("chart");

  const renderActiveView = () => {
    switch (activeView) {
      case "chart":
        return <ChartView />;
      case "news":
        return <NewsView />;
      case "company-reports":
        return <CompanyReportsView />;
      case "macro-reports":
        return <MacroReportsView />;
      default:
        return <ChartView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-green-400">Agentic Research</h1>
          <p className="text-gray-400 mt-2">Quantitative Trading Strategy Research Platform</p>
        </header>
        {renderActiveView()}
      </main>
    </div>
  );
};

export default Index;
