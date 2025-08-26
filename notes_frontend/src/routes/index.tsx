import { component$, useSignal, useVisibleTask$, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { NavigationBar } from "~/components/NavigationBar";
import { Sidebar } from "~/components/Sidebar";
import { NotesList } from "~/components/NotesList";
import { NoteEditor } from "~/components/NoteEditor";
import {
  listNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  getAvailableCategories,
  type Note,
  type NoteInput,
} from "~/services/api";

// PUBLIC_INTERFACE
export default component$(() => {
  const notes = useSignal<Note[]>([]);
  const search = useSignal("");
  const category = useSignal<string | undefined>(undefined);
  const loading = useSignal(false);
  const error = useSignal<string | null>(null);

  const showEditor = useSignal(false);
  const editingId = useSignal<string | null>(null);
  const activeNote = useSignal<Note | null>(null);

  // Stable refresh function
  const refresh$ = $(async () => {
    loading.value = true;
    error.value = null;
    try {
      notes.value = await listNotes({ search: search.value, category: category.value });
    } catch (e: any) {
      error.value = e?.message || "Failed to load notes";
    } finally {
      loading.value = false;
    }
  });

  // Initial load
  useVisibleTask$(() => {
    refresh$();
  });

  // Watch search and category changes and refresh - avoid capturing refresh$ in QRL by re-invoking via window ref
  useVisibleTask$(({ track }) => {
    track(() => search.value);
    track(() => category.value);
    // call via microtask to avoid capturing locals
    queueMicrotask(() => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      refresh$();
    });
  });

  const handleAdd$ = $(() => {
    activeNote.value = null;
    editingId.value = null;
    showEditor.value = true;
  });

  const handleOpen$ = $(async (id: string) => {
    const n = await getNote(id);
    activeNote.value = n;
    editingId.value = null;
    showEditor.value = true;
  });

  const handleEdit$ = $(async (id: string) => {
    const n = await getNote(id);
    activeNote.value = n;
    editingId.value = id;
    showEditor.value = true;
  });

  const handleDelete$ = $(async (id: string) => {
    if (confirm("Delete this note?")) {
      await deleteNote(id);
      await refresh$();
    }
  });

  const handleSave$ = $(async (input: NoteInput) => {
    if (editingId.value) {
      await updateNote(editingId.value, input);
    } else {
      await createNote(input);
    }
    showEditor.value = false;
    activeNote.value = null;
    editingId.value = null;
    await refresh$();
  });

  const categories = () => getAvailableCategories(notes.value);

  return (
    <div class="app-shell">
      <NavigationBar
        title="Note Keeper"
        onAddNote$={handleAdd$}
        onSearchChange$={(v) => (search.value = v)}
      />
      <div class="app-main">
        <Sidebar
          categories={categories()}
          activeCategory={category.value}
          onSelectCategory$={(c) => (category.value = c)}
        />
        <section class="content">
          <div class="toolbar">
            <button class="button" onClick$={refresh$}>Refresh</button>
          </div>

          {error.value ? <div class="card" style={{ padding: "12px", color: "crimson" }}>{error.value}</div> : null}
          {loading.value ? <div class="card" style={{ padding: "12px" }}>Loading…</div> : null}

          {!showEditor.value ? (
            <NotesList
              notes={notes.value}
              onOpen$={handleOpen$}
              onEdit$={handleEdit$}
              onDelete$={handleDelete$}
            />
          ) : (
            <NoteEditor
              note={activeNote.value}
              onSave$={handleSave$}
              onCancel$={() => {
                showEditor.value = false;
                activeNote.value = null;
                editingId.value = null;
              }}
            />
          )}
        </section>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Note Keeper",
  meta: [
    {
      name: "description",
      content: "Create, search, and manage notes with a minimal modern UI.",
    },
  ],
};
