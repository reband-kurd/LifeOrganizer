"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Mock API service (replace with real API calls later)
const fetchDashboardData = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    stats: {
      tasks: {
        total: 14,
        completed: 8,
        overdue: 2,
        upcoming: 4,
      },
      habits: {
        total: 9,
        streak: 12,
        completed: 6,
        rate: 87,
      },
      notes: {
        total: 32,
        recent: 5,
        pinned: 3,
      },
      projects: {
        total: 6,
        active: 3,
        completed: 2,
        onHold: 1,
      },
    },
    schedule: [
      {
        id: 1,
        time: "09:00 AM",
        title: "Morning Workout",
        category: "Habit",
        color: "green",
        completed: true,
      },
      {
        id: 2,
        time: "10:30 AM",
        title: "Client Meeting",
        category: "Event",
        color: "blue",
        location: "Zoom",
        completed: false,
      },
      {
        id: 3,
        time: "01:00 PM",
        title: "Lunch with Team",
        category: "Event",
        color: "amber",
        location: "Cafe Downtown",
        completed: false,
      },
      {
        id: 4,
        time: "03:00 PM",
        title: "Project Review",
        category: "Task",
        color: "purple",
        priority: "High",
        completed: false,
      },
      {
        id: 5,
        time: "05:30 PM",
        title: "Evening Reading",
        category: "Habit",
        color: "indigo",
        completed: false,
      },
    ],
    activities: [
      {
        id: 1,
        title: "Completed task",
        detail: "Website homepage redesign",
        time: "24 minutes ago",
        icon: "check-circle",
      },
      {
        id: 2,
        title: "Added new habit",
        detail: "Evening meditation practice",
        time: "2 hours ago",
        icon: "plus-circle",
      },
      {
        id: 3,
        title: "Updated project",
        detail: "Mobile app development timeline",
        time: "Yesterday at 4:30 PM",
        icon: "refresh",
      },
      {
        id: 4,
        title: "Created note",
        detail: "Ideas for the marketing campaign",
        time: "Yesterday at 2:15 PM",
        icon: "document",
      },
    ],
    goals: [
      {
        id: 1,
        title: "Launch Mobile App",
        progress: 68,
        daysLeft: 17,
        category: "Work",
      },
      {
        id: 2,
        title: "Read 25 Books This Year",
        progress: 52,
        daysLeft: 112,
        category: "Personal",
      },
      {
        id: 3,
        title: "Complete Advanced React Course",
        progress: 34,
        daysLeft: 45,
        category: "Education",
      },
    ],
  };
};

// Dashboard content component with real data
export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchDashboardData();
        setDashboardData(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load dashboard data");
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <h2 className="text-xl font-medium text-red-800 dark:text-red-200 mb-2">
            Something went wrong
          </h2>
          <p className="text-red-600 dark:text-red-300">{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, John!</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Here's what's happening with your tasks and goals today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 text-sm font-medium uppercase">
                Tasks
              </p>
              <p className="mt-1 text-3xl font-bold">
                {dashboardData.stats.tasks.total}
              </p>
            </div>
            <div className="p-2 bg-white/20 rounded-lg">
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
          </div>
          <div className="mt-3 flex space-x-4 text-sm">
            <p>
              <span className="font-medium">
                {dashboardData.stats.tasks.completed}
              </span>{" "}
              completed
            </p>
            <p>
              <span className="font-medium text-red-200">
                {dashboardData.stats.tasks.overdue}
              </span>{" "}
              overdue
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-green-100 text-sm font-medium uppercase">
                Habits
              </p>
              <p className="mt-1 text-3xl font-bold">
                {dashboardData.stats.habits.total}
              </p>
            </div>
            <div className="p-2 bg-white/20 rounded-lg">
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
          </div>
          <div className="mt-3 flex space-x-4 text-sm">
            <p>
              <span className="font-medium">
                {dashboardData.stats.habits.streak}
              </span>{" "}
              day streak
            </p>
            <p>
              <span className="font-medium">
                {dashboardData.stats.habits.rate}%
              </span>{" "}
              completion
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-amber-100 text-sm font-medium uppercase">
                Notes
              </p>
              <p className="mt-1 text-3xl font-bold">
                {dashboardData.stats.notes.total}
              </p>
            </div>
            <div className="p-2 bg-white/20 rounded-lg">
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-3 flex space-x-4 text-sm">
            <p>
              <span className="font-medium">
                {dashboardData.stats.notes.recent}
              </span>{" "}
              recent
            </p>
            <p>
              <span className="font-medium">
                {dashboardData.stats.notes.pinned}
              </span>{" "}
              pinned
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-purple-100 text-sm font-medium uppercase">
                Projects
              </p>
              <p className="mt-1 text-3xl font-bold">
                {dashboardData.stats.projects.total}
              </p>
            </div>
            <div className="p-2 bg-white/20 rounded-lg">
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
                  d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-3 flex space-x-4 text-sm">
            <p>
              <span className="font-medium">
                {dashboardData.stats.projects.active}
              </span>{" "}
              active
            </p>
            <p>
              <span className="font-medium">
                {dashboardData.stats.projects.completed}
              </span>{" "}
              completed
            </p>
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Today's Schedule</h2>
          <Link
            href="/dashbord/events"
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
          >
            View all
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          {dashboardData.schedule.length === 0 ? (
            <div className="text-center py-8">
              <svg
                className="w-12 h-12 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">
                No events scheduled for today
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Enjoy your free time or add a new event
              </p>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Add Event
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {dashboardData.schedule.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div
                    className={`min-w-[4rem] text-sm font-medium text-gray-900 dark:text-white`}
                  >
                    {event.time}
                  </div>
                  <div
                    className={`flex-shrink-0 w-1 h-12 bg-${event.color}-500 rounded-full`}
                  ></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3
                        className={`font-medium ${
                          event.completed
                            ? "line-through text-gray-500 dark:text-gray-400"
                            : "text-gray-900 dark:text-white"
                        }`}
                      >
                        {event.title}
                      </h3>
                      <div className="flex items-center">
                        {event.location && (
                          <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-md mr-2">
                            {event.location}
                          </span>
                        )}
                        {event.priority && (
                          <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 px-2 py-1 rounded-md mr-2">
                            {event.priority}
                          </span>
                        )}
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {event.category}
                    </p>
                  </div>
                </div>
              ))}
              <button className="w-full mt-2 py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500 dark:hover:border-blue-500 transition-colors flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add New Event
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activities & Goal Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Activities</h2>
            <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              View all
            </button>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="space-y-6">
              {dashboardData.activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    {activity.icon === "check-circle" && (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    )}
                    {activity.icon === "plus-circle" && (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    )}
                    {activity.icon === "refresh" && (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    )}
                    {activity.icon === "document" && (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {activity.title}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {activity.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Goal Progress */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Goal Progress</h2>
            <Link
              href="/dashbord/goals"
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View all
            </Link>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="space-y-6">
              {dashboardData.goals.map((goal) => (
                <div key={goal.id}>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {goal.title}
                      </h3>
                      <div className="flex items-center mt-1">
                        <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                          {goal.category}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                          {goal.daysLeft} days left
                        </span>
                      </div>
                    </div>
                    <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                      {goal.progress}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        goal.progress < 30
                          ? "bg-red-500"
                          : goal.progress < 70
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              <button className="w-full mt-2 py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500 dark:hover:border-blue-500 transition-colors flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add New Goal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
