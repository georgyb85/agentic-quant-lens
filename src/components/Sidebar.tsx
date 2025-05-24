
import { BarChart3, Newspaper, FileText, TrendingUp } from "lucide-react";

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const Sidebar = ({ activeView, setActiveView }: SidebarProps) => {
  const menuItems = [
    { id: "chart", label: "Chart View", icon: BarChart3 },
    { id: "news", label: "News", icon: Newspaper },
    { id: "company-reports", label: "Company Reports", icon: FileText },
    { id: "macro-reports", label: "Macro Reports", icon: TrendingUp },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-slate-800 to-gray-800 border-r border-slate-700/50 backdrop-blur-sm p-4">
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeView === item.id
                  ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-blue-200 border border-blue-500/30 shadow-lg shadow-blue-500/10"
                  : "text-slate-300 hover:bg-gradient-to-r hover:from-slate-700/50 hover:to-gray-700/50 hover:text-white hover:border hover:border-slate-600/30"
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
