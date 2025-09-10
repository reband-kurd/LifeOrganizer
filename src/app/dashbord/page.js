"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Sidebar Component
const Sidebar = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    { name: "Dashboard", icon: "dashboard", href: "/dashbord" },
    { name: "Tasks", icon: "task", href: "/dashbord/tasks" },
    { name: "Habits", icon: "habit", href: "/dashbord/habits" },
    { name: "Notes", icon: "notes", href: "/dashbord/notes" },
    { name: "Events", icon: "event", href: "/dashbord/events" },
    { name: "Goals", icon: "goal", href: "/dashbord/goals" },
    { name: "Journals", icon: "journal", href: "/dashbord/journals" },
    { name: "Projects", icon: "project", href: "/dashbord/projects" },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50 transition-transform duration-300 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:z-10`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            LifeOrganizer
          </h1>
        </div>

        {/* Menu */}
        <nav className="mt-6 px-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <span className="flex items-center justify-center w-6 h-6">
                    {getIcon(item.icon)}
                  </span>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              JD
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                John Doe
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                john@example.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Dashboard content component
const DashboardContent = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: "Tasks", count: 12, color: "blue" },
          { title: "Habits", count: 8, color: "green" },
          { title: "Notes", count: 24, color: "amber" },
          { title: "Projects", count: 5, color: "purple" },
        ].map((stat) => (
          <div
            key={stat.title}
            className={`p-6 rounded-xl bg-white dark:bg-gray-800 shadow-sm border-l-4 border-${stat.color}-500`}
          >
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              {stat.title}
            </p>
            <p className="mt-2 text-3xl font-bold">{stat.count}</p>
          </div>
        ))}
      </div>

      {/* Today's Schedule */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Today's Schedule</h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="space-y-4">
            {[
              {
                time: "09:00 AM",
                title: "Morning Routine",
                category: "Habit",
                color: "green",
              },
              {
                time: "10:30 AM",
                title: "Project Meeting",
                category: "Event",
                color: "blue",
              },
              {
                time: "01:00 PM",
                title: "Lunch Break",
                category: "Task",
                color: "amber",
              },
              {
                time: "03:00 PM",
                title: "Weekly Review",
                category: "Task",
                color: "purple",
              },
            ].map((event, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 py-3 border-b last:border-b-0 border-gray-100 dark:border-gray-700"
              >
                <div className="text-sm text-gray-500 dark:text-gray-400 w-20">
                  {event.time}
                </div>
                <div
                  className={`w-2 h-2 rounded-full bg-${event.color}-500`}
                ></div>
                <div>
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {event.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities & Goal Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="space-y-4">
              {[
                {
                  title: "Added new task",
                  detail: "Complete project proposal",
                  time: "2 hours ago",
                },
                {
                  title: "Completed habit",
                  detail: "Morning meditation",
                  time: "4 hours ago",
                },
                {
                  title: "Created note",
                  detail: "Meeting notes with team",
                  time: "1 day ago",
                },
                {
                  title: "Updated project",
                  detail: "Website redesign progress",
                  time: "2 days ago",
                },
              ].map((activity, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 py-3 border-b last:border-b-0 border-gray-100 dark:border-gray-700"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center mt-1">
                    <span>✓</span>
                  </div>
                  <div>
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {activity.detail}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Goal Progress */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Goal Progress</h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="space-y-6">
              {[
                {
                  title: "Complete Website Redesign",
                  progress: 75,
                  daysLeft: 12,
                },
                {
                  title: "Read 20 Books This Year",
                  progress: 45,
                  daysLeft: 120,
                },
                { title: "Learn Spanish", progress: 30, daysLeft: 180 },
              ].map((goal, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{goal.title}</span>
                    <span className="text-sm text-gray-500">
                      {goal.progress}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-2">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {goal.daysLeft} days remaining
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get icons (simple text representation for now)
// You can replace these with actual SVG icons or an icon library
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

// Main Dashboard Page
export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex items-center justify-between h-16 px-4">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <span className="sr-only">Open menu</span>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Search */}
            <div className="hidden md:block flex-1 px-4 max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search..."
                />
              </div>
            </div>

            {/* Right Side Nav Items */}
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-full text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>
              <button className="p-2 rounded-full text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="pb-12">
          <DashboardContent />
        </main>
      </div>
    </div>
  );
}
