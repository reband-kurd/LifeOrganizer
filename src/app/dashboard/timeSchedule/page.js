"use client";

import { useState, useEffect, Fragment } from "react";
import {
  getTimeSchedules,
  createTimeSchedule,
  deleteTimeSchedule,
  updateTimeSchedule,
} from "@/actions/TimeSchedule";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format, parse } from "date-fns";
import {
  PlusIcon,
  ClockIcon,
  CalendarIcon,
  MoreVerticalIcon,
  EditIcon,
  TrashIcon,
  SaveIcon,
  XIcon,
} from "lucide-react";

export default function TimeSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [activeView, setActiveView] = useState("week");

  // Schedule form state
  const [scheduleForm, setScheduleForm] = useState({
    title: "",
    description: "",
    startTime: "09:00",
    endTime: "10:00",
    dayOfWeek: "monday",
  });

  // Days of the week
  const daysOfWeek = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  // Time slots
  const timeSlots = [];
  for (let hour = 6; hour <= 22; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, "0")}:00`);
  }

  // Load schedules on component mount
  useEffect(() => {
    loadSchedules();
  }, []);

  // Load schedules from the server
  const loadSchedules = async () => {
    setIsLoading(true);
    try {
      const data = await getTimeSchedules();
      setSchedules(data);
    } catch (error) {
      console.error("Failed to load schedules:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle schedule creation
  const handleCreateSchedule = async (e) => {
    e.preventDefault();

    try {
      // Create a base date for today
      const baseDate = new Date();
      baseDate.setHours(0, 0, 0, 0);

      // Parse the time strings into proper DateTime objects
      const [startHours, startMinutes] = scheduleForm.startTime
        .split(":")
        .map(Number);
      const [endHours, endMinutes] = scheduleForm.endTime
        .split(":")
        .map(Number);

      // Create ISO DateTime strings
      const startDateTime = new Date(baseDate);
      startDateTime.setHours(startHours, startMinutes);

      const endDateTime = new Date(baseDate);
      endDateTime.setHours(endHours, endMinutes);

      await createTimeSchedule({
        title: scheduleForm.title,
        description: scheduleForm.description || "",
        startTime: startDateTime.toISOString(), // Convert to ISO format
        endTime: endDateTime.toISOString(), // Convert to ISO format
        dayOfWeek: scheduleForm.dayOfWeek,
      });

      resetForm();
      loadSchedules();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to create schedule:", error);
    }
  };

  // Handle schedule update
  const handleUpdateSchedule = async (e) => {
    e.preventDefault();

    try {
      // Create a base date for today
      const baseDate = new Date();
      baseDate.setHours(0, 0, 0, 0);

      // Parse the time strings into proper DateTime objects
      const [startHours, startMinutes] = scheduleForm.startTime
        .split(":")
        .map(Number);
      const [endHours, endMinutes] = scheduleForm.endTime
        .split(":")
        .map(Number);

      // Create ISO DateTime strings
      const startDateTime = new Date(baseDate);
      startDateTime.setHours(startHours, startMinutes);

      const endDateTime = new Date(baseDate);
      endDateTime.setHours(endHours, endMinutes);

      await updateTimeSchedule(currentSchedule.id, {
        title: scheduleForm.title,
        description: scheduleForm.description || "",
        startTime: startDateTime.toISOString(), // Convert to ISO format
        endTime: endDateTime.toISOString(), // Convert to ISO format
        dayOfWeek: scheduleForm.dayOfWeek,
      });

      resetForm();
      loadSchedules();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to update schedule:", error);
    }
  };

  // Handle schedule deletion
  const handleDeleteSchedule = async (id) => {
    if (confirm("Are you sure you want to delete this schedule item?")) {
      try {
        await deleteTimeSchedule(id);
        loadSchedules();
      } catch (error) {
        console.error("Failed to delete schedule:", error);
      }
    }
  };

  // Reset form state
  const resetForm = () => {
    setScheduleForm({
      title: "",
      description: "",
      startTime: "09:00",
      endTime: "10:00",
      dayOfWeek: "monday",
    });
  };

  // Open create schedule dialog
  const openCreateDialog = () => {
    setCurrentSchedule(null);
    resetForm();
    setIsDialogOpen(true);
  };

  // Open edit schedule dialog
  const openEditDialog = (schedule) => {
    setCurrentSchedule(schedule);

    // Extract time part from ISO string
    const startDate = new Date(schedule.startTime);
    const endDate = new Date(schedule.endTime);

    const formattedStartTime = `${String(startDate.getHours()).padStart(
      2,
      "0"
    )}:${String(startDate.getMinutes()).padStart(2, "0")}`;
    const formattedEndTime = `${String(endDate.getHours()).padStart(
      2,
      "0"
    )}:${String(endDate.getMinutes()).padStart(2, "0")}`;

    setScheduleForm({
      title: schedule.title,
      description: schedule.description || "",
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      dayOfWeek: schedule.dayOfWeek,
    });

    setIsDialogOpen(true);
  };

  // Get schedules for a specific day
  const getSchedulesForDay = (day) => {
    return schedules.filter(
      (schedule) => schedule.dayOfWeek.toLowerCase() === day.toLowerCase()
    );
  };

  // Format time for display (convert 24h to 12h)
  const formatTime = (time) => {
    try {
      let date;

      if (time.includes("T")) {
        // If it's an ISO string
        date = new Date(time);
      } else {
        // If it's a time string like "09:00"
        const [hours, minutes] = time.split(":").map(Number);
        date = new Date();
        date.setHours(hours, minutes);
      }

      return format(date, "h:mm a");
    } catch (error) {
      return time; // Fallback to original format if parsing fails
    }
  };

  // Calculate position and height for schedule item in grid
  const calculateScheduleStyle = (startTime, endTime) => {
    // Convert times to decimal hours
    const getDecimalHours = (time) => {
      let hours, minutes;

      if (time.includes("T")) {
        // If it's an ISO string
        const date = new Date(time);
        hours = date.getHours();
        minutes = date.getMinutes();
      } else {
        // If it's a time string like "09:00"
        [hours, minutes] = time.split(":").map(Number);
      }

      return hours + minutes / 60;
    };

    const startHour = getDecimalHours(startTime);
    const endHour = getDecimalHours(endTime);

    // Calculate position based on 6:00 AM (6 hours) start
    const startOffset = (startHour - 6) * 60; // Minutes from 6 AM
    const duration = (endHour - startHour) * 60; // Duration in minutes

    return {
      top: `${startOffset}px`,
      height: `${duration}px`,
    };
  };

  // Generate a color based on title (for visual distinction)
  const getScheduleColor = (title) => {
    const colors = [
      "bg-blue-100 border-blue-300 text-blue-700",
      "bg-green-100 border-green-300 text-green-700",
      "bg-purple-100 border-purple-300 text-purple-700",
      "bg-amber-100 border-amber-300 text-amber-700",
      "bg-pink-100 border-pink-300 text-pink-700",
      "bg-indigo-100 border-indigo-300 text-indigo-700",
      "bg-teal-100 border-teal-300 text-teal-700",
    ];

    // Simple hash function to get a consistent color for the same title
    const hashCode = title
      .split("")
      .reduce((hash, char) => (hash + char.charCodeAt(0)) % colors.length, 0);

    return colors[hashCode];
  };

  // Format day of week for display
  const formatDayOfWeek = (day) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Time Schedule</h1>
          <p className="text-muted-foreground">
            Manage your weekly schedule and routines
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Tabs
            value={activeView}
            onValueChange={setActiveView}
            className="w-[200px]"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button
            onClick={openCreateDialog}
            className="bg-primary hover:bg-primary/90 text-white flex gap-2"
          >
            <PlusIcon size={16} /> Add Schedule
          </Button>
        </div>
      </div>
      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsContent value="week" className="p-0 m-0">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="min-w-[900px]">
                  {/* Week View - Time Schedule Grid */}
                  <div className="grid grid-cols-8 border rounded-lg">
                    {/* Header Row */}
                    <div className="bg-muted/50 py-2 px-3 border-b font-medium text-center sticky top-0 z-10"></div>
                    {daysOfWeek.map((day) => (
                      <div
                        key={day}
                        className="bg-muted/50 py-2 px-3 border-b border-l font-medium text-center sticky top-0 z-10"
                      >
                        {formatDayOfWeek(day)}
                      </div>
                    ))}

                    {/* Time Slots */}
                    {timeSlots.map((time) => (
                      <Fragment key={time}>
                        {/* Time Label */}
                        <div className="border-b border-r px-2 py-1 text-xs text-muted-foreground h-[60px] flex items-start">
                          {formatTime(time)}
                        </div>

                        {/* Day Columns */}
                        {daysOfWeek.map((day) => (
                          <div
                            key={`${day}-${time}`}
                            className="border-b border-l px-2 py-1 h-[60px] relative"
                          >
                            <div className="w-full h-full" />
                          </div>
                        ))}
                      </Fragment>
                    ))}
                  </div>

                  {/* Schedule Items (Positioned Absolutely) */}
                  {daysOfWeek.map((day, dayIndex) => {
                    const daySchedules = getSchedulesForDay(day);
                    return daySchedules.map((schedule) => {
                      const style = calculateScheduleStyle(
                        schedule.startTime,
                        schedule.endTime
                      );
                      const colorClass = getScheduleColor(schedule.title);

                      return (
                        <div
                          key={schedule.id}
                          className={`absolute border rounded-md px-2 py-1 ${colorClass} text-xs overflow-hidden`}
                          style={{
                            top: `${parseFloat(style.top) + 47}px`, // 47px accounts for header height
                            left: `${(dayIndex + 1) * (100 / 8)}%`,
                            height: style.height,
                            width: `${95 / 8}%`,
                          }}
                          onClick={() => openEditDialog(schedule)}
                        >
                          <div className="font-medium truncate">
                            {schedule.title}
                          </div>
                          <div className="truncate text-[10px] opacity-80">
                            {formatTime(schedule.startTime)} -{" "}
                            {formatTime(schedule.endTime)}
                          </div>
                        </div>
                      );
                    });
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Tabs>
        <TabsContent value="list" className="p-0 m-0">
          <div className="space-y-6">
            {daysOfWeek.map((day) => {
              const daySchedules = getSchedulesForDay(day);
              return (
                <Card key={day}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5" />
                      {formatDayOfWeek(day)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {daySchedules.length > 0 ? (
                      <div className="space-y-4">
                        {daySchedules
                          .sort((a, b) =>
                            a.startTime.localeCompare(b.startTime)
                          )
                          .map((schedule) => (
                            <div
                              key={schedule.id}
                              className="flex items-start justify-between p-3 rounded-lg border hover:bg-muted/30 transition-colors"
                            >
                              <div className="flex items-start gap-4">
                                <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center text-primary">
                                  <ClockIcon className="h-5 w-5" />
                                </div>
                                <div>
                                  <h3 className="font-medium">
                                    {schedule.title}
                                  </h3>
                                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                      <ClockIcon className="h-3 w-3" />
                                      <span>
                                        {formatTime(schedule.startTime)} -{" "}
                                        {formatTime(schedule.endTime)}
                                      </span>
                                    </div>
                                  </div>
                                  {schedule.description && (
                                    <p className="mt-2 text-sm text-muted-foreground">
                                      {schedule.description}
                                    </p>
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
                                    onClick={() => openEditDialog(schedule)}
                                  >
                                    <EditIcon className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleDeleteSchedule(schedule.id)
                                    }
                                    className="text-red-600 focus:text-red-600"
                                  >
                                    <TrashIcon className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground">
                          No schedule items for {formatDayOfWeek(day)}
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => {
                            resetForm();
                            setScheduleForm((prev) => ({
                              ...prev,
                              dayOfWeek: day,
                            }));
                            setIsDialogOpen(true);
                          }}
                          className="mt-2"
                        >
                          <PlusIcon className="mr-2 h-4 w-4" />
                          Add Item
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Schedule Dialog (Create/Edit) */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentSchedule ? "Edit Schedule Item" : "Add Schedule Item"}
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={
              currentSchedule ? handleUpdateSchedule : handleCreateSchedule
            }
            className="space-y-4"
          >
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Title
              </label>
              <Input
                placeholder="e.g., Morning Workout"
                value={scheduleForm.title}
                onChange={(e) =>
                  setScheduleForm({ ...scheduleForm, title: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Day of Week
              </label>
              <Select
                value={scheduleForm.dayOfWeek}
                onValueChange={(value) =>
                  setScheduleForm({ ...scheduleForm, dayOfWeek: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a day" />
                </SelectTrigger>
                <SelectContent>
                  {daysOfWeek.map((day) => (
                    <SelectItem key={day} value={day}>
                      {formatDayOfWeek(day)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  Start Time
                </label>
                <Input
                  type="time"
                  value={scheduleForm.startTime}
                  onChange={(e) =>
                    setScheduleForm({
                      ...scheduleForm,
                      startTime: e.target.value,
                    })
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
                  value={scheduleForm.endTime}
                  onChange={(e) =>
                    setScheduleForm({
                      ...scheduleForm,
                      endTime: e.target.value,
                    })
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
                placeholder="Add notes about this schedule item..."
                value={scheduleForm.description}
                onChange={(e) =>
                  setScheduleForm({
                    ...scheduleForm,
                    description: e.target.value,
                  })
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
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                {currentSchedule ? (
                  <>
                    <SaveIcon className="mr-2 h-4 w-4" /> Update
                  </>
                ) : (
                  <>
                    <PlusIcon className="mr-2 h-4 w-4" /> Add
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
