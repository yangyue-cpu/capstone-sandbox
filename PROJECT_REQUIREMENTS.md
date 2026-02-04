# Project Requirements: The Consequence of One Press

## Project Overview

**Artwork Name:** The Consequence of One Press  
**Type:** Interactive Installation  
**Primary Technology:** OBS Studio-based control system  

This is an interactive art installation that creates an intensely focused experience where participants perform a single action (pressing a button) that directly leads to a memorable, personalized consequence.

## Core Concept

- **Logic:** Press button → Play corresponding media
- **Interaction:** Single USB button press
- **Consequence:** Personalized video playback featuring the participant's image
- **Message:** Philosophical reflection on filtering vs. being filtered

---

## Software Architecture

### Primary Software Stack
- **Main Control System:** OBS Studio
- **Control Method:** 
  - Option A: OBS hotkeys (pure OBS approach)
  - Option B: Programmatic control via obs-websocket (recommended for better control)
- **Media Processing:** Pre-production tools (e.g., Premiere Pro, Final Cut)
- **Hardware Interface:** 
  - USB button (acts as keyboard input or triggers automation script)
  - Optional: Python/Node.js script for button handling and OBS control

### System Components

1. **OBS Studio Scenes**
   - **Scene 1: Guidance** - Initial state with text and audio
   - **Scene 2: Consequence** - Post-button-press video playback

2. **Media Elements**
   - Guidance text overlay
   - Disorienting audio track
   - Webcam source (continuous recording with buffer)
   - Pre-rendered consequence video template
   - Instant replay buffer (cached webcam footage)

3. **Hardware Integration**
   - USB button (simulates keyboard key press, e.g., F12)
   - Webcam input
   - Audio output (headphones/speakers)
   - Display output (TV/monitor)

---

## Functional Requirements

### 1. Initial State (Guidance Scene)

**Display:**
- White text on screen:
  ```
  "This world is filled with noise.
  Truth is buried beneath it.
  Press the button to filter everything, confronting the core.
  Or leave"
  ```

**Audio:**
- Continuous playback of disorienting audio track
- Mix of: news snippets, social media notifications, crowd noise
- Gradually becomes chaotic and irritating
- Loops continuously until button press

**Video:**
- Black/dark background
- Text overlay (white, centered)
- Webcam running in background (for buffering, not displayed)

---

### 2. Button Press Event

**Trigger:**
- USB button press → Keyboard key signal (e.g., F12)
- OBS hotkey assigned to trigger sequence

**Immediate Actions:**
1. **Stop all audio** (silence)
2. **Switch to black screen** (Scene transition to black)
3. **Capture Instant Replay** - Save last 2 seconds of webcam buffer
4. **Hold black screen for 2 seconds** (build suspense)

---

### 3. Consequence State (Video Playback)

**Sequence:**
1. **First 2-5 seconds:**
   - Display freeze-frame or 2-second clip from instant replay
   - Shows participant pressing the button
   - Captured from webcam buffer

2. **Next 15 seconds:**
   - Transition to pre-shot, artistically processed video
   - Slow zoom-in on participant's eyes from still frame
   - Text overlay appears:
     ```
     "You attempted to filter the world, yet became the object of scrutiny.
     The clarity you sought is merely the reflection of self."
     ```
   - Background: Minimalist, pulsating sound-wave or data stream patterns

3. **Final State:**
   - Display "Experience Ended"
   - Small light illuminates beside entrance curtain
   - System resets for next participant

---

## Technical Specifications

### OBS Studio Configuration

#### Scene 1: Guidance
- **Sources:**
  - Text Source: Guidance text (white, styled)
  - Media Source: Disorienting audio track
  - Webcam Source: Running in background (hidden from preview, used for buffer)
  - Instant Replay: Configured with 2-3 second buffer

#### Scene 2: Consequence
- **Sources:**
  - Black screen (solid color source)
  - Instant Replay Source: Plays captured buffer (first 2-5 seconds)
  - Media Source: Pre-rendered consequence video (starts after replay)
  - Text Overlay: Philosophical message (timed or embedded in video)

#### Hotkey Configuration
- **USB Button (e.g., F12):**
  1. Trigger Instant Replay recording
  2. Immediately switch to Scene 2 (Consequence)
  3. Stop all audio in Guidance Scene

