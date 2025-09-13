"use client";

import { useState, useEffect } from "react";
import {
  getAllTasks,
  createTask,
  deleteTask,
  updateTask,
} from "@/actions/Tasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  format,
  parseISO,
  isToday,
  isTomorrow,
  isThisWeek,
  isThisMonth,
} from "date-fns";
import {
  PlusIcon,
  CheckIcon,
  ClockIcon,
  CalendarIcon,
  MoreVerticalIcon,
  FilterIcon,
  AlertCircleIcon,
  TrashIcon,
  EditIcon,
  ArrowUpCircleIcon,
  ArrowRightCircleIcon,
  ArrowDownCircleIcon,
} from "lucide-react";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [activePriorityFilter, setActivePriorityFilter] = useState("all");

  // Task form state
  const [taskForm, setTaskForm] = useState({
    title: "",
    date: new Date(),
    startAt: format(new Date().setHours(9, 0, 0), "HH:mm"),
    endAt: format(new Date().setHours(10, 0, 0), "HH:mm"),
    priority: "medium",
    description: "",
  });

  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  // Load tasks from the server
  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const data = await getAllTasks();
      setTasks(data);
    } catch (error) {
      console.error("Failed to load tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle task creation
  const handleCreateTask = async (e) => {
    e.preventDefault();

    try {
      const startDateTime = new Date(taskForm.date);
      const [startHours, startMinutes] = taskForm.startAt
        .split(":")
        .map(Number);
      startDateTime.setHours(startHours, startMinutes);

      const endDateTime = new Date(taskForm.date);
      const [endHours, endMinutes] = taskForm.endAt.split(":").map(Number);
      endDateTime.setHours(endHours, endMinutes);

      await createTask({
        title: taskForm.title,
        date: taskForm.date,
        startAt: startDateTime,
        endAt: endDateTime,
        priority: taskForm.priority,
        description: taskForm.description || "",
      });

      resetForm();
      loadTasks();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  // Handle task update
  const handleUpdateTask = async (e) => {
    e.preventDefault();

    try {
      const startDateTime = new Date(taskForm.date);
      const [startHours, startMinutes] = taskForm.startAt
        .split(":")
        .map(Number);
      startDateTime.setHours(startHours, startMinutes);

      const endDateTime = new Date(taskForm.date);
      const [endHours, endMinutes] = taskForm.endAt.split(":").map(Number);
      endDateTime.setHours(endHours, endMinutes);

      await updateTask(currentTask.id, {
        title: taskForm.title,
        date: taskForm.date,
        startAt: startDateTime,
        endAt: endDateTime,
        priority: taskForm.priority,
        description: taskForm.description || "",
      });

      resetForm();
      loadTasks();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (id) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(id);
        loadTasks();
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    }
  };

  // Handle task completion toggle
  const handleToggleTaskCompletion = async (task) => {
    try {
      await updateTask(task.id, {
        ...task,
        isDone: !task.isDone,
      });
      loadTasks();
    } catch (error) {
      console.error("Failed to update task completion:", error);
    }
  };

  // Reset form state
  const resetForm = () => {
    setTaskForm({
      title: "",
      date: new Date(),
      startAt: format(new Date().setHours(9, 0, 0), "HH:mm"),
      endAt: format(new Date().setHours(10, 0, 0), "HH:mm"),
      priority: "medium",
      description: "",
    });
  };

  // Open create task dialog
  const openCreateDialog = () => {
    setCurrentTask(null);
    resetForm();
    setIsDialogOpen(true);
  };

  // Open edit task dialog
  const openEditDialog = (task) => {
    setCurrentTask(task);

    // Format the date for form
    const startDateTime = new Date(task.StartsAt);
    const endDateTime = new Date(task.EndsAt);

    setTaskForm({
      title: task.title,
      date: startDateTime,
      startAt: format(startDateTime, "HH:mm"),
      endAt: format(endDateTime, "HH:mm"),
      priority: task.priority || "medium",
      description: task.description || "",
    });

    setIsDialogOpen(true);
  };

  // Filter tasks based on status and time
  const getFilteredTasks = () => {
    return tasks.filter((task) => {
      const taskDate = new Date(task.StartsAt);

      // Status filter
      if (activeFilter === "completed" && !task.isDone) return false;
      if (activeFilter === "pending" && task.isDone) return false;

      // Priority filter
      if (
        activePriorityFilter !== "all" &&
        task.priority !== activePriorityFilter
      )
        return false;

      // Time filter
      if (activeFilter === "today" && !isToday(taskDate)) return false;
      if (activeFilter === "tomorrow" && !isTomorrow(taskDate)) return false;
      if (
        activeFilter === "upcoming" &&
        (isToday(taskDate) || isTomorrow(taskDate))
      )
        return false;

      return true;
    });
  };

  // Get task count by status
  const getTaskCounts = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.isDone).length;

    const todayTasks = tasks.filter((task) =>
      isToday(new Date(task.StartsAt))
    ).length;
    const todayCompleted = tasks.filter(
      (task) => isToday(new Date(task.StartsAt)) && task.isDone
    ).length;

    const weekTasks = tasks.filter((task) =>
      isThisWeek(new Date(task.StartsAt))
    ).length;
    const weekCompleted = tasks.filter(
      (task) => isThisWeek(new Date(task.StartsAt)) && task.isDone
    ).length;

    const monthTasks = tasks.filter((task) =>
      isThisMonth(new Date(task.StartsAt))
    ).length;
    const monthCompleted = tasks.filter(
      (task) => isThisMonth(new Date(task.StartsAt)) && task.isDone
    ).length;

    return {
      total: totalTasks,
      completed: completedTasks,
      todayTotal: todayTasks,
      todayCompleted,
      weekTotal: weekTasks,
      weekCompleted,
      monthTotal: monthTasks,
      monthCompleted,
    };
  };

  // Format due date for display
  const formatDueDate = (dateString) => {
    const date = new Date(dateString);

    if (isToday(date)) {
      return `Today, ${format(date, "h:mm a")}`;
    } else if (isTomorrow(date)) {
      return `Tomorrow, ${format(date, "h:mm a")}`;
    } else {
      return format(date, "MMM d, h:mm a");
    }
  };

  // Get priority class names
  const getPriorityClasses = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  // Get priority icon
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high":
        return <ArrowUpCircleIcon className="h-4 w-4" />;
      case "medium":
        return <ArrowRightCircleIcon className="h-4 w-4" />;
      case "low":
        return <ArrowDownCircleIcon className="h-4 w-4" />;
      default:
        return null;
    }
  };

  // Get upcoming tasks
  const getUpcomingDeadlines = () => {
    return tasks
      .filter((task) => !task.isDone)
      .sort((a, b) => new Date(a.StartsAt) - new Date(b.StartsAt))
      .slice(0, 5);
  };

  const taskCounts = getTaskCounts();
  const filteredTasks = getFilteredTasks();

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">
            Organize and manage your daily tasks
          </p>
        </div>
        <Button
          onClick={openCreateDialog}
          className="bg-primary hover:bg-primary/90 text-white flex gap-2"
        >
          <PlusIcon size={16} /> New Task
        </Button>
      </div>

      {/* Task Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card rounded-xl p-4 border shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Total Tasks</p>
              <h3 className="text-2xl font-bold mt-1">{taskCounts.total}</h3>
            </div>
            <div className="bg-primary/10 p-2 rounded-full">
              <CheckIcon className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xs text-muted-foreground flex justify-between mb-1">
              <span>Progress</span>
              <span>
                {taskCounts.completed}/{taskCounts.total}
              </span>
            </div>
            <div className="h-2 bg-secondary/30 rounded-full">
              <div
                className="h-full bg-primary rounded-full"
                style={{
                  width:
                    taskCounts.total > 0
                      ? `${(taskCounts.completed / taskCounts.total) * 100}%`
                      : "0%",
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-4 border shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Today</p>
              <h3 className="text-2xl font-bold mt-1">
                {taskCounts.todayTotal}
              </h3>
            </div>
            <div className="bg-blue-500/10 p-2 rounded-full">
              <CalendarIcon className="h-5 w-5 text-blue-500" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xs text-muted-foreground flex justify-between mb-1">
              <span>Completed</span>
              <span>
                {taskCounts.todayCompleted}/{taskCounts.todayTotal}
              </span>
            </div>
            <div className="h-2 bg-secondary/30 rounded-full">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{
                  width:
                    taskCounts.todayTotal > 0
                      ? `${
                          (taskCounts.todayCompleted / taskCounts.todayTotal) *
                          100
                        }%`
                      : "0%",
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-4 border shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">This Week</p>
              <h3 className="text-2xl font-bold mt-1">
                {taskCounts.weekTotal}
              </h3>
            </div>
            <div className="bg-purple-500/10 p-2 rounded-full">
              <ClockIcon className="h-5 w-5 text-purple-500" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xs text-muted-foreground flex justify-between mb-1">
              <span>Completed</span>
              <span>
                {taskCounts.weekCompleted}/{taskCounts.weekTotal}
              </span>
            </div>
            <div className="h-2 bg-secondary/30 rounded-full">
              <div
                className="h-full bg-purple-500 rounded-full"
                style={{
                  width:
                    taskCounts.weekTotal > 0
                      ? `${
                          (taskCounts.weekCompleted / taskCounts.weekTotal) *
                          100
                        }%`
                      : "0%",
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-4 border shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">This Month</p>
              <h3 className="text-2xl font-bold mt-1">
                {taskCounts.monthTotal}
              </h3>
            </div>
            <div className="bg-emerald-500/10 p-2 rounded-full">
              <CalendarIcon className="h-5 w-5 text-emerald-500" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xs text-muted-foreground flex justify-between mb-1">
              <span>Completed</span>
              <span>
                {taskCounts.monthCompleted}/{taskCounts.monthTotal}
              </span>
            </div>
            <div className="h-2 bg-secondary/30 rounded-full">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{
                  width:
                    taskCounts.monthTotal > 0
                      ? `${
                          (taskCounts.monthCompleted / taskCounts.monthTotal) *
                          100
                        }%`
                      : "0%",
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Task Filters */}
          <div className="bg-card rounded-xl border shadow-sm mb-6">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-semibold">Task List</h2>

              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex gap-1">
                      <FilterIcon size={14} />
                      <span>Priority</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => setActivePriorityFilter("all")}
                      className={
                        activePriorityFilter === "all" ? "bg-primary/10" : ""
                      }
                    >
                      All Priorities
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setActivePriorityFilter("high")}
                      className={
                        activePriorityFilter === "high" ? "bg-primary/10" : ""
                      }
                    >
                      <ArrowUpCircleIcon className="h-4 w-4 mr-2 text-red-500" />
                      High Priority
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setActivePriorityFilter("medium")}
                      className={
                        activePriorityFilter === "medium" ? "bg-primary/10" : ""
                      }
                    >
                      <ArrowRightCircleIcon className="h-4 w-4 mr-2 text-yellow-500" />
                      Medium Priority
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setActivePriorityFilter("low")}
                      className={
                        activePriorityFilter === "low" ? "bg-primary/10" : ""
                      }
                    >
                      <ArrowDownCircleIcon className="h-4 w-4 mr-2 text-green-500" />
                      Low Priority
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="w-full justify-start rounded-none px-4 pt-2 pb-0 h-auto bg-transparent border-b">
                <TabsTrigger
                  value="all"
                  onClick={() => setActiveFilter("all")}
                  className="rounded-t-lg rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="today"
                  onClick={() => setActiveFilter("today")}
                  className="rounded-t-lg rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
                >
                  Today
                </TabsTrigger>
                <TabsTrigger
                  value="tomorrow"
                  onClick={() => setActiveFilter("tomorrow")}
                  className="rounded-t-lg rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
                >
                  Tomorrow
                </TabsTrigger>
                <TabsTrigger
                  value="upcoming"
                  onClick={() => setActiveFilter("upcoming")}
                  className="rounded-t-lg rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
                >
                  Upcoming
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  onClick={() => setActiveFilter("completed")}
                  className="rounded-t-lg rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
                >
                  Completed
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="p-0 m-0">
                <div className="p-4 space-y-2">
                  {isLoading ? (
                    <div className="flex justify-center p-8">
                      <p>Loading tasks...</p>
                    </div>
                  ) : filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`p-4 border ${
                          task.isDone ? "bg-muted/40" : "bg-card"
                        } rounded-lg flex items-center gap-3`}
                      >
                        <Checkbox
                          id={`task-${task.id}`}
                          checked={task.isDone}
                          onCheckedChange={() =>
                            handleToggleTaskCompletion(task)
                          }
                          className="h-5 w-5"
                        />
                        <div className="flex-1">
                          <label
                            htmlFor={`task-${task.id}`}
                            className={`font-medium cursor-pointer ${
                              task.isDone
                                ? "line-through text-muted-foreground"
                                : ""
                            }`}
                          >
                            {task.title}
                          </label>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="flex items-center text-xs text-muted-foreground gap-1">
                              <ClockIcon className="h-3 w-3" />
                              {formatDueDate(task.StartsAt)}
                            </span>
                            {task.priority && (
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityClasses(
                                  task.priority
                                )}`}
                              >
                                {getPriorityIcon(task.priority)}
                                {task.priority.charAt(0).toUpperCase() +
                                  task.priority.slice(1)}
                              </span>
                            )}
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
                              onClick={() => openEditDialog(task)}
                            >
                              <EditIcon className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteTask(task.id)}
                              className="text-red-500 focus:text-red-500"
                            >
                              <TrashIcon className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="bg-muted/30 inline-flex p-3 rounded-full">
                        <CheckIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="mt-4 font-medium">No tasks found</h3>
                      <p className="text-muted-foreground mt-1 text-sm">
                        {activeFilter !== "all" ||
                        activePriorityFilter !== "all"
                          ? "Try changing your filters"
                          : "You have no tasks yet. Create one to get started!"}
                      </p>
                      <Button
                        variant="outline"
                        onClick={openCreateDialog}
                        className="mt-4"
                      >
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Add New Task
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="today" className="p-0 m-0">
                {/* Content shown based on filter state */}
              </TabsContent>

              <TabsContent value="tomorrow" className="p-0 m-0">
                {/* Content shown based on filter state */}
              </TabsContent>

              <TabsContent value="upcoming" className="p-0 m-0">
                {/* Content shown based on filter state */}
              </TabsContent>

              <TabsContent value="completed" className="p-0 m-0">
                {/* Content shown based on filter state */}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right sidebar */}
        <div>
          {/* Upcoming deadlines */}
          <div className="bg-card rounded-xl border shadow-sm mb-6">
            <div className="p-4 border-b">
              <h2 className="font-semibold">Upcoming Deadlines</h2>
            </div>
            <div className="p-4">
              {getUpcomingDeadlines().length > 0 ? (
                <div className="space-y-3">
                  {getUpcomingDeadlines().map((task) => (
                    <div
                      key={task.id}
                      className="flex items-start justify-between py-2 border-b border-muted/40 last:border-b-0"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-2 h-2 mt-2 rounded-full ${
                            task.priority === "high"
                              ? "bg-red-500"
                              : task.priority === "medium"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                        ></div>
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDueDate(task.StartsAt)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleToggleTaskCompletion(task)}
                      >
                        <CheckIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No upcoming deadlines</p>
                </div>
              )}
            </div>
          </div>

          {/* Mini calendar */}
          <div className="bg-card rounded-xl border shadow-sm mb-6">
            <div className="p-4 border-b">
              <h2 className="font-semibold">Calendar</h2>
            </div>
            <div className="p-4">
              <Calendar
                mode="single"
                selected={new Date()}
                className="rounded-md border"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Task Dialog (Create/Edit) */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentTask ? "Edit Task" : "Create New Task"}
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={currentTask ? handleUpdateTask : handleCreateTask}
            className="space-y-4"
          >
            <div>
              <Input
                placeholder="Task Title"
                value={taskForm.title}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, title: e.target.value })
                }
                className="border-none text-lg font-medium px-0 shadow-none focus-visible:ring-0"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {taskForm.date
                        ? format(taskForm.date, "PPP")
                        : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={taskForm.date}
                      onSelect={(date) => setTaskForm({ ...taskForm, date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  Priority
                </label>
                <Select
                  value={taskForm.priority}
                  onValueChange={(priority) =>
                    setTaskForm({ ...taskForm, priority })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                        High
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                        Medium
                      </div>
                    </SelectItem>
                    <SelectItem value="low">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Low
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  Start Time
                </label>
                <Input
                  type="time"
                  value={taskForm.startAt}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, startAt: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  End Time
                </label>
                <Input
                  type="time"
                  value={taskForm.endAt}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, endAt: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Description (Optional)
              </label>
              <Textarea
                placeholder="Add more details about this task..."
                value={taskForm.description}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, description: e.target.value })
                }
                className="resize-none"
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {currentTask ? "Update Task" : "Create Task"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
