import { component$ } from "@builder.io/qwik";
import type { PropFunction } from "@builder.io/qwik";
import type { Note } from "~/services/api";

type NotesListProps = {
  notes: Note[];
  onEdit$?: PropFunction<(id: string) => void>;
  onDelete$?: PropFunction<(id: string) => void>;
  onOpen$?: PropFunction<(id: string) => void>;
};

// PUBLIC_INTERFACE
export const NotesList = component$<NotesListProps>(({ notes, onEdit$, onDelete$, onOpen$ }) => {
  if (!notes.length) {
    return <div class="empty card">No notes found. Create your first note!</div>;
  }

  return (
    <div class="notes-grid">
      {notes.map((note) => (
        <div key={note.id} class="card note-card">
          <h3>{note.title || "Untitled"}</h3>
          <div class="meta">
            Updated {new Date(note.updatedAt).toLocaleString()}
            {note.category ? <span class="badge" style={{ marginLeft: "8px" }}>{note.category}</span> : null}
          </div>
          <p style={{ color: "var(--color-text-muted)", margin: "8px 0 0 0" }}>
            {note.content.length > 120 ? note.content.slice(0, 120) + "…" : note.content || "No content"}
          </p>
          <div class="actions">
            <button class="button" onClick$={() => onOpen$?.(note.id)}>Open</button>
            <button class="button" onClick$={() => onEdit$?.(note.id)}>Edit</button>
            <button class="button" onClick$={() => onDelete$?.(note.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
});
