
import { BarChart3, Newspaper, FileText, TrendingUp } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
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
    <Sidebar>
      <SidebarContent>
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