### Video Production Requirements

**Consequence Video Template:**
- **Format:** MP4, H.264 or similar (OBS-compatible)
- **Structure:**
  - First 2 seconds: Black screen (placeholder for instant replay insertion)
  - Next 15 seconds: Artistically processed video with:
    - Slow zoom effect on participant's eyes
    - Text overlay
    - Background animations (sound waves/data streams)
- **Total Duration:** ~17-20 seconds

**Instant Replay Configuration:**
- Buffer duration: 2-3 seconds minimum
- Output format: Matched to consequence video specs
- Seamless transition from replay to template video

---

## User Flow / Workflow

1. **Setup Phase:**
   - Participant enters booth
   - Guidance scene is active (text + audio playing)
   - Webcam actively buffering in background

2. **Interaction Phase:**
   - Participant reads guidance text
   - Hears disorienting audio
   - Decides to press button

3. **Trigger Phase:**
   - Button pressed
   - Audio stops immediately
   - Screen goes black (2 second hold)
   - Instant replay captures last 2 seconds of webcam

4. **Consequence Phase:**
   - Replay plays (2-5 seconds)
   - Transitions to pre-rendered video (15 seconds)
   - Text appears with message
   - "Experience Ended" displays

5. **Reset Phase:**
   - Light illuminates
   - System returns to Guidance scene
   - Ready for next participant

---

## Technical Dependencies

### Software Requirements

**Core:**
- **OBS Studio** (latest stable version, 28+ recommended)
  - Instant Replay feature
  - Scene switching
  - Hotkey support
  - Media source playback
  - Text source overlay
  - **obs-websocket** (built-in for OBS 28+, plugin for older versions)

**If Using Programmatic Control (Option 2):**
- **Python 3.x** (recommended) or **Node.js**
  - Python: `obs-websocket-py` or `simpleobsws` library
  - Node.js: `obs-websocket-js` library
  - Additional libraries for USB button input (e.g., `pynput`, `keyboard` for Python)

### Media Assets Required
- Disorienting audio track (looping MP3/WAV)
- Consequence video template (MP4, 17-20 seconds)
- Guidance text (can be generated in OBS or as image overlay)

### Hardware Integration
- USB button driver (should work as standard keyboard input)
- Webcam driver/compatibility
- Audio output device

---

## Implementation Considerations

### OBS Studio Limitations & Workarounds

**If Using Hotkeys (Option 1):**
- **Instant Replay Integration:** Ensure OBS Instant Replay can be triggered via hotkey and seamlessly integrated into scene
- **Audio Control:** Need reliable method to stop audio immediately on scene switch
- **Scene Transitions:** Black screen transition should be instant, no fade
- **Timing Control:** Limited precision with hotkeys alone

**If Using Programmatic Control (Option 2 - Recommended):**
- **Instant Replay:** Can be triggered programmatically via WebSocket API (`SaveReplayBuffer` command)
- **Audio Control:** Can mute/unmute sources programmatically with precise timing
- **Scene Transitions:** Can control exact timing and transitions
- **Timing:** Precise 2-second delays achievable programmatically
- **Reset:** Can listen for media finished events and auto-reset

### Timing Requirements
- **Critical Timing:**
  - 2-second black screen hold (must be precise)
  - Instant replay insertion (seamless transition)
  - Text overlay timing (synchronized with video)

### Reliability Requirements
- **Reset Mechanism:** Automatic or manual reset after "Experience Ended"
- **Error Handling:** What happens if webcam fails? Button doesn't register?
- **Multiple Participants:** System must reset cleanly between participants

### Testing Scenarios
- Button press response time
- Instant replay capture quality
- Audio stop timing
- Video playback smoothness
- Scene transition performance
- Reset functionality

---

## Programmatic Control of OBS Studio

**Yes, OBS Studio can be controlled programmatically!**

### OBS WebSocket API

OBS Studio includes **obs-websocket** (built into OBS 28+, installable plugin for older versions), which provides a WebSocket-based API for programmatic control.

**Key Capabilities:**
- Switch scenes programmatically
- Control sources (show/hide, mute/unmute audio)
- Start/stop recording and streaming
- Save replay buffer on command
- Adjust audio levels
- Set text in text sources dynamically
- Listen for events (scene changes, media finished, etc.)
- Control media playback (start, stop, restart)

