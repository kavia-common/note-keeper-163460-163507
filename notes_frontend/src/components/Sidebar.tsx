import { component$, PropFunction } from "@builder.io/qwik";

type SidebarProps = {
  categories: string[];
  activeCategory?: string;
  onSelectCategory$?: PropFunction<(category?: string) => void>;
};

// PUBLIC_INTERFACE
export const Sidebar = component$<SidebarProps>(({ categories, activeCategory, onSelectCategory$ }) => {
  return (
    <aside class="sidebar">
      <div>
        <div class="section-title">Categories</div>
        <div style={{ marginBottom: "12px" }}>
          <button
            class={"chip " + (!activeCategory ? "active" : "")}
            onClick$={() => onSelectCategory$?.(undefined)}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              class={"chip " + (activeCategory === c ? "active" : "")}
              onClick$={() => onSelectCategory$?.(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
});
