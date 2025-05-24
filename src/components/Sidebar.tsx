
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
    <Sidebar 
      variant="sidebar" 
      collapsible="icon"
      className="bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-700/50"
    >
      <SidebarHeader className="flex flex-row items-center justify-between p-4 border-b border-slate-700/50 bg-gradient-to-b from-slate-900 to-slate-950">
        <h2 className="text-lg font-semibold text-slate-100 group-data-[collapsible=icon]:hidden">Navigation</h2>
        <SidebarTrigger className="text-slate-200 hover:text-slate-50 hover:bg-slate-800/50 border border-slate-600/50" />
      </SidebarHeader>
      <SidebarContent className="bg-gradient-to-b from-slate-900 to-slate-950">
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
                      className={`text-slate-200 hover:text-slate-50 hover:bg-slate-800/50 data-[active=true]:bg-blue-600/30 data-[active=true]:text-slate-50 data-[active=true]:border data-[active=true]:border-blue-400/50 ${
                        activeView === item.id
                          ? "bg-blue-600/30 text-slate-50 border border-blue-400/50"
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
