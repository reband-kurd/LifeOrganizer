"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  getPinnedNotes,
  getUnpinnedNotes,
  createNote,
  deleteNote,
  togglePin,
  searchNotes,
} from "@/actions/Notes";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  DrawingPinIcon,
  TrashIcon,
} from "@radix-ui/react-icons";

export default function Notes() {
  const [pinnedNotes, setPinnedNotes] = useState([]);
  const [unpinnedNotes, setUnpinnedNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    isPinned: false,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    setIsLoading(true);
    const pinned = await getPinnedNotes();
    const unpinned = await getUnpinnedNotes();
    setPinnedNotes(pinned);
    setUnpinnedNotes(unpinned);
    setIsLoading(false);
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      setIsLoading(true);
      const results = await searchNotes(query);
      setUnpinnedNotes(results.filter((note) => !note.isPinned));
      setPinnedNotes(results.filter((note) => note.isPinned));
      setIsLoading(false);
    } else {
      loadNotes();
    }
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();
    await createNote(newNote);
    setNewNote({ title: "", content: "", isPinned: false });
    setIsDialogOpen(false);
    loadNotes();
  };

  const handleTogglePin = async (id, isPinned) => {
    await togglePin(id, isPinned);
    loadNotes();
  };

  const handleDeleteNote = async (id) => {
    await deleteNote(id);
    loadNotes();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const NoteCard = ({ note }) => (
    <div className="bg-card rounded-xl p-6 border shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-200">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-card-foreground line-clamp-1">
          {note.title || "Untitled Note"}
        </h3>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleTogglePin(note.id, note.isPinned)}
            className={`rounded-full hover:bg-primary/10 ${
              note.isPinned ? "text-primary" : "text-muted-foreground"
            }`}
            title={note.isPinned ? "Unpin note" : "Pin note"}
          >
            <DrawingPinIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteNote(note.id)}
            className="rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            title="Delete note"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="h-[120px] overflow-hidden">
        <p className="text-muted-foreground whitespace-pre-wrap text-sm line-clamp-5">
          {note.content}
        </p>
      </div>
      <div className="mt-4 pt-3 border-t border-border/50 text-xs text-muted-foreground flex justify-between items-center">
        <span title={`Created: ${formatDate(note.createdAt)}`}>
          Updated {formatDate(note.updatedAt)}
        </span>
        {note.isPinned && <span className="text-primary text-xs">Pinned</span>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-6 lg:ml-64 bg-background">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-foreground">Notes</h1>
        <p className="text-muted-foreground mt-2">
          Capture and organize your thoughts
        </p>
      </header>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="relative w-full max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-10 bg-card border-border"
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2">
              <PlusIcon className="h-4 w-4" />
              <span>New Note</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card sm:max-w-[700px] max-h-[90vh] overflow-y-auto border-border">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-card-foreground">
                Create New Note
              </DialogTitle>
              <p className="text-muted-foreground text-sm">
                Capture your thoughts, ideas, and important information
              </p>
            </DialogHeader>
            <form onSubmit={handleCreateNote} className="space-y-6 mt-4">
              <div className="space-y-2">
                <label
                  htmlFor="title"
                  className="text-sm font-medium text-card-foreground"
                >
                  Title
                </label>
                <Input
                  id="title"
                  placeholder="Enter note title..."
                  value={newNote.title}
                  onChange={(e) =>
                    setNewNote({ ...newNote, title: e.target.value })
                  }
                  className="h-12 text-lg"
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="content"
                  className="text-sm font-medium text-card-foreground"
                >
                  Content
                </label>
                <Textarea
                  id="content"
                  placeholder="Write your note content here..."
                  value={newNote.content}
                  onChange={(e) =>
                    setNewNote({ ...newNote, content: e.target.value })
                  }
                  className="min-h-[300px] text-base leading-relaxed resize-y"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPinned"
                  checked={newNote.isPinned}
                  onChange={(e) =>
                    setNewNote({ ...newNote, isPinned: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label
                  htmlFor="isPinned"
                  className="text-sm text-card-foreground flex items-center gap-1"
                >
                  <DrawingPinIcon className="h-3 w-3" />
                  Pin this note
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Create Note
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full"></div>
        </div>
      ) : (
        <>
          {pinnedNotes.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <DrawingPinIcon className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">
                  Pinned Notes
                </h2>
              </div>
              <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {pinnedNotes.map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold mb-4 text-foreground">
              {unpinnedNotes.length > 0 ? "All Notes" : "No notes found"}
            </h2>
            {unpinnedNotes.length > 0 ? (
              <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {unpinnedNotes.map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
            ) : (
              <div className="text-center p-12 bg-card rounded-xl border">
                <p className="text-muted-foreground">
                  {searchQuery
                    ? "No notes match your search"
                    : "You haven't created any notes yet"}
                </p>
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  className="mt-4 bg-primary/10 text-primary hover:bg-primary/20"
                >
                  Create your first note
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
