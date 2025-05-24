
import { BarChart3, Newspaper, FileText, TrendingUp } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const AppSidebar = ({ activeView, setActiveView }: SidebarProps) => {
  const menuItems = [
    { id: "chart", label: "Chart View", icon: BarChart3 },
    { id: "news", label: "News", icon: Newspaper },
    { id: "company-reports", label: "Company Reports", icon: FileText },
    { id: "macro-reports", label: "Macro Reports", icon: TrendingUp },
  ];

  return (
    <Sidebar className="bg-gradient-to-b from-slate-800 to-gray-800 border-r border-slate-700/50">
      <SidebarHeader className="flex flex-row items-center justify-between p-4 border-b border-slate-700/50">
        <h2 className="text-lg font-semibold text-slate-200">Navigation</h2>
        <SidebarTrigger className="text-slate-300 hover:text-white hover:bg-slate-700/50" />
      </SidebarHeader>
      <SidebarContent className="bg-gradient-to-b from-slate-800 to-gray-800">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => setActiveView(item.id)}
                      isActive={activeView === item.id}
                      tooltip={item.label}
                      className={`text-slate-300 hover:text-white hover:bg-slate-700/50 ${
                        activeView === item.id
                          ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-blue-200 border border-blue-500/30"
                          : ""
                      }`}
                    >
                      <Icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
