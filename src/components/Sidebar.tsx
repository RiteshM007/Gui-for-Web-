
import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  BookOpenCheck,
  Bug,
  ChevronRight,
  Database,
  FileWarning,
  GripVertical,
  History,
  Home,
  Network,
  Settings,
  X,
  Activity,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar, activeTab = "home", onTabChange }) => {
  const navigate = useNavigate();
  
  const navItems = [
    { icon: Home, label: 'Home', value: 'home', active: activeTab === 'home' },
    { icon: Bug, label: 'Fuzzer', value: 'fuzzer', active: activeTab === 'fuzzer' },
    { icon: FileWarning, label: 'Vulnerabilities', value: 'vulnerabilities', active: activeTab === 'vulnerabilities' },
    { icon: Network, label: 'API Endpoints', value: 'api-endpoints', active: activeTab === 'api-endpoints' },
    { icon: Database, label: 'Payload Library', value: 'payload-library', active: activeTab === 'payload-library' },
    { icon: History, label: 'History', value: 'history', active: activeTab === 'history' },
    { icon: BookOpenCheck, label: 'Reports', value: 'reports', active: activeTab === 'reports' },
    { icon: Activity, label: 'Metrics', value: 'metrics', active: activeTab === 'metrics' },
    { icon: Settings, label: 'Settings', value: 'settings', active: activeTab === 'settings' },
  ];

  const handleNavItemClick = (itemValue) => {
    if (onTabChange) {
      onTabChange(itemValue);
      closeSidebar();
    }
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}
    >
      <div className="h-14 flex items-center justify-between px-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Bug className="h-6 w-6 text-fuzzer-primary animate-pulse-slow" />
          <span className="font-bold text-lg">FuzzifyWeb</span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={closeSidebar}
          className="lg:hidden hover-scale"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="py-4">
        <nav className="px-2 space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.label}
              variant={item.active ? "default" : "ghost"}
              className={`w-full justify-start mb-1 transition-all duration-300 ${
                item.active ? 'bg-fuzzer-primary text-primary-foreground scale-105' : 'hover-scale-sm'
              }`}
              onClick={() => handleNavItemClick(item.value)}
            >
              <item.icon className={`mr-2 h-5 w-5 ${item.active ? 'animate-pulse-slow' : ''}`} />
              {item.label}
              {item.active && <ChevronRight className="ml-auto h-5 w-5" />}
            </Button>
          ))}
        </nav>

        <Separator className="my-4" />

        <div className="px-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Recent Targets</span>
            <GripVertical className="h-4 w-4" />
          </div>
          <div className="space-y-1">
            {['https://example.com/api', 'https://testapp.io/login', 'https://demo-site.com'].map((url) => (
              <Button 
                key={url} 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-sm font-mono truncate hover-scale-sm"
                onClick={() => {
                  toast.info("Target selected", {
                    description: `Target set to ${url}`
                  });
                  if (onTabChange) {
                    onTabChange('fuzzer'); // Navigate to fuzzer tab when target is selected
                  }
                }}
              >
                {url}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
