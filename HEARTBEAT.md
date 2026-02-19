# HEARTBEAT.md

## Periodic Checks

### Kanban Board (every heartbeat)
- Check http://localhost:3000/api/tasks for new tasks
- Look for tasks assigned to "max" in "todo" status
- Look for tasks in "approved" status that I can move to "done"
- Report any urgent (high priority) tasks
- **CHECK FOR NEW INSTRUCTIONS** → if Karel left instructions, ACT ON THEM immediately

### YouTube Manager (every 5 min / every 2nd heartbeat)
- Check http://localhost:3001/api/videos for video pipeline status
- Look for videos in "review" status → may need Karel's approval
- Look for high priority videos in "idea" status → report for attention
- **CHECK FOR NEW NOTES FROM KAREL** → ACT ON THEM immediately
- **CHECK FOR NEW SUBTASKS** assigned to me → pick up and work on them
- Videos stuck in same status >3 days → suggest nudge

### How to Detect New Items

Load state from `memory/heartbeat-state.json`. Compare known IDs with current IDs.
New items = IDs that exist now but weren't in the known list.
After processing, update the state file with new IDs.

### When You Find a Request

1. **Read it** — understand what Karel is asking
2. **Do it** — research, create subtasks, update status, whatever is needed
3. **Reply** — add a note/instruction confirming completion with `author: "max"`
4. **Update state** — mark the request as processed

### Transcript Auto-Format (every heartbeat)
- Check `data/transcripts/*.html` for unformatted transcripts
- Unformatted = starts with `<p>` and has no `<h2>` headers
- If found: format using the markdown converter pattern (h1/h2/h3, lists, blockquotes)
- Save formatted version back to the transcript file
- Log which transcripts were auto-formatted

**How to format:**
1. Split into logical sections by topic changes
2. Add `<h2>` for main sections, `<h3>` for subsections
3. Convert sentence lists to `<ul><li>` bullets
4. Use `<strong>` for key terms
5. Add `<hr>` between major sections

### Remotion Video Generation (every heartbeat)
- Check YouTube Manager for videos with status **"recording"** (script approved, ready for B-roll generation)
- For each "recording" video NOT in `memory/heartbeat-state.json` remotion.processedVideos:
  1. Get the video's script/transcript content from the video card
  2. Generate a composition name from the video title (slugified)
  3. Spawn Claude Code sub-agent in `/mnt/d/remotion/remotion` folder with prompt:
     ```
     Create a new remotion composition following the instructions on @BETTER_PROMPT2.md using the skills remotion-best-practices and tts-emotion for the following script:
     
     [VIDEO SCRIPT/TRANSCRIPT HERE]
     ```
  4. Add to remotion.processedVideos in heartbeat-state.json WITH the expected composition name:
     ```json
     { "videoId": "xxx", "compositionName": "video-title-slug", "sessionLabel": "remotion-xxx" }
     ```
  5. Add a note to the video confirming Remotion B-roll generation started with Karel's voice clone

**Workflow:** idea → script → **recording** (triggers Remotion) → editing → review → published

### Remotion B-Roll Recording (on Claude Code completion)
- Check for active sub-agent sessions with label starting with "remotion-"
- When a remotion sub-agent completes (no longer in sessions_list):
  1. Check if transcript file exists in `/mnt/d/remotion/remotion/src/*-transcripts.ts`
  2. If transcript has segments, run B-roll recorder:
     ```bash
     node /root/clawd/scripts/record-broll.js <transcript-file> /mnt/d/remotion/remotion/public
     ```
  3. Videos will be saved to `/mnt/d/remotion/remotion/public/b-roll/`
  4. Add a note to the YouTube Manager video card confirming B-roll is ready
  5. Update video status to "editing" if B-roll generation succeeded

### Remotion Slide Improvement (on Claude Code completion)
- After a remotion-* sub-agent completes composition creation:
  1. Look up the **specific composition name** from `remotion.processedVideos` matching that session
  2. Check if that composition already improved in `memory/remotion-improvements.json`
  3. If NOT improved, run the slide improver **only for that composition**:
     ```bash
     node /root/clawd/scripts/remotion-slide-improver.js <specific-composition-name>
     ```
  4. This spawns Claude Code for EACH slide with "Research and improve slide N..."
  5. Waits for each improvement to complete before next slide
  6. Progress tracked in `memory/remotion-improvements.json`

**Important:** Only improve the composition that was JUST created by the completed sub-agent.
Do NOT run on all compositions or the most recent one - use the tracked composition name.
  
**Note:** The improver script spawns `claude` CLI directly in the Remotion directory.
It does NOT improve slides itself - Claude Code does the actual work.

**B-Roll URLs mapping:**
- Intro/Homepage → clawd.bot
- Technical/GitHub → github.com/clawdbot/clawdbot  
- Memory/Persistent → docs.clawd.bot/concepts/memory
- Proactive/Heartbeats → docs.clawd.bot/concepts/heartbeats
- Security/Access → docs.clawd.bot/gateway/security
- Personality/Soul → docs.clawd.bot/workspace/workspace-files
- Installation → docs.clawd.bot/start/getting-started
- Skills/Community → clawdhub.com
- Showcase → docs.clawd.bot/start/showcase

### Other
- (add more checks here as needed)
