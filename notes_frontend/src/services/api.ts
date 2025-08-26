//
// API service layer for Notes app with local in-memory storage fallback.
// Provides a simple REST-like interface and can be switched to a real backend later.
//

export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  category?: string;
};

export type NoteInput = {
  title: string;
  content: string;
  category?: string;
};

const STORAGE_KEY = "notes_app_notes_v1";
const USE_LOCAL = true; // Toggle for future backend connection

function loadLocal(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Note[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveLocal(notes: Note[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // ignore storage errors
  }
}

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// PUBLIC_INTERFACE
export async function listNotes(query?: { search?: string; category?: string }): Promise<Note[]> {
  /** List notes, optionally filtered by search text or category. */
  if (USE_LOCAL) {
    let notes = loadLocal().sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
    if (query?.category) {
      const cat = query.category;
      if (cat) {
        notes = notes.filter((n) => (n.category || "").toLowerCase() === cat.toLowerCase());
      }
    }
    if (query?.search) {
      const term = query.search.toLowerCase();
      notes = notes.filter(
        (n) => n.title.toLowerCase().includes(term) || n.content.toLowerCase().includes(term),
      );
    }
    return notes;
  }

  // Example future backend call
  // const url = new URL(`${import.meta.env.PUBLIC_API_BASE_URL}/notes`);
  // if (query?.search) url.searchParams.set('search', query.search);
  // if (query?.category) url.searchParams.set('category', query.category);
  // const res = await fetch(url.toString());
  // if (!res.ok) throw new Error('Failed to fetch notes');
  // return (await res.json()) as Note[];
  return [];
}

// PUBLIC_INTERFACE
export async function getNote(id: string): Promise<Note | null> {
  /** Get a single note by id. Returns null if not found. */
  if (USE_LOCAL) {
    const notes = loadLocal();
    return notes.find((n) => n.id === id) || null;
  }
  // const res = await fetch(`${import.meta.env.PUBLIC_API_BASE_URL}/notes/${id}`);
  // if (res.status === 404) return null;
  // if (!res.ok) throw new Error('Failed to fetch note');
  // return (await res.json()) as Note;
  return null;
}

// PUBLIC_INTERFACE
export async function createNote(input: NoteInput): Promise<Note> {
  /** Create a note. Returns the created note. */
  const now = new Date().toISOString();
  if (USE_LOCAL) {
    const notes = loadLocal();
    const note: Note = {
      id: generateId(),
      title: input.title.trim(),
      content: input.content,
      createdAt: now,
      updatedAt: now,
      category: input.category?.trim() || undefined,
    };
    notes.unshift(note);
    saveLocal(notes);
    return note;
  }
  // const res = await fetch(`${import.meta.env.PUBLIC_API_BASE_URL}/notes`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(input),
  // });
  // if (!res.ok) throw new Error('Failed to create note');
  // return (await res.json()) as Note;
  throw new Error("Not implemented");
}

// PUBLIC_INTERFACE
export async function updateNote(id: string, input: NoteInput): Promise<Note> {
  /** Update a note by id. Returns the updated note. */
  const now = new Date().toISOString();
  if (USE_LOCAL) {
    const notes = loadLocal();
    const idx = notes.findIndex((n) => n.id === id);
    if (idx === -1) throw new Error("Note not found");
    const updated: Note = {
      ...notes[idx],
      title: input.title.trim(),
      content: input.content,
      category: input.category?.trim() || undefined,
      updatedAt: now,
    };
    notes[idx] = updated;
    saveLocal(notes);
    return updated;
  }
  // const res = await fetch(`${import.meta.env.PUBLIC_API_BASE_URL}/notes/${id}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(input),
  // });
  // if (!res.ok) throw new Error('Failed to update note');
  // return (await res.json()) as Note;
  throw new Error("Not implemented");
}

// PUBLIC_INTERFACE
export async function deleteNote(id: string): Promise<void> {
  /** Delete a note by id. */
  if (USE_LOCAL) {
    const notes = loadLocal().filter((n) => n.id !== id);
    saveLocal(notes);
    return;
  }
  // const res = await fetch(`${import.meta.env.PUBLIC_API_BASE_URL}/notes/${id}`, { method: 'DELETE' });
  // if (!res.ok) throw new Error('Failed to delete note');
}

// PUBLIC_INTERFACE
export function getAvailableCategories(notes: Note[]): string[] {
  /** Compute list of unique categories from notes. */
  const set = new Set<string>();
  for (const n of notes) {
    if (n.category && n.category.trim().length > 0) {
      set.add(n.category.trim());
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}
