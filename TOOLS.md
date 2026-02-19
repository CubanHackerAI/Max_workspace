# TOOLS.md - Local Notes

Skills define *how* tools work. This file is for *your* specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:
- Camera names and locations
- SSH hosts and aliases  
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras
- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH
- home-server → 192.168.1.100, user: admin

### TTS
- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

## Idea Pipeline

**Location:** `/root/clawd/idea-pipeline`
**Port:** 3002

### Start Server
```bash
cd /root/clawd/idea-pipeline && npm run dev
```

### Stages
1. **Idea** - Original idea from ideabrowser
2. **MVP** - Skill/implementation completed
3. **Analysis** - Analyzing the result
4. **Refactoring** - Improving the code
5. **Testing** - Testing the app
6. **Publishing** - Deploying/publishing
7. **Marketing** - Marketing efforts
8. **Done** - Complete

### Key Endpoints
- `GET /api/ideas` - List all ideas
- `POST /api/ideas` - Create new idea
- `GET /api/ideas/[id]` - Get single idea
- `PATCH /api/ideas/[id]` - Update idea (including status)
- `DELETE /api/ideas/[id]` - Delete idea

### Drag & Drop
Drag idea cards between columns to update status automatically.

---

## YouTube Manager

**Location:** `/root/clawd/youtube-manager`
**GitHub:** https://github.com/CubanHackerAI/youtube_channels_clawd
**Port:** 3001

### Start Server
```bash
cd /root/clawd/youtube-manager && npm run dev -- -p 3001
```

### Key Endpoints
- `GET /api/videos?channelId=cubanhacker` - list videos
- `PATCH /api/videos/[id]` - update video
- `POST /api/videos/[id]/transcript` - fetch transcript via Apify
- `POST /api/ai/transform` - AI text transformations

### Features
- Video pipeline kanban (idea → script → filming → editing → review → published)
- Subtasks per video
- Notes/instructions system (Karel leaves notes, Max responds)
- TipTap AI editor for transcripts with formatting actions
- Competitor video tracking

### Required ENV (.env.local)
- `APIFY_TOKEN` - for transcript fetching
- `ANTHROPIC_API_KEY` - for AI formatting (optional)

---

## API Keys

### Apify
- Token: `[REDACTED - see 1Password]`
- Docs: https://docs.apify.com/api/v2

### Brave Search
- API Key: `[REDACTED - see 1Password]`
- Docs: https://api.search.brave.com/

---

---

## CrossAuto (Cursor IDE Control)

**Location:** `D:\code\crossauto`
**Server:** `http://172.29.176.1:9876` (Windows gateway IP)

### Start Server (on Windows)
```cmd
cd D:\code\crossauto
npm start
```

### Usage (NO CLICKS - just type!)
Karel leaves Cursor chat focused. Just type and Enter:
```bash
# Type prompt
curl -s -X POST http://172.29.176.1:9876/type \
  -H "Content-Type: application/json" \
  -d '{"text":"Your prompt"}'

# Submit
curl -s -X POST http://172.29.176.1:9876/key \
  -H "Content-Type: application/json" \
  -d '{"keys":["enter"]}'

# Screenshot to monitor
curl -s -X POST http://172.29.176.1:9876/cursor/screenshot \
  -H "Content-Type: application/json" \
  -d '{"scale":0.6}'
```

### New Project Workflow
All projects in `D:\code\clawdbot_work\`
```bash
# 1. Create folder
mkdir -p /mnt/d/code/clawdbot_work/PROJECT_NAME

# 2. Launch Cursor
curl -s -X POST http://172.29.176.1:9876/cursor/open \
  -H "Content-Type: application/json" \
  -d '{"folder":"D:\\code\\clawdbot_work\\PROJECT_NAME"}'

# 3. Wait + focus chat
sleep 5
curl -s -X POST http://172.29.176.1:9876/key \
  -H "Content-Type: application/json" \
  -d '{"keys":["ctrl","l"]}'

# 4. Type + submit
# ... then monitor with screenshots
```

### Key Endpoints
- `POST /cursor/open` - Launch Cursor on folder `{"folder":"D:\\path"}`
- `POST /type` - Type text
- `POST /key` - Press keys (e.g., `["enter"]`, `["ctrl","l"]`)
- `POST /cursor/screenshot` - Screenshot (focuses Cursor first)
- `POST /exec` - Run Windows command
- `GET /health` - Check server

**See full skill:** `/root/clawdbot/skills/cursor-control/SKILL.md`

---

Add whatever helps you do your job. This is your cheat sheet.
