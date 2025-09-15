"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 lg:ml-72 transition-all duration-300 ease-in-out">
        {/* Top navigation bar with menu toggle */}
        <header className="h-14 border-b border-border/40 px-4 flex items-center lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="mr-2"
          >
            <Menu size={20} />
          </Button>
          <h1 className="font-medium">LifeOrganizer</h1>
        </header>

        {/* Content area with proper padding */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
