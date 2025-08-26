import { component$, $ } from "@builder.io/qwik";
import type { PropFunction } from "@builder.io/qwik";

type NavigationBarProps = {
  title?: string;
  onAddNote$?: PropFunction<() => void>;
  onSearchChange$?: PropFunction<(value: string) => void>;
};

// PUBLIC_INTERFACE
export const NavigationBar = component$<NavigationBarProps>(({ title = "Notes", onAddNote$, onSearchChange$ }) => {
  const handleInput$ = $((ev: Event) => {
    const value = (ev.target as HTMLInputElement).value;
    onSearchChange$?.(value);
  });

  return (
    <header class="app-header">
      <div class="brand">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M5 3h10l4 4v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm9 1.5V8h3.5L14 4.5z" />
        </svg>
        {title}
      </div>
      <div class="nav-actions">
        <input class="input" type="search" placeholder="Search notes..." onInput$={handleInput$} />
        <button class="button accent" onClick$={onAddNote$}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M11 11V6h2v5h5v2h-5v5h-2v-5H6v-2h5z" />
          </svg>
          New
        </button>
      </div>
    </header>
  );
});
