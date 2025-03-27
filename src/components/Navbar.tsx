
import React from 'react';
import { Button } from "@/components/ui/button";
import { Activity, Bug, Menu, Settings, ChevronDown } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  return (
    <nav className="bg-card border-b border-border backdrop-blur-lg bg-gradient-to-r from-black/80 to-black/60 h-14 w-full flex items-center px-4 justify-between z-10 shadow-md">
      <div className="flex items-center space-x-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="lg:hidden hover:bg-white/5 hover:text-fuzzer-primary transition-all duration-200"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Toggle Sidebar</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="flex items-center space-x-2">
          <Bug className="h-6 w-6 text-fuzzer-primary animate-float" />
          <span className="font-bold text-lg">FuzzifyWeb</span>
          <span className="text-xs px-2 py-0.5 bg-fuzzer-primary/20 text-fuzzer-primary rounded-full hidden sm:flex">v1.0</span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" className="hidden md:flex gap-2 hover:bg-white/5 hover:text-fuzzer-primary transition-all duration-200">
          <Activity className="h-4 w-4" />
          <span>Metrics</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex gap-1 bg-fuzzer-primary/10 border-fuzzer-primary/20 hover:bg-fuzzer-primary/20 transition-all duration-200">
              <Settings className="h-4 w-4 animate-spin-slow" />
              <span className="hidden sm:inline">Settings</span>
              <ChevronDown className="h-3 w-3 opacity-70 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 backdrop-blur-lg bg-card/95 border-white/10 animate-scale-up">
            <DropdownMenuLabel>FuzzifyWeb</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer hover:bg-fuzzer-primary/10 focus:bg-fuzzer-primary/10 transition-colors duration-200">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-fuzzer-primary/10 focus:bg-fuzzer-primary/10 transition-colors duration-200">
              <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span>Help</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer hover:bg-fuzzer-primary/10 focus:bg-fuzzer-primary/10 transition-colors duration-200">
              <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>About</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
