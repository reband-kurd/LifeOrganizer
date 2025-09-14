"use client";

import { useState, useEffect } from "react";
import {
  getAllProjects,
  createProject,
  deleteProject,
  updateProject,
  getProjectsByCompletion,
} from "@/actions/Projects";
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
import { format, formatDistanceToNow, isAfter } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  PlusIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  MoreVerticalIcon,
  Trash2Icon,
  EditIcon,
  AlertCircleIcon,
  ChevronRightIcon,
  FolderIcon,
  ListTodoIcon,
} from "lucide-react";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [projectFilter, setProjectFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Project form state
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default: 1 week from now
    isCompleted: false,
  });

  // Load projects on component mount
  useEffect(() => {
    loadProjects();
  }, []);

  // Load projects from the server
  const loadProjects = async () => {
    setIsLoading(true);
    try {
      let data;
      if (projectFilter === "completed") {
        data = await getProjectsByCompletion(true);
      } else if (projectFilter === "active") {
        data = await getProjectsByCompletion(false);
      } else {
        data = await getAllProjects();
      }
      setProjects(data);
    } catch (error) {
      console.error("Failed to load projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update projects when filter changes
  useEffect(() => {
    loadProjects();
  }, [projectFilter]);

  // Handle project creation
  const handleCreateProject = async (e) => {
    e.preventDefault();

    try {
      await createProject({
        title: projectForm.title,
        description: projectForm.description,
        deadline: projectForm.deadline,
        isCompleted: false,
      });

      resetForm();
      loadProjects();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  // Handle project update
  const handleUpdateProject = async (e) => {
    e.preventDefault();

    try {
      await updateProject(currentProject.id, {
        title: projectForm.title,
        description: projectForm.description,
        deadline: projectForm.deadline,
        isCompleted: projectForm.isCompleted,
      });

      resetForm();
      loadProjects();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  };

  // Handle project deletion
  const handleDeleteProject = async (id) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(id);
        loadProjects();
      } catch (error) {
        console.error("Failed to delete project:", error);
      }
    }
  };

  // Handle marking a project as complete
  const handleToggleProjectCompletion = async (project) => {
    try {
      await updateProject(project.id, {
        ...project,
        isCompleted: !project.isCompleted,
      });
      loadProjects();
    } catch (error) {
      console.error("Failed to update project completion:", error);
    }
  };

  // Reset form state
  const resetForm = () => {
    setProjectForm({
      title: "",
      description: "",
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      isCompleted: false,
    });
  };

  // Open create project dialog
  const openCreateDialog = () => {
    setCurrentProject(null);
    resetForm();
    setIsDialogOpen(true);
  };

  // Open edit project dialog
  const openEditDialog = (project) => {
    setCurrentProject(project);
    setProjectForm({
      title: project.title,
      description: project.description,
      deadline: new Date(project.deadline),
      isCompleted: project.isCompleted,
    });
    setIsDialogOpen(true);
  };

  // Filter projects by search query
  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate project stats
  const projectStats = {
    total: projects.length,
    completed: projects.filter((p) => p.isCompleted).length,
    active: projects.filter((p) => !p.isCompleted).length,
    overdue: projects.filter(
      (p) => !p.isCompleted && isAfter(new Date(), new Date(p.deadline))
    ).length,
  };

  // Get project status badge
  const getProjectStatusBadge = (project) => {
    if (project.isCompleted) {
      return (
        <Badge className="bg-green-500/20 text-green-600 hover:bg-green-500/20">
          Completed
        </Badge>
      );
    } else if (isAfter(new Date(), new Date(project.deadline))) {
      return (
        <Badge className="bg-red-500/20 text-red-600 hover:bg-red-500/20">
          Overdue
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

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">
            Manage your projects and track their progress
          </p>
        </div>
        <Button
          onClick={openCreateDialog}
          className="bg-primary hover:bg-primary/90 text-white flex gap-2"
        >
          <PlusIcon size={16} /> New Project
        </Button>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-card rounded-xl p-4 border shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Total Projects</p>
              <h3 className="text-2xl font-bold mt-1">{projectStats.total}</h3>
            </div>
            <div className="bg-primary/10 p-2 rounded-full">
              <FolderIcon className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-4 border shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <h3 className="text-2xl font-bold mt-1">{projectStats.active}</h3>
            </div>
            <div className="bg-blue-500/10 p-2 rounded-full">
              <ListTodoIcon className="h-5 w-5 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-4 border shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <h3 className="text-2xl font-bold mt-1">
                {projectStats.completed}
              </h3>
            </div>
            <div className="bg-green-500/10 p-2 rounded-full">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-4 border shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Overdue</p>
              <h3 className="text-2xl font-bold mt-1">
                {projectStats.overdue}
              </h3>
            </div>
            <div className="bg-red-500/10 p-2 rounded-full">
              <AlertCircleIcon className="h-5 w-5 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Project List Container */}
      <div className="bg-card rounded-xl border shadow-sm">
        {/* Header with Search and Filters */}
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1">
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
            <svg
              className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>

          <Tabs
            value={projectFilter}
            onValueChange={setProjectFilter}
            className="w-full sm:w-auto"
          >
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Projects List */}
        <div className="divide-y">
          {isLoading ? (
            <div className="p-8 text-center">
              <p>Loading projects...</p>
            </div>
          ) : filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <div
                key={project.id}
                className="p-4 hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id={`project-${project.id}`}
                      checked={project.isCompleted}
                      onCheckedChange={() =>
                        handleToggleProjectCompletion(project)
                      }
                      className="mt-1"
                    />
                    <div>
                      <h3
                        className={`font-medium text-lg ${
                          project.isCompleted
                            ? "line-through text-muted-foreground"
                            : ""
                        }`}
                      >
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground mt-1 text-sm line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-3 mt-3">
                        <div className="flex items-center text-xs text-muted-foreground gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          <span>
                            Deadline:{" "}
                            {format(new Date(project.deadline), "MMM dd, yyyy")}
                          </span>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground gap-1">
                          <ClockIcon className="h-3 w-3" />
                          <span>
                            {formatDistanceToNow(new Date(project.deadline), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                        <div>{getProjectStatusBadge(project)}</div>
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVerticalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(project)}>
                        <EditIcon className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleToggleProjectCompletion(project)}
                        className="text-green-600 focus:text-green-600"
                      >
                        <CheckCircleIcon className="mr-2 h-4 w-4" />
                        Mark as{" "}
                        {project.isCompleted ? "Incomplete" : "Complete"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteProject(project.id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2Icon className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Project Progress (only show for non-completed projects) */}
                {!project.isCompleted && (
                  <div className="ml-10 mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span>0%</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="py-12 text-center">
              <div className="bg-muted/30 inline-flex p-3 rounded-full mx-auto">
                <FolderIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mt-4 font-medium">No projects found</h3>
              <p className="text-muted-foreground mt-1 text-sm">
                {searchQuery
                  ? "Try different search terms"
                  : "Create your first project to get started"}
              </p>
              <Button
                variant="outline"
                onClick={openCreateDialog}
                className="mt-4"
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                Create Project
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Project Dialog (Create/Edit) */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentProject ? "Edit Project" : "Create New Project"}
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={
              currentProject ? handleUpdateProject : handleCreateProject
            }
            className="space-y-4"
          >
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Project Title
              </label>
              <Input
                placeholder="Enter project title"
                value={projectForm.title}
                onChange={(e) =>
                  setProjectForm({ ...projectForm, title: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Deadline
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {projectForm.deadline
                      ? format(projectForm.deadline, "PPP")
                      : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={projectForm.deadline}
                    onSelect={(date) =>
                      setProjectForm({ ...projectForm, deadline: date })
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
                placeholder="Enter project description"
                value={projectForm.description}
                onChange={(e) =>
                  setProjectForm({
                    ...projectForm,
                    description: e.target.value,
                  })
                }
                className="resize-none"
                rows={4}
                required
              />
            </div>

            {currentProject && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="project-completed"
                  checked={projectForm.isCompleted}
                  onCheckedChange={(checked) =>
                    setProjectForm({ ...projectForm, isCompleted: !!checked })
                  }
                />
                <label
                  htmlFor="project-completed"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Mark project as completed
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
                {currentProject ? "Update Project" : "Create Project"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
