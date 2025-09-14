"use client";

import { useState, useEffect } from "react";
import {
  getAllGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} from "@/actions/Goals";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  format,
  formatDistanceToNow,
  isAfter,
  addDays,
  differenceInDays,
} from "date-fns";
import {
  PlusIcon,
  TargetIcon,
  CalendarIcon,
  ChevronRightIcon,
  TrashIcon,
  EditIcon,
  MoreVerticalIcon,
  CheckCircleIcon,
  ClockIcon,
  SearchIcon,
  TrophyIcon,
  AlertCircleIcon,
} from "lucide-react";

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentGoal, setCurrentGoal] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Goal form state
  const [goalForm, setGoalForm] = useState({
    title: "",
    description: "",
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default: 30 days from now
    isAchieved: false,
  });

  // Load goals on component mount
  useEffect(() => {
    loadGoals();
  }, []);

  // Load goals from the server
  const loadGoals = async () => {
    setIsLoading(true);
    try {
      const data = await getAllGoals();
      setGoals(data);
    } catch (error) {
      console.error("Failed to load goals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle goal creation
  const handleCreateGoal = async (e) => {
    e.preventDefault();

    try {
      await createGoal(goalForm);
      resetForm();
      loadGoals();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to create goal:", error);
    }
  };

  // Handle goal update
  const handleUpdateGoal = async (e) => {
    e.preventDefault();

    try {
      await updateGoal(currentGoal.id, goalForm);
      resetForm();
      loadGoals();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to update goal:", error);
    }
  };

  // Handle goal deletion
  const handleDeleteGoal = async (id) => {
    if (confirm("Are you sure you want to delete this goal?")) {
      try {
        await deleteGoal(id);
        loadGoals();
      } catch (error) {
        console.error("Failed to delete goal:", error);
      }
    }
  };

  // Handle marking a goal as achieved
  const handleToggleGoalAchievement = async (goal) => {
    try {
      await updateGoal(goal.id, {
        ...goal,
        isAchieved: !goal.isAchieved,
      });
      loadGoals();
    } catch (error) {
      console.error("Failed to update goal achievement status:", error);
    }
  };

  // Reset form state
  const resetForm = () => {
    setGoalForm({
      title: "",
      description: "",
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isAchieved: false,
    });
  };

  // Open create goal dialog
  const openCreateDialog = () => {
    setCurrentGoal(null);
    resetForm();
    setIsDialogOpen(true);
  };

  // Open edit goal dialog
  const openEditDialog = (goal) => {
    setCurrentGoal(goal);
    setGoalForm({
      title: goal.title,
      description: goal.description,
      deadline: new Date(goal.deadline),
      isAchieved: goal.isAchieved,
    });
    setIsDialogOpen(true);
  };

  // Filter goals based on active filter and search query
  const getFilteredGoals = () => {
    return goals.filter((goal) => {
      // Search filter
      const matchesSearch =
        goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        goal.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      if (activeFilter === "achieved" && !goal.isAchieved) return false;
      if (activeFilter === "inProgress" && goal.isAchieved) return false;
      if (
        activeFilter === "upcoming" &&
        isAfter(new Date(), addDays(new Date(goal.deadline), -7))
      )
        return false;
      if (
        activeFilter === "dueToday" &&
        differenceInDays(new Date(goal.deadline), new Date()) !== 0
      )
        return false;
      if (
        activeFilter === "overdue" &&
        (!isAfter(new Date(), new Date(goal.deadline)) || goal.isAchieved)
      )
        return false;

      return matchesSearch;
    });
  };

  // Calculate goal stats
  const getGoalStats = () => {
    const totalGoals = goals.length;
    const achievedGoals = goals.filter((goal) => goal.isAchieved).length;
    const inProgressGoals = goals.filter((goal) => !goal.isAchieved).length;
    const overdueGoals = goals.filter(
      (goal) => !goal.isAchieved && isAfter(new Date(), new Date(goal.deadline))
    ).length;
    const upcomingDeadlines = goals.filter(
      (goal) =>
        !goal.isAchieved &&
        !isAfter(new Date(), new Date(goal.deadline)) &&
        isAfter(addDays(new Date(), 7), new Date(goal.deadline))
    ).length;

    return {
      total: totalGoals,
      achieved: achievedGoals,
      inProgress: inProgressGoals,
      overdue: overdueGoals,
      upcoming: upcomingDeadlines,
      achievementRate:
        totalGoals > 0 ? Math.round((achievedGoals / totalGoals) * 100) : 0,
    };
  };

  // Get goal status badge
  const getGoalStatusBadge = (goal) => {
    if (goal.isAchieved) {
      return (
        <Badge className="bg-green-500/20 text-green-600 hover:bg-green-500/20">
          Achieved
        </Badge>
      );
    } else if (isAfter(new Date(), new Date(goal.deadline))) {
      return (
        <Badge className="bg-red-500/20 text-red-600 hover:bg-red-500/20">
          Overdue
        </Badge>
      );
    } else if (differenceInDays(new Date(goal.deadline), new Date()) === 0) {
      return (
        <Badge className="bg-orange-500/20 text-orange-600 hover:bg-orange-500/20">
          Due Today
        </Badge>
      );
    } else if (differenceInDays(new Date(goal.deadline), new Date()) <= 7) {
      return (
        <Badge className="bg-yellow-500/20 text-yellow-600 hover:bg-yellow-500/20">
          Due Soon
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-blue-500/20 text-blue-600 hover:bg-blue-500/20">
          In Progress
        </Badge>
      );
    }
  };

  // Calculate time until deadline
  const calculateTimeUntilDeadline = (deadline) => {
    const deadlineDate = new Date(deadline);
    if (isAfter(new Date(), deadlineDate)) {
      return "Overdue";
    }
    return formatDistanceToNow(deadlineDate, { addSuffix: true });
  };

  // Get a goal's progress percentage (mock implementation - in real app you might track milestones)
  const getGoalProgress = (goal) => {
    if (goal.isAchieved) return 100;

    const totalDuration = differenceInDays(
      new Date(goal.deadline),
      new Date(goal.createdAt)
    );
    const elapsed = differenceInDays(new Date(), new Date(goal.createdAt));

    if (totalDuration <= 0) return 0;
    const progress = Math.min(Math.round((elapsed / totalDuration) * 100), 100);
    return progress;
  };

  const goalStats = getGoalStats();
  const filteredGoals = getFilteredGoals();

  // Get upcoming goals
  const getUpcomingGoals = () => {
    return goals
      .filter(
        (goal) =>
          !goal.isAchieved && !isAfter(new Date(), new Date(goal.deadline))
      )
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, 5);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Goals</h1>
          <p className="text-muted-foreground">
            Set, track, and achieve your personal goals
          </p>
        </div>
        <Button
          onClick={openCreateDialog}
          className="bg-primary hover:bg-primary/90 text-white flex gap-2"
        >
          <PlusIcon size={16} /> New Goal
        </Button>
      </div>

      {/* Goal Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Achievement Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">
                {goalStats.achievementRate}%
              </div>
              <div className="bg-green-500/10 p-1.5 rounded-full">
                <TrophyIcon className="h-4 w-4 text-green-500" />
              </div>
            </div>
            <Progress value={goalStats.achievementRate} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {goalStats.achieved} of {goalStats.total} goals achieved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">{goalStats.inProgress}</div>
              <div className="bg-blue-500/10 p-1.5 rounded-full">
                <TargetIcon className="h-4 w-4 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">{goalStats.upcoming}</div>
              <div className="bg-yellow-500/10 p-1.5 rounded-full">
                <CalendarIcon className="h-4 w-4 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overdue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">{goalStats.overdue}</div>
              <div className="bg-red-500/10 p-1.5 rounded-full">
                <AlertCircleIcon className="h-4 w-4 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Goals List */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-xl border shadow-sm">
            <div className="p-4 border-b flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:w-64">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search goals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Tabs
                value={activeFilter}
                onValueChange={setActiveFilter}
                className="w-full sm:w-auto"
              >
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="inProgress">In Progress</TabsTrigger>
                  <TabsTrigger value="achieved">Achieved</TabsTrigger>
                  <TabsTrigger value="overdue">Overdue</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {isLoading ? (
              <div className="p-8 text-center">
                <p>Loading goals...</p>
              </div>
            ) : filteredGoals.length > 0 ? (
              <div className="divide-y">
                {filteredGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className="p-4 hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id={`goal-${goal.id}`}
                          checked={goal.isAchieved}
                          onCheckedChange={() =>
                            handleToggleGoalAchievement(goal)
                          }
                          className="mt-1"
                        />
                        <div>
                          <h3
                            className={`font-medium text-lg ${
                              goal.isAchieved
                                ? "line-through text-muted-foreground"
                                : ""
                            }`}
                          >
                            {goal.title}
                          </h3>
                          <p className="text-muted-foreground mt-1 text-sm line-clamp-2">
                            {goal.description}
                          </p>
                          <div className="flex flex-wrap gap-3 mt-3">
                            <div className="flex items-center text-xs text-muted-foreground gap-1">
                              <CalendarIcon className="h-3 w-3" />
                              <span>
                                Deadline:{" "}
                                {format(
                                  new Date(goal.deadline),
                                  "MMM dd, yyyy"
                                )}
                              </span>
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground gap-1">
                              <ClockIcon className="h-3 w-3" />
                              <span>
                                {calculateTimeUntilDeadline(goal.deadline)}
                              </span>
                            </div>
                            <div>{getGoalStatusBadge(goal)}</div>
                          </div>
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreVerticalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => openEditDialog(goal)}
                          >
                            <EditIcon className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleGoalAchievement(goal)}
                            className={
                              goal.isAchieved
                                ? "text-blue-600"
                                : "text-green-600"
                            }
                          >
                            <CheckCircleIcon className="mr-2 h-4 w-4" />
                            Mark as{" "}
                            {goal.isAchieved ? "Not Achieved" : "Achieved"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteGoal(goal.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <TrashIcon className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {!goal.isAchieved && (
                      <div className="ml-10 mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>{getGoalProgress(goal)}%</span>
                        </div>
                        <Progress
                          value={getGoalProgress(goal)}
                          className="h-2"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="bg-muted/30 inline-flex p-3 rounded-full">
                  <TargetIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mt-4 font-medium">No goals found</h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  {searchQuery || activeFilter !== "all"
                    ? "Try different search terms or filters"
                    : "Create your first goal to get started"}
                </p>
                <Button
                  variant="outline"
                  onClick={openCreateDialog}
                  className="mt-4"
                >
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Create Goal
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar with Upcoming Goals and Tips */}
        <div className="space-y-6">
          {/* Upcoming Goals */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-md">Upcoming Deadlines</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-4">
              {getUpcomingGoals().length > 0 ? (
                <div className="space-y-4">
                  {getUpcomingGoals().map((goal) => (
                    <div
                      key={`upcoming-${goal.id}`}
                      className="flex items-start justify-between py-2"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-2 h-2 mt-2 rounded-full ${
                            differenceInDays(
                              new Date(goal.deadline),
                              new Date()
                            ) <= 3
                              ? "bg-red-500"
                              : differenceInDays(
                                  new Date(goal.deadline),
                                  new Date()
                                ) <= 7
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                          }`}
                        ></div>
                        <div>
                          <p className="font-medium line-clamp-1">
                            {goal.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(goal.deadline), "MMM dd")} •{" "}
                            {calculateTimeUntilDeadline(goal.deadline)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleToggleGoalAchievement(goal)}
                      >
                        <CheckCircleIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No upcoming goals</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Goal Setting Tips */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-md">Goal Setting Tips</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-4">
              <ul className="space-y-3 text-sm">
                <li className="flex gap-2">
                  <ChevronRightIcon className="h-4 w-4 text-primary mt-0.5" />
                  <span>
                    Set SMART goals: Specific, Measurable, Achievable, Relevant,
                    and Time-bound
                  </span>
                </li>
                <li className="flex gap-2">
                  <ChevronRightIcon className="h-4 w-4 text-primary mt-0.5" />
                  <span>Break down large goals into smaller milestones</span>
                </li>
                <li className="flex gap-2">
                  <ChevronRightIcon className="h-4 w-4 text-primary mt-0.5" />
                  <span>Review your goals regularly and adjust as needed</span>
                </li>
                <li className="flex gap-2">
                  <ChevronRightIcon className="h-4 w-4 text-primary mt-0.5" />
                  <span>Celebrate your achievements, no matter how small</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Goal Dialog (Create/Edit) */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentGoal ? "Edit Goal" : "Create New Goal"}
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={currentGoal ? handleUpdateGoal : handleCreateGoal}
            className="space-y-4"
          >
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Goal Title
              </label>
              <Input
                placeholder="Enter goal title"
                value={goalForm.title}
                onChange={(e) =>
                  setGoalForm({ ...goalForm, title: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Target Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {goalForm.deadline
                      ? format(goalForm.deadline, "PPP")
                      : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={goalForm.deadline}
                    onSelect={(date) =>
                      setGoalForm({ ...goalForm, deadline: date })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Description
              </label>
              <Textarea
                placeholder="Describe your goal and why it's important..."
                value={goalForm.description}
                onChange={(e) =>
                  setGoalForm({ ...goalForm, description: e.target.value })
                }
                className="resize-none"
                rows={4}
                required
              />
            </div>

            {currentGoal && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="goal-achieved"
                  checked={goalForm.isAchieved}
                  onCheckedChange={(checked) =>
                    setGoalForm({ ...goalForm, isAchieved: !!checked })
                  }
                />
                <label
                  htmlFor="goal-achieved"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Mark goal as achieved
                </label>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                {currentGoal ? "Update Goal" : "Create Goal"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