**Benefits for This Project:**
- More precise timing control than hotkeys
- Better error handling and state management
- Automated reset logic
- Event-driven programming (listen for media finished, etc.)
- Programmatic instant replay triggering
- Dynamic text updates

### Client Libraries

**Python:**
- `obs-websocket-py` - Official Python client
- `simpleobsws` - Simplified Python wrapper
- `obsws-python` - Alternative Python library

**JavaScript/Node.js:**
- `obs-websocket-js` - Official JavaScript client

**Other Languages:**
- Go, Rust, Dart/Flutter, and more have client libraries

### Setup Requirements

1. **Enable WebSocket Server in OBS:**
   - Tools → WebSocket Server Settings
   - Enable server (default port: 4455 for v5)
   - Set authentication password for security
   - Can restrict to localhost only

2. **Install Client Library:**
   ```bash
   # Python example
   pip install obs-websocket-py
   
   # Node.js example
   npm install obs-websocket-js
   ```

3. **Connection:**
   - Connect via WebSocket to `ws://localhost:4455`
   - Authenticate with password if enabled
   - Send commands via JSON-RPC protocol

### Example Workflow (Programmatic Approach)

**Button Press Handler:**
1. USB button → triggers script/application
2. Script sends WebSocket command to:
   - Save instant replay buffer
   - Mute all audio sources in Guidance scene
   - Switch to Black screen scene
   - Wait 2 seconds (programmatic delay)
   - Switch to Consequence scene
   - Start consequence video playback

**Event Handling:**
- Listen for "MediaInputPlaybackEnded" event
- When consequence video ends → reset to Guidance scene
- Auto-illuminate exit light

**Advantages:**
- Precise 2-second black screen timing
- Guaranteed audio stop
- Automated reset after video completion
- Error handling and logging
- State monitoring and debugging

---

## Alternative Implementation Approaches

### Option 1: Pure OBS Studio (Hotkey-Based)
- Use OBS's built-in features exclusively
- Rely on OBS Instant Replay
- Scene switching via hotkeys
- **Pros:** Simple, no additional code
- **Cons:** Limited timing control, harder to automate reset

### Option 2: OBS + Automation Script (Recommended)
- Python/Node.js script to control OBS via WebSocket
- USB button triggers script (or script monitors button)
- Script sends WebSocket commands to OBS
- **Pros:** 
  - Precise timing control
  - Better error handling
  - Automated reset logic
  - Event-driven architecture
  - Easier debugging and logging
- **Cons:** Requires additional development
- **Recommended Library:** Python with `obs-websocket-py` or Node.js with `obs-websocket-js`

### Option 3: Custom Application
- Build custom application using OBS libraries
- Full control over all aspects
- **Pros:** Maximum flexibility
- **Cons:** Most complex, likely overkill for this project

---

## Open Questions / Decisions Needed

1. **Reset Mechanism:**
   - Automatic reset after video ends?
   - Manual reset button/staff intervention?
   - Time-based reset?

2. **Error Handling:**
   - What if webcam fails during participant session?
   - What if button doesn't register?
   - Fallback experience?

3. **Multiple Participants:**
   - How long before automatic reset?
   - Queue system needed?

4. **Video Production:**
   - Who creates the consequence video template?
   - How to ensure artistic quality matches concept?

5. **Testing:**
   - Test participants before exhibition?
   - Beta testing period?

6. **Technical Support:**
   - On-site technical support during exhibition?
   - Remote monitoring capabilities?

---

## Next Steps

1. **Prototype OBS Setup:**
   - Create basic scene structure
   - Test instant replay functionality
   - Verify button hotkey integration

2. **Media Production:**
   - Record/create disorienting audio track
   - Produce consequence video template
   - Test video playback in OBS

3. **Hardware Testing:**
   - Verify USB button compatibility
   - Test webcam buffer reliability
   - Check audio output options

4. **Integration Testing:**
   - Full workflow testing
   - Timing validation
   - Reset mechanism testing

5. **Refinement:**
   - Optimize timing
   - Enhance visual/audio quality
   - Implement error handling

---

## Document Status

**Status:** Brainstorming / Requirements Gathering  
**Last Updated:** [Date]  
**Next Review:** [Date]

This document will be updated as the project evolves and technical decisions are made.
