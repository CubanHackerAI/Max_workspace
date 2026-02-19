# MEMORY.md - Long-Term Memory

## Projects

### YouTube Manager
A video production pipeline manager for Karel's YouTube channel(s).

**Key Details:**
- **Repo:** https://github.com/CubanHackerAI/youtube_channels_clawd
- **Stack:** Next.js 16, TipTap, Tailwind
- **Purpose:** Track video ideas through production pipeline, fetch competitor transcripts, AI-assisted script writing

**My Role:**
- Monitor for new instructions/notes via heartbeat
- Execute tasks Karel leaves in the notes
- Help format and organize transcripts
- Report on video pipeline status

### Heartbeat Monitoring
I check two endpoints regularly:
1. **Kanban:** `http://localhost:3000/api/tasks` - task board
2. **YouTube Manager:** `http://localhost:3001/api/videos` - video pipeline

State tracked in `memory/heartbeat-state.json`

---

## Workflows

### When Karel Leaves a Note
1. Detect new note via heartbeat
2. Read and understand the instruction
3. Execute the task
4. Add a completion note with `author: "max"`
5. Update heartbeat state

### Transcript Workflow
1. Karel adds video with YouTube URL
2. Click "Fetch Transcript" → Apify fetches it
3. Use TipTap AI Actions to format/structure
4. Process with Voice Profile → creates versioned transcript
5. Switch between versions using the version switcher in editor
6. Save formatted version

### Transcript Versioning (added 2025-01-30)
- Transcripts now support multiple versions
- Original fetched transcript is preserved
- Voice profile processing creates new versions
- Version switcher in TipTap editor to navigate versions
- Notes can reference specific versions via `versionId`

---

## Technical Notes

### TipTap SSR Fix
Always use `immediatelyRender: false` in useEditor to prevent hydration mismatch.

### ytdl-core Issues
Disabled in transcript.ts - YouTube keeps breaking their parser. Use Apify instead.

### Process Transcript Bug Fix (2025-01-30)
The "No transcript available to process" error was caused by `process-transcript` route not reading from the file system. After script versioning changes, transcripts are stored in `data/transcripts/{videoId}.html` but the route only checked `video.transcripts?.original?.content` or legacy `video.transcript`. Fixed by calling `getTranscript(id)` to read the file.

---

*Last updated: 2025-01-25*
