"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getHabitsTracker, toggleHabitCompletion } from "@/actions/Habits";
import Link from "next/link";

export default function Habits() {
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    const habitsData = await getHabitsTracker();
    setHabits(habitsData);
  };

  const handleToggleHabit = async (habitId, date, currentStatus) => {
    await toggleHabitCompletion(habitId, date, !currentStatus);
    loadHabits();
  };

  return (
    <div className="min-h-screen p-6 lg:ml-64 bg-background">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Habits</h1>
        <p className="text-muted-foreground mt-2">
          Build consistency with daily habit tracking
        </p>
      </header>

      <div className="bg-card rounded-xl shadow-sm p-8 mb-8 border">
        <div className="mb-8 flex flex-wrap justify-between items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-card-foreground">
              Today's Habits
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Track your daily progress
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg">
                + New Habit
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card">
              <DialogHeader>
                <DialogTitle className="text-card-foreground">
                  Create New Habit
                </DialogTitle>
              </DialogHeader>
              {/* Add your habit creation form here */}
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {habits.map((habit) => (
            <div
              key={habit.habitId}
              className="p-6 border rounded-xl bg-accent/50 hover:bg-accent/70 transition-all duration-200"
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 pt-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className={`w-12 h-12 rounded-full transition-all duration-200 ${
                      habit.isCompleted
                        ? "bg-primary/20 text-primary border-primary/30"
                        : "bg-muted text-muted-foreground hover:bg-muted/70"
                    }`}
                    onClick={() =>
                      handleToggleHabit(
                        habit.habitId,
                        habit.date,
                        habit.isCompleted
                      )
                    }
                  >
                    {habit.isCompleted ? "✓" : ""}
                  </Button>
                </div>
                <div className="flex-1 space-y-2">
                  <div>
                    <h3 className="text-lg font-semibold text-card-foreground">
                      {habit.habit.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {habit.habit.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                      {habit.habit.frequency}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Created{" "}
                      {new Date(habit.habit.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card rounded-xl shadow-sm p-8 border">
          <h2 className="text-xl font-semibold mb-6 text-card-foreground">
            Habit Progress
          </h2>
          <div className="space-y-6">
            {habits.map((habit) => (
              <div key={habit.habitId} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-card-foreground">
                    {habit.habit.title}
                  </span>
                  <span
                    className={`text-sm ${
                      habit.isCompleted
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {habit.isCompleted ? "Completed" : "Not completed"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
