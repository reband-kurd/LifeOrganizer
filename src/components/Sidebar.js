"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Settings,
  Search,
  LayoutDashboard,
  CheckSquare,
  Calendar,
  FileText,
  Target,
  BookOpen,
  Briefcase,
  Activity,
  MoreHorizontal,
} from "lucide-react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    favorites: true,
    workspace: true,
  });

  useEffect(() => {
    setActiveItem(pathname);
  }, [pathname]);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const favoriteItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={16} />,
      href: "/dashboard",
    },
    {
      name: "Tasks",
      icon: <CheckSquare size={16} />,
      href: "/dashboard/tasks",
    },
  ];

  const workspaceItems = [
    { name: "Notes", icon: <FileText size={16} />, href: "/dashboard/notes" },
    { name: "Events", icon: <Calendar size={16} />, href: "/dashboard/events" },
    { name: "Goals", icon: <Target size={16} />, href: "/dashboard/goals" },
    {
      name: "Journals",
      icon: <BookOpen size={16} />,
      href: "/dashboard/journals",
    },
    {
      name: "Projects",
      icon: <Briefcase size={16} />,
      href: "/dashboard/projects",
    },
    { name: "Habits", icon: <Activity size={16} />, href: "/dashboard/habits" },
    {
      name: "Time Schedualr",
      icon: <Calendar size={16} />,
      href: "/dashboard/timeSchedule",
    },
  ];

  // Render a sidebar item
  const renderMenuItem = (item) => (
    <Link
      href={item.href}
      key={item.name}
      className={`group flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors hover:bg-muted/60
        ${
          activeItem === item.href
            ? "bg-muted/80 text-foreground font-medium"
            : "text-muted-foreground"
        }`}
      onClick={() => setActiveItem(item.href)}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <span
            className={`text-[0.8rem] opacity-70 ${
              activeItem === item.href ? "opacity-100" : ""
            }`}
          >
            {item.icon}
          </span>
          <span>{item.name}</span>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal size={14} className="text-muted-foreground" />
        </div>
      </div>
    </Link>
  );

  return (
    <>
      {/* Mobile backdrop with blur effect */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar with Notion-like styling */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-background border-r border-border/40 z-50 transition-all duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:z-10 flex flex-col`}
      >
        {/* Header section */}
        <div className="flex items-center px-3 h-14 border-b border-border/40">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center text-white font-bold text-xs">
              L
            </div>
            <h1 className="text-lg font-semibold">LifeOrganizer</h1>
          </div>
        </div>

        {/* Search bar - Notion style */}
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/60 text-muted-foreground text-sm">
            <Search size={14} />
            <span>Search...</span>
            <span className="ml-auto text-xs px-1 py-0.5 bg-muted rounded border border-border/40">
              ⌘K
            </span>
          </div>
        </div>

        {/* Main sidebar content with scroll */}
        <div className="flex-1 overflow-y-auto py-2 px-1">
          {/* Favorites section */}
          <div className="mb-4 px-2">
            <div
              className="flex items-center justify-between py-1 text-xs text-muted-foreground cursor-pointer group"
              onClick={() => toggleSection("favorites")}
            >
              <div className="flex items-center gap-1">
                {expandedSections.favorites ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
                <span className="font-medium uppercase tracking-wider">
                  Favorites
                </span>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Plus size={14} />
              </div>
            </div>

            {expandedSections.favorites && (
              <div className="ml-2 mt-1 space-y-1">
                {favoriteItems.map(renderMenuItem)}
              </div>
            )}
          </div>

          {/* Workspace section */}
          <div className="mb-4 px-2">
            <div
              className="flex items-center justify-between py-1 text-xs text-muted-foreground cursor-pointer group"
              onClick={() => toggleSection("workspace")}
            >
              <div className="flex items-center gap-1">
                {expandedSections.workspace ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
                <span className="font-medium uppercase tracking-wider">
                  Workspace
                </span>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Plus size={14} />
              </div>
            </div>

            {expandedSections.workspace && (
              <div className="ml-2 mt-1 space-y-1">
                {workspaceItems.map(renderMenuItem)}
              </div>
            )}
          </div>

          {/* Private section */}
          <div className="px-2">
            <div className="flex items-center justify-between py-1 text-xs text-muted-foreground cursor-pointer group">
              <div className="flex items-center gap-1">
                <ChevronRight size={14} />
                <span className="font-medium uppercase tracking-wider">
                  Private
                </span>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Plus size={14} />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Add button - Notion style */}
        <div className="px-3 py-2">
          <button className="w-full py-1.5 px-3 bg-muted hover:bg-muted/80 text-foreground rounded-md flex items-center justify-center gap-2 transition-colors text-sm">
            <Plus size={16} /> New Page
          </button>
        </div>

        {/* User Profile - Notion style */}
        <div className="p-3 border-t border-border/40">
          <div className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/60 cursor-pointer transition-all">
            <div className="w-7 h-7 rounded-md bg-primary/80 text-white flex items-center justify-center font-medium text-sm">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-foreground truncate">
                John Doe's Workspace
              </h4>
            </div>
            <button className="p-1 rounded-md hover:bg-muted">
              <Settings size={14} className="text-muted-foreground" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
