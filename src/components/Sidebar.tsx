
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
    <div className="w-64 bg-gray-800 border-r border-gray-700 p-4">
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeView === item.id
                  ? "bg-green-600 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
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
