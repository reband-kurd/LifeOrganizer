"use client";

import Link from "next/link";

export default function Habits() {
  return (
    <div className="min-h-screen p-6 lg:ml-64">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Habits</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Build consistency with daily habit tracking
        </p>
      </header>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
        <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
          <div>
            <h2 className="text-lg font-semibold">Today's Habits</h2>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
              + New Habit
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {/* Sample habits */}
          {[
            {
              id: 1,
              title: "Morning Meditation",
              completed: true,
              streak: 7,
              time: "Morning",
            },
            {
              id: 2,
              title: "Read for 30 minutes",
              completed: false,
              streak: 12,
              time: "Evening",
            },
            {
              id: 3,
              title: "Exercise",
              completed: false,
              streak: 5,
              time: "Afternoon",
            },
            {
              id: 4,
              title: "Drink 8 glasses of water",
              completed: false,
              streak: 15,
              time: "Throughout day",
            },
          ].map((habit) => (
            <div
              key={habit.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center gap-4"
            >
              <div className="flex-shrink-0">
                <button
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    habit.completed
                      ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                      : "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-400"
                  }`}
                >
                  {habit.completed ? "✓" : ""}
                </button>
              </div>
              <div className="flex-1">
                <p className="font-medium">{habit.title}</p>
                <p className="text-sm text-gray-500">{habit.time}</p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {habit.streak} day streak
                </span>
                <span className="text-xs text-gray-500">
                  Best: {habit.streak + 5}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Weekly Overview</h2>
          <div className="grid grid-cols-7 gap-1">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
              <div
                key={idx}
                className="text-center font-medium text-sm text-gray-500 py-1"
              >
                {day}
              </div>
            ))}
            {Array.from({ length: 7 }).map((_, dayIdx) => (
              <div key={dayIdx} className="aspect-square">
                <div className="w-full h-full rounded-md flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700">
                  <span className="text-sm font-medium mb-1">{dayIdx + 1}</span>
                  <div className="flex gap-1">
                    {[...Array(Math.floor(Math.random() * 4))].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          [
                            "bg-green-500",
                            "bg-blue-500",
                            "bg-amber-500",
                            "bg-purple-500",
                          ][i % 4]
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Top Habits</h2>
          <div className="space-y-4">
            {[
              { title: "Morning Meditation", streak: 32, completion: 92 },
              { title: "Read for 30 minutes", streak: 24, completion: 85 },
              { title: "Exercise", streak: 18, completion: 75 },
              { title: "Drink 8 glasses of water", streak: 45, completion: 98 },
            ].map((habit, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{habit.title}</span>
                  <span className="text-sm text-gray-500">
                    {habit.completion}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-1">
                  <div
                    className="h-full bg-green-600 rounded-full"
                    style={{ width: `${habit.completion}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500">
                  {habit.streak} day streak
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
