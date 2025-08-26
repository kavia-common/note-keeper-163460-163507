import { component$, useSignal, $, useTask$ } from "@builder.io/qwik";
import type { PropFunction } from "@builder.io/qwik";
import type { Note, NoteInput } from "~/services/api";

type NoteEditorProps = {
  note?: Note | null;
  onSave$?: PropFunction<(input: NoteInput) => Promise<void> | void>;
  onCancel$?: PropFunction<() => void>;
};

// PUBLIC_INTERFACE
export const NoteEditor = component$<NoteEditorProps>(({ note, onSave$, onCancel$ }) => {
  const title = useSignal(note?.title || "");
  const content = useSignal(note?.content || "");
  const category = useSignal(note?.category || "");

  useTask$(({ track }) => {
    track(() => note?.id);
    title.value = note?.title || "";
    content.value = note?.content || "";
    category.value = note?.category || "";
  });

  const handleSave$ = $(async () => {
    const payload: NoteInput = {
      title: title.value.trim(),
      content: content.value,
      category: category.value.trim() || undefined,
    };
    await onSave$?.(payload);
  });

  return (
    <div class="card editor">
      <div style={{ display: "grid", gap: 12 }}>
        <input
          class="input"
          placeholder="Title"
          value={title.value}
          onInput$={(e) => (title.value = (e.target as HTMLInputElement).value)}
        />
        <input
          class="input"
          placeholder="Category (optional)"
          value={category.value}
          onInput$={(e) => (category.value = (e.target as HTMLInputElement).value)}
        />
        <textarea
          class="textarea"
          placeholder="Write your note..."
          value={content.value}
          onInput$={(e) => (content.value = (e.target as HTMLTextAreaElement).value)}
        />
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button class="button" onClick$={onCancel$}>Cancel</button>
        <button class="button primary" onClick$={handleSave$}>{note ? "Save changes" : "Create note"}</button>
      </div>
    </div>
  );
});
