"use client";

import { useState, useEffect } from "react";
import {
  getAllJournals,
  createJournal,
  updateJournal,
  deleteJournal,
} from "@/actions/Journals";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpenIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  SearchIcon,
  CalendarIcon,
  EyeIcon,
  EditIcon,
  ArrowLeftIcon,
  SaveIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function Journals() {
  const router = useRouter();
  const [journals, setJournals] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [moodFilter, setMoodFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [currentJournal, setCurrentJournal] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(false);

  // Journal form state
  const [journalForm, setJournalForm] = useState({
    title: "",
    content: "",
    mood: "neutral",
  });

  // Load all journals on component mount
  useEffect(() => {
    loadJournals();
  }, []);

  // Load journals from the server
  const loadJournals = async () => {
    setIsLoading(true);
    try {
      const data = await getAllJournals();
      setJournals(
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );
    } catch (error) {
      console.error("Failed to load journals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle journal creation
  const handleCreateJournal = async (e) => {
    e.preventDefault();

    try {
      await createJournal(journalForm);
      setJournalForm({ title: "", content: "", mood: "neutral" });
      loadJournals();
      setShowEditor(false);
    } catch (error) {
      console.error("Failed to create journal:", error);
    }
  };

  // Handle journal update
  const handleUpdateJournal = async (e) => {
    e.preventDefault();

    try {
      await updateJournal(currentJournal.id, journalForm);
      loadJournals();
      setShowEditor(false);
    } catch (error) {
      console.error("Failed to update journal:", error);
    }
  };

  // Handle journal deletion
  const handleDeleteJournal = async (id) => {
    if (confirm("Are you sure you want to delete this journal entry?")) {
      try {
        await deleteJournal(id);
        loadJournals();
      } catch (error) {
        console.error("Failed to delete journal:", error);
      }
    }
  };

  // Open create journal editor
  const openCreateEditor = () => {
    setCurrentJournal(null);
    setJournalForm({ title: "", content: "", mood: "neutral" });
    setShowEditor(true);
    setIsReadOnly(false);
  };

  // Open edit journal editor
  const openEditEditor = (journal) => {
    setCurrentJournal(journal);
    setJournalForm({
      title: journal.title,
      content: journal.content,
      mood: journal.mood || "neutral",
    });
    setShowEditor(true);
    setIsReadOnly(false);
  };

  // Open view journal editor (read-only)
  const openViewEditor = (journal) => {
    setCurrentJournal(journal);
    setJournalForm({
      title: journal.title,
      content: journal.content,
      mood: journal.mood || "neutral",
    });
    setShowEditor(true);
    setIsReadOnly(true);
  };

  // Filter journals based on search query and mood filter
  const filteredJournals = journals.filter((journal) => {
    const matchesSearch =
      journal.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      journal.content?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMood = moodFilter ? journal.mood === moodFilter : true;

    return matchesSearch && matchesMood;
  });

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get mood emoji
  const getMoodEmoji = (mood) => {
    const moodEmojis = {
      happy: "😊",
      sad: "😢",
      angry: "😠",
      excited: "🤩",
      anxious: "😰",
      neutral: "😐",
      relaxed: "😌",
    };
    return moodEmojis[mood] || "😐";
  };

  // Return to journal listing
  const closeEditor = () => {
    setShowEditor(false);
  };

  // If editor is open, show the full-page journal editor
  if (showEditor) {
    return (
      <div className="container mx-auto p-6 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={closeEditor}
            className="flex items-center gap-2"
          >
            <ArrowLeftIcon size={18} />
            Back to Journals
          </Button>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsReadOnly(!isReadOnly)}
              className="flex items-center gap-1"
            >
              {isReadOnly ? (
                <>
                  <EditIcon className="h-4 w-4" />
                  <span>Edit Mode</span>
                </>
              ) : (
                <>
                  <EyeIcon className="h-4 w-4" />
                  <span>Read Only</span>
                </>
              )}
            </Button>

            {!isReadOnly && (
              <Button
                onClick={
                  currentJournal ? handleUpdateJournal : handleCreateJournal
                }
                className="bg-primary hover:bg-primary/90 text-white flex gap-2"
              >
                <SaveIcon size={16} />
                {currentJournal ? "Update" : "Save"}
              </Button>
            )}
          </div>
        </div>

        <div className="bg-card rounded-xl p-8 border shadow-md">
          <div className="flex gap-4 items-center mb-6">
            <div className="flex-1">
              <Input
                placeholder="Journal Title"
                className="text-2xl py-6 font-medium border-none shadow-none focus-visible:ring-0 px-0"
                value={journalForm.title}
                onChange={(e) =>
                  setJournalForm({ ...journalForm, title: e.target.value })
                }
                disabled={isReadOnly}
                required
              />
            </div>

            <div>
              <Select
                value={journalForm.mood}
                onValueChange={(value) =>
                  setJournalForm({ ...journalForm, mood: value })
                }
                disabled={isReadOnly}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Select Mood" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="happy">Happy 😊</SelectItem>
                  <SelectItem value="sad">Sad 😢</SelectItem>
                  <SelectItem value="angry">Angry 😠</SelectItem>
                  <SelectItem value="excited">Excited 🤩</SelectItem>
                  <SelectItem value="anxious">Anxious 😰</SelectItem>
                  <SelectItem value="neutral">Neutral 😐</SelectItem>
                  <SelectItem value="relaxed">Relaxed 😌</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="relative">
            <Textarea
              placeholder="Start writing your journal entry here..."
              className="min-h-[65vh] text-lg leading-relaxed p-6 focus-visible:ring-0 rounded-lg border-muted bg-card/50 resize-none w-full"
              style={{
                backgroundImage:
                  "linear-gradient(transparent, transparent 23px, #100000 23px, #e5e5e5 24px, transparent 24px)",
                backgroundSize: "100% 24px",
                lineHeight: "24px",
                fontSize: "16px",
              }}
              value={journalForm.content}
              onChange={(e) =>
                setJournalForm({ ...journalForm, content: e.target.value })
              }
              disabled={isReadOnly}
              required
            />
            {currentJournal && (
              <div className="absolute bottom-4 right-4 text-xs text-muted-foreground flex items-center">
                <CalendarIcon className="h-3 w-3 mr-1" />
                <span>{formatDate(currentJournal.createdAt)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Otherwise show the journal listing page
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Journals</h1>
          <p className="text-muted-foreground">
            Record your thoughts, reflections, and daily experiences
          </p>
        </div>
        <Button
          onClick={openCreateEditor}
          className="bg-primary hover:bg-primary/90 text-white flex gap-2"
        >
          <PlusIcon size={16} /> New Journal
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search journals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>
        <Select value={moodFilter} onValueChange={setMoodFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by mood" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={null}>All Moods</SelectItem>
            <SelectItem value="happy">Happy 😊</SelectItem>
            <SelectItem value="sad">Sad 😢</SelectItem>
            <SelectItem value="angry">Angry 😠</SelectItem>
            <SelectItem value="excited">Excited 🤩</SelectItem>
            <SelectItem value="anxious">Anxious 😰</SelectItem>
            <SelectItem value="neutral">Neutral 😐</SelectItem>
            <SelectItem value="relaxed">Relaxed 😌</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Journal List */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading journals...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJournals.length > 0 ? (
            filteredJournals.map((journal) => (
              <div
                key={journal.id}
                className="bg-card rounded-xl p-6 border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                onClick={() => openViewEditor(journal)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <span
                      title={`Mood: ${journal.mood || "neutral"}`}
                      className="text-xl"
                    >
                      {getMoodEmoji(journal.mood)}
                    </span>
                    <h3 className="text-lg font-semibold text-card-foreground line-clamp-1">
                      {journal.title || "Untitled Journal"}
                    </h3>
                  </div>
                  <div
                    className="flex gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditEditor(journal);
                      }}
                      className="rounded-full hover:bg-primary/10 text-muted-foreground"
                      title="Edit journal"
                    >
                      <EditIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteJournal(journal.id);
                      }}
                      className="rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      title="Delete journal"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="h-[100px] overflow-hidden">
                  <p className="text-muted-foreground whitespace-pre-wrap text-sm line-clamp-4">
                    {journal.content}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border/50 text-xs text-muted-foreground flex items-center">
                  <CalendarIcon className="h-3 w-3 mr-1" />
                  <span title={`Created: ${formatDate(journal.createdAt)}`}>
                    {formatDate(journal.createdAt)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <BookOpenIcon className="h-12 w-12 mx-auto text-muted-foreground/50" />
              <h3 className="mt-4 text-xl font-medium">No journals found</h3>
              <p className="text-muted-foreground mt-2">
                {searchQuery || moodFilter
                  ? "Try changing your search or filter criteria"
                  : "Start by creating your first journal entry"}
              </p>
              <Button
                onClick={openCreateEditor}
                variant="outline"
                className="mt-4"
              >
                Create a new journal
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
