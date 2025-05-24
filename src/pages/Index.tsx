
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/Sidebar";
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
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white flex w-full">
        <AppSidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1 p-6">
          <header className="mb-6 flex items-center gap-4">
            <SidebarTrigger className="text-white hover:bg-slate-700/50" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-200 via-blue-200 to-slate-300 bg-clip-text text-transparent">
                Agentic Research
              </h1>
              <p className="text-slate-400 mt-2">Quantitative Trading Strategy Research Platform</p>
            </div>
          </header>
          {renderActiveView()}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
