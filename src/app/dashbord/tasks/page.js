"use client";

import Link from "next/link";

export default function Tasks() {
  return (
    <div className="min-h-screen p-6 lg:ml-64">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your daily tasks
        </p>
      </header>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
        <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
          <div>
            <h2 className="text-lg font-semibold">All Tasks</h2>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium">
              Filter
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
              + New Task
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {/* Sample tasks */}
          {[
            {
              id: 1,
              title: "Complete project proposal",
              deadline: "Today, 5:00 PM",
              priority: "High",
              completed: false,
            },
            {
              id: 2,
              title: "Review team feedback",
              deadline: "Tomorrow, 10:00 AM",
              priority: "Medium",
              completed: false,
            },
            {
              id: 3,
              title: "Schedule client meeting",
              deadline: "Sep 15, 2:00 PM",
              priority: "Low",
              completed: true,
            },
            {
              id: 4,
              title: "Update documentation",
              deadline: "Sep 18, 4:00 PM",
              priority: "Medium",
              completed: false,
            },
          ].map((task) => (
            <div
              key={task.id}
              className={`p-4 border ${
                task.completed
                  ? "border-gray-200 bg-gray-50"
                  : "border-gray-200"
              } dark:border-gray-700 dark:bg-gray-800 rounded-lg flex items-center gap-4`}
            >
              <input
                type="checkbox"
                checked={task.completed}
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                readOnly
              />
              <div className="flex-1">
                <p
                  className={`font-medium ${
                    task.completed ? "line-through text-gray-500" : ""
                  }`}
                >
                  {task.title}
                </p>
                <p className="text-sm text-gray-500">Due: {task.deadline}</p>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  task.priority === "High"
                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    : task.priority === "Medium"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                    : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                }`}
              >
                {task.priority}
              </span>
              <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                ⋮
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Upcoming Deadlines</h2>
          <div className="space-y-3">
            {[
              { title: "Complete project proposal", date: "Today" },
              { title: "Review team feedback", date: "Tomorrow" },
              { title: "Schedule client meeting", date: "Sep 15" },
              { title: "Update documentation", date: "Sep 18" },
            ].map((task, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
              >
                <span>{task.title}</span>
                <span className="text-sm text-gray-500">{task.date}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Task Completion</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-medium">Today</span>
                <span className="text-sm text-gray-500">3/5 tasks</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: "60%" }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="font-medium">This Week</span>
                <span className="text-sm text-gray-500">12/20 tasks</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: "60%" }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="font-medium">This Month</span>
                <span className="text-sm text-gray-500">45/80 tasks</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: "56%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
