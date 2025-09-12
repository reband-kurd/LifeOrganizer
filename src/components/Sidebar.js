"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Helper function to get icons
function getIcon(iconName) {
  const iconMap = {
    dashboard: "📊",
    task: "✓",
    habit: "🔄",
    notes: "📝",
    event: "📅",
    goal: "🎯",
    journal: "📔",
    project: "📁",
  };

  return iconMap[iconName] || "•";
}

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState("");

  useEffect(() => {
    setActiveItem(pathname);
  }, [pathname]);

  const menuItems = [
    { name: "Dashboard", icon: "dashboard", href: "/dashboard" },
    { name: "Tasks", icon: "task", href: "/dashboard/tasks" },
    { name: "Habits", icon: "habit", href: "/dashboard/habits" },
    { name: "Notes", icon: "notes", href: "/dashboard/notes" },
    { name: "Events", icon: "event", href: "/dashboard/events" },
    { name: "Goals", icon: "goal", href: "/dashboard/goals" },
    { name: "Journals", icon: "journal", href: "/dashboard/journals" },
    { name: "Projects", icon: "project", href: "/dashboard/projects" },
  ];

  return (
    <>
      {/* Mobile backdrop with blur effect */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar with refined styling */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-background/95 backdrop-blur-sm border-r border-border/40 shadow-lg shadow-background/5 z-50 transition-all duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:z-10`}
      >
        {/* Logo section with refined spacing */}
        <div className="p-6 border-b border-border/40">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            LifeOrganizer
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Organize your life beautifully
          </p>
        </div>

        {/* Menu with improved spacing and visual hierarchy */}
        <nav className="mt-6 px-4">
          <div className="text-xs font-medium text-muted-foreground tracking-wider uppercase pl-4 mb-3">
            Main Menu
          </div>
          <ul className="space-y-1.5">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group
                    ${
                      activeItem === item.href
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-foreground/80 hover:bg-primary/5 hover:text-primary"
                    }`}
                  onClick={() => setActiveItem(item.href)}
                >
                  <span
                    className={`flex items-center justify-center w-6 h-6 text-lg
                    ${
                      activeItem === item.href
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-primary/70"
                    }`}
                  >
                    {getIcon(item.icon)}
                  </span>
                  <span>{item.name}</span>

                  {/* Active indicator */}
                  {activeItem === item.href && (
                    <span className="ml-auto w-1 h-5 bg-primary rounded-full"></span>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Quick Actions Section */}
          <div className="mt-8">
            <div className="text-xs font-medium text-muted-foreground tracking-wider uppercase pl-4 mb-3">
              Quick Actions
            </div>
            <div className="bg-primary/5 rounded-lg p-3 mx-1">
              <button className="w-full py-2 px-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-md flex items-center justify-center gap-2 transition-colors">
                <span>+</span> New Task
              </button>
            </div>
          </div>
        </nav>

        {/* User Profile with improved styling */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/40 bg-background/80 backdrop-blur-sm">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-background/80 cursor-pointer transition-all">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/80 to-primary text-white flex items-center justify-center font-medium shadow-sm">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground truncate">John Doe</h4>
              <p className="text-xs text-muted-foreground truncate">
                john@example.com
              </p>
            </div>
            <button className="p-1.5 rounded-md hover:bg-background/90">
              <span className="text-muted-foreground">⚙️</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
