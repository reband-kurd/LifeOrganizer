import { redirect } from "next/navigation";
import { createHabit } from "@/actions/Habits";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Define server action
async function handleFormSubmit(formData) {
  "use server";

  const data = {
    title: formData.get("title"),
    description: formData.get("description"),
    frequency: formData.get("frequency") || "Daily",
    date: new Date(),
  };

  await createHabit(data);
  redirect("/dashbord/habits");
}

export default function NewHabitPage() {
  return (
    <div className="min-h-screen p-6 lg:ml-64">
      <div className="max-w-2xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">New Habit</h1>
          <p className="text-muted-foreground">
            Create a new habit to start tracking your progress
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Habit Details</CardTitle>
            <CardDescription>
              Fill in the information below to create your new habit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleFormSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Title
                  </label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter habit title"
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Give your habit a clear and actionable title
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your habit"
                    className="min-h-[100px]"
                  />
                  <p className="text-sm text-muted-foreground">
                    Optional: Add details about your habit
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="frequency" className="text-sm font-medium">
                    Frequency
                  </label>
                  <select
                    id="frequency"
                    name="frequency"
                    defaultValue="Daily"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                  <p className="text-sm text-muted-foreground">
                    How often do you want to track this habit?
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <a href="/dashbord/habits">
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </a>
                <Button type="submit">Create Habit</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
