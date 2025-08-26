# Notes Frontend REST API Integration

This frontend uses a local in-browser storage for notes during development.
The service layer is implemented in `src/services/api.ts` and provides these PUBLIC interfaces:

- listNotes({ search?, category? })
- getNote(id)
- createNote({ title, content, category? })
- updateNote(id, { title, content, category? })
- deleteNote(id)
- getAvailableCategories(notes)

To connect a backend in the future:
1. Add an environment variable in the project `.env`:
   - PUBLIC_API_BASE_URL=https://your-backend.example.com
2. In `src/services/api.ts`, set `USE_LOCAL = false` and uncomment the `fetch` calls,
   or conditionally switch based on presence of `PUBLIC_API_BASE_URL`.
3. Ensure CORS is configured on the backend to allow requests from this frontend origin.

Note on Environment Variables:
- This repo should not include a `.env` file. Provide environment variables to the runtime.
- You may create a `.env.example` to document required values.
