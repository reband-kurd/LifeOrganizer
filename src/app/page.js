import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-gradient-to-b from-background to-secondary">
      {/* Hero Section */}
      <header className="relative pt-24 pb-16 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] aspect-square bg-[radial-gradient(circle_farthest-side,rgba(100,100,255,0.12),transparent)] blur-2xl"></div>
        </div>
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-6">
            Organize Your Life in{" "}
            <span className="text-blue-600 dark:text-blue-400">One Place</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl">
            Seamlessly manage your tasks, habits, goals, journals, and more —
            all from a single intuitive dashboard.
          </p>
          <div className="flex gap-4 flex-col sm:flex-row">
            <a
              href="/dashbord"
              className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 font-medium text-lg transition-colors"
            >
              Go to Dashboard
            </a>
            <a
              href="#features"
              className="rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 px-8 py-4 font-medium text-lg transition-colors"
            >
              Explore Features
            </a>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          Powerful Features to Boost Your Productivity
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Task Management */}
          <div className="bg-background text-foreground border border-border hover:shadow-md">
            <div className="bg-primary/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-foreground">Task Management</h3>
            <p className="text-muted-foreground">
              Organize tasks with deadlines, priority levels, and smart
              categorization. Never miss an important deadline again.
            </p>
          </div>

          {/* Habit Tracking */}
          <div className="bg-background text-foreground border border-border hover:shadow-md">
            <div className="bg-primary/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-foreground">Habit Tracking</h3>
            <p className="text-muted-foreground">
              Build consistency with daily, weekly, and monthly habit tracking.
              Visualize your progress and stay motivated.
            </p>
          </div>

          {/* Journaling */}
          <div className="bg-background text-foreground border border-border hover:shadow-md">
            <div className="bg-primary/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <h3 className="text-foreground">Journaling</h3>
            <p className="text-muted-foreground">
              Capture your thoughts, track your mood, and reflect on your day.
              Journal entries with rich formatting and media support.
            </p>
          </div>

          {/* Goal Setting */}
          <div className="bg-background text-foreground border border-border hover:shadow-md">
            <div className="bg-primary/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-foreground">Goal Setting</h3>
            <p className="text-muted-foreground">
              Set and track meaningful goals with milestones. Break down big
              ambitions into achievable steps.
            </p>
          </div>

          {/* Note Taking */}
          <div className="bg-background text-foreground border border-border hover:shadow-md">
            <div className="bg-primary/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
            </div>
            <h3 className="text-foreground">Note Taking</h3>
            <p className="text-muted-foreground">
              Capture ideas instantly with our powerful note-taking system.
              Organize with tags and pin important notes.
            </p>
          </div>

          {/* Project Management */}
          <div className="bg-background text-foreground border border-border hover:shadow-md">
            <div className="bg-primary/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-foreground">Project Management</h3>
            <p className="text-muted-foreground">
              Manage complex projects with subtasks, deadlines, and progress
              tracking. Keep everything organized in one place.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonial/CTA Section */}
      <section
        id="demo"
        className="py-20 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto"
      >
        <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Productivity?
            </h2>
            <p className="text-xl opacity-90 mb-10">
              Join thousands of users who have already optimized their daily
              workflow and achieved more with our powerful productivity suite.
            </p>
            <div className="flex justify-center">
              <a
                href="/register"
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-full font-bold text-lg transition-colors"
              >
                Get Started for Free
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto border-t border-gray-200 dark:border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h3 className="text-2xl font-bold">LifeOrganizer</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your all-in-one productivity solution
            </p>
          </div>
          <div className="flex gap-8 flex-wrap">
            <a
              href="/about"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              About
            </a>
            <a
              href="/features"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Features
            </a>
            <a
              href="/pricing"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Pricing
            </a>
            <a
              href="/blog"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Blog
            </a>
            <a
              href="/contact"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
        <div className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} LifeOrganizer. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
