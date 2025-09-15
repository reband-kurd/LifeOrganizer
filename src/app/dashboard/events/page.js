"use client";

import { useState, useEffect, useMemo } from "react";
import {
  getAllEvents,
  createEvent,
  deleteEvent,
  updateEvent,
  getUpcomingEvents,
} from "@/actions/Events";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  format,
  parse,
  isToday,
  isTomorrow,
  isThisWeek,
  isThisMonth,
  isSameDay,
  addHours,
} from "date-fns";
import {
  PlusIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  MoreVerticalIcon,
  EditIcon,
  TrashIcon,
  CalendarDaysIcon,
  ChevronRightIcon,
  SearchIcon,
  InfoIcon,
  MapIcon,
} from "lucide-react";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState("calendar"); // "calendar" or "list"

  // Event form state
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",

    startsAt: format(new Date(), "HH:mm"),
    endsAt: format(addHours(new Date(), 1), "HH:mm"),
    location: "",
  });

  // Load events on component mount
  useEffect(() => {
    loadEvents();
  }, []);

  // Load events from the server
  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const data = await getAllEvents();
      setEvents(data);
    } catch (error) {
      console.error("Failed to load events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle event creation
  const handleCreateEvent = async (e) => {
    e.preventDefault();

    try {
      // Convert time strings to Date objects for the API
      const startDateTime = new Date(eventForm.date);
      const [startHours, startMinutes] = eventForm.startsAt
        .split(":")
        .map(Number);
      startDateTime.setHours(startHours, startMinutes, 0, 0);

      const endDateTime = new Date(eventForm.date);
      const [endHours, endMinutes] = eventForm.endsAt.split(":").map(Number);
      endDateTime.setHours(endHours, endMinutes, 0, 0);

      await createEvent({
        title: eventForm.title,
        description: eventForm.description,

        startsAt: startDateTime,
        endsAt: endDateTime,
        location: eventForm.location,
      });

      resetForm();
      loadEvents();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to create event:", error);
    }
  };

  // Handle event update
  const handleUpdateEvent = async (e) => {
    e.preventDefault();

    try {
      // Convert time strings to Date objects for the API
      const startDateTime = new Date(eventForm.date);
      const [startHours, startMinutes] = eventForm.startsAt
        .split(":")
        .map(Number);
      startDateTime.setHours(startHours, startMinutes, 0, 0);

      const endDateTime = new Date(eventForm.date);
      const [endHours, endMinutes] = eventForm.endsAt.split(":").map(Number);
      endDateTime.setHours(endHours, endMinutes, 0, 0);

      await updateEvent(currentEvent.id, {
        title: eventForm.title,
        description: eventForm.description,

        startsAt: startDateTime,
        endsAt: endDateTime,
        location: eventForm.location,
      });

      resetForm();
      loadEvents();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to update event:", error);
    }
  };

  // Handle event deletion
  const handleDeleteEvent = async (id) => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(id);
        loadEvents();
      } catch (error) {
        console.error("Failed to delete event:", error);
      }
    }
  };

  // Reset form state
  const resetForm = () => {
    setEventForm({
      title: "",
      description: "",
      date: new Date(),
      startsAt: format(new Date(), "HH:mm"),
      endsAt: format(addHours(new Date(), 1), "HH:mm"),
      location: "",
    });
  };

  // Open create event dialog
  const openCreateDialog = (date = new Date()) => {
    setCurrentEvent(null);
    setEventForm({
      ...eventForm,
      date: date,
    });
    setIsDialogOpen(true);
  };

  // Open edit event dialog
  const openEditDialog = (event) => {
    setCurrentEvent(event);

    setEventForm({
      title: event.title,
      description: event.description || "",
      date: new Date(event.startsAt),
      startsAt: format(new Date(event.startsAt), "HH:mm"),
      endsAt: format(new Date(event.endsAt), "HH:mm"),
      location: event.location || "",
    });

    setIsDialogOpen(true);
  };

  // Filter events based on search query
  const filteredEvents = useMemo(() => {
    return events.filter(
      (event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.description &&
          event.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        (event.location &&
          event.location.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [events, searchQuery]);

  // Get events for selected date
  const eventsForSelectedDate = useMemo(() => {
    return filteredEvents.filter((event) =>
      isSameDay(new Date(event.startsAt), selectedDate)
    );
  }, [filteredEvents, selectedDate]);

  // Get today's events
  const todaysEvents = useMemo(() => {
    return filteredEvents.filter((event) => isToday(new Date(event.startsAt)));
  }, [filteredEvents]);

  // Get upcoming events (excluding today)
  const upcomingEvents = useMemo(() => {
    return filteredEvents
      .filter(
        (event) =>
          !isToday(new Date(event.startsAt)) &&
          new Date(event.startsAt) > new Date()
      )
      .sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt));
  }, [filteredEvents]);

  // Format time for display
  const formatEventTime = (start, end) => {
    return `${format(new Date(start), "h:mm a")} - ${format(
      new Date(end),
      "h:mm a"
    )}`;
  };

  // Format date for display
  const formatEventDate = (date) => {
    const eventDate = new Date(date);

    if (isToday(eventDate)) {
      return "Today";
    } else if (isTomorrow(eventDate)) {
      return "Tomorrow";
    } else {
      return format(eventDate, "EEEE, MMMM d");
    }
  };

  // Get days with events for highlighting in calendar
  const daysWithEvents = useMemo(() => {
    return events.map((event) => new Date(event.startsAt));
  }, [events]);

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-muted-foreground">
            Manage your schedule and upcoming events
          </p>
        </div>
        <div className="flex gap-3">
          <Tabs value={view} onValueChange={setView} className="w-[200px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button
            onClick={() => openCreateDialog()}
            className="bg-primary hover:bg-primary/90 text-white flex gap-2"
          >
            <PlusIcon size={16} /> New Event
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 max-w-md"
        />
      </div>
      <Tabs value={view} onValueChange={setView} className="w-full">
        <TabsContent value="calendar" className="p-0 m-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar View */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md"
                    modifiers={{
                      eventDay: daysWithEvents,
                    }}
                    modifiersStyles={{
                      eventDay: {
                        fontWeight: "bold",
                        textDecoration: "underline",
                        textDecorationColor: "var(--primary)",
                      },
                    }}
                  />
                </CardContent>
              </Card>

              {/* Events for Selected Date */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Events for {format(selectedDate, "MMMM d, yyyy")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-6">
                      <p>Loading events...</p>
                    </div>
                  ) : eventsForSelectedDate.length > 0 ? (
                    <div className="space-y-4">
                      {eventsForSelectedDate.map((event) => (
                        <div
                          key={event.id}
                          className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center text-primary">
                            <CalendarDaysIcon className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h3 className="font-medium">{event.title}</h3>
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
                                    onClick={() => openEditDialog(event)}
                                  >
                                    <EditIcon className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteEvent(event.id)}
                                    className="text-red-600 focus:text-red-600"
                                  >
                                    <TrashIcon className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <ClockIcon className="h-3 w-3" />
                                <span>
                                  {formatEventTime(
                                    event.startsAt,
                                    event.endsAt
                                  )}
                                </span>
                              </div>
                              {event.location && (
                                <div className="flex items-center gap-1">
                                  <MapPinIcon className="h-3 w-3" />
                                  <span>{event.location}</span>
                                </div>
                              )}
                            </div>
                            {event.description && (
                              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                                {event.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="bg-muted/30 inline-flex p-3 rounded-full">
                        <CalendarDaysIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="mt-4 font-medium">No events scheduled</h3>
                      <p className="text-muted-foreground mt-1 text-sm">
                        {searchQuery
                          ? "Try a different search"
                          : `No events for ${format(selectedDate, "MMMM d")}`}
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => openCreateDialog(selectedDate)}
                        className="mt-4"
                      >
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Add Event for This Day
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar with Today's Events and Upcoming */}
            <div className="space-y-6">
              {/* Today's Events */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-md">Today's Events</CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-4">
                  {todaysEvents.length > 0 ? (
                    <div className="space-y-4">
                      {todaysEvents.map((event) => (
                        <div
                          key={`today-${event.id}`}
                          className="flex items-start justify-between py-2"
                        >
                          <div className="flex items-start gap-3">
                            <div className="min-w-fit pt-1">
                              <Badge className="bg-blue-500/20 text-blue-600 hover:bg-blue-500/20">
                                {format(new Date(event.startsAt), "h:mm a")}
                              </Badge>
                            </div>
                            <div>
                              <p className="font-medium line-clamp-1">
                                {event.title}
                              </p>
                              {event.location && (
                                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                  <MapPinIcon className="h-3 w-3" />
                                  <span>{event.location}</span>
                                </p>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => openEditDialog(event)}
                          >
                            <ChevronRightIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">
                        No events scheduled for today
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Upcoming Events */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-md">Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-4">
                  {upcomingEvents.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingEvents.slice(0, 5).map((event) => (
                        <div
                          key={`upcoming-${event.id}`}
                          className="border-b border-border/50 last:border-0 pb-3 last:pb-0"
                        >
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="font-medium line-clamp-1">
                              {event.title}
                            </h4>
                            <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                              {formatEventDate(event.startsAt)}
                            </Badge>
                          </div>
                          <div className="flex gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <ClockIcon className="h-3 w-3" />
                              <span>
                                {format(new Date(event.startsAt), "h:mm a")}
                              </span>
                            </div>
                            {event.location && (
                              <div className="flex items-center gap-1">
                                <MapPinIcon className="h-3 w-3" />
                                <span className="line-clamp-1">
                                  {event.location}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      {upcomingEvents.length > 5 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-xs"
                        >
                          View all {upcomingEvents.length} upcoming events
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">
                        No upcoming events
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Tips */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-md flex items-center gap-2">
                    <InfoIcon className="h-4 w-4" />
                    Event Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-4 text-sm">
                  <ul className="space-y-2">
                    <li className="flex gap-2">
                      <ChevronRightIcon className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>Click on any date to see events for that day</span>
                    </li>
                    <li className="flex gap-2">
                      <ChevronRightIcon className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>
                        Days with events are highlighted in the calendar
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <ChevronRightIcon className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>
                        Add location details to help you remember where to be
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      <Tabs>
        <TabsContent value="list" className="p-0 m-0">
          {/* List View */}
          <div className="bg-card rounded-xl border shadow-sm">
            <div className="p-4 border-b">
              <h2 className="font-semibold">All Events</h2>
            </div>

            {isLoading ? (
              <div className="p-8 text-center">
                <p>Loading events...</p>
              </div>
            ) : filteredEvents.length > 0 ? (
              <div className="divide-y">
                {filteredEvents
                  .sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt))
                  .map((event) => (
                    <div
                      key={event.id}
                      className="p-4 hover:bg-muted/20 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="bg-muted/80 rounded-lg w-14 h-14 flex flex-col items-center justify-center text-center shrink-0">
                          <span className="text-sm font-medium">
                            {format(new Date(event.startsAt), "MMM")}
                          </span>
                          <span className="text-lg font-bold">
                            {format(new Date(event.startsAt), "dd")}
                          </span>
                        </div>

                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-medium text-lg">
                              {event.title}
                            </h3>
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
                                  onClick={() => openEditDialog(event)}
                                >
                                  <EditIcon className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteEvent(event.id)}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <TrashIcon className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {event.description && (
                            <p className="text-muted-foreground mt-1 text-sm line-clamp-2">
                              {event.description}
                            </p>
                          )}

                          <div className="flex flex-wrap gap-4 mt-3">
                            <div className="flex items-center text-xs text-muted-foreground gap-1">
                              <CalendarIcon className="h-3 w-3" />
                              <span>{formatEventDate(event.startsAt)}</span>
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground gap-1">
                              <ClockIcon className="h-3 w-3" />
                              <span>
                                {formatEventTime(event.startsAt, event.endsAt)}
                              </span>
                            </div>
                            {event.location && (
                              <div className="flex items-center text-xs text-muted-foreground gap-1">
                                <MapPinIcon className="h-3 w-3" />
                                <span>{event.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="bg-muted/30 inline-flex p-3 rounded-full">
                  <CalendarDaysIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mt-4 font-medium">No events found</h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  {searchQuery
                    ? "Try different search terms"
                    : "Create your first event to get started"}
                </p>
                <Button
                  variant="outline"
                  onClick={() => openCreateDialog()}
                  className="mt-4"
                >
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Create Event
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Event Dialog (Create/Edit) */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentEvent ? "Edit Event" : "Create New Event"}
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={currentEvent ? handleUpdateEvent : handleCreateEvent}
            className="space-y-4"
          >
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Event Title
              </label>
              <Input
                placeholder="Enter event title"
                value={eventForm.title}
                onChange={(e) =>
                  setEventForm({ ...eventForm, title: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  Start Time
                </label>
                <Input
                  type="time"
                  value={eventForm.startsAt}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, startsAt: e.target.value })
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
                  value={eventForm.endsAt}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, endsAt: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Location
              </label>
              <div className="relative">
                <MapIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Add location (optional)"
                  value={eventForm.location}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, location: e.target.value })
                  }
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Description
              </label>
              <Textarea
                placeholder="Add a description (optional)"
                value={eventForm.description}
                onChange={(e) =>
                  setEventForm({ ...eventForm, description: e.target.value })
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
                {currentEvent ? "Update Event" : "Create Event"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
