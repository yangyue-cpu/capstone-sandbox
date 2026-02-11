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

### 3. Consequence State (Media Presentation)

**Sequence:**
1. **First 2-5 seconds:**
   - Display instant replay clip from webcam buffer
   - Shows participant pressing the button (last 2-3 seconds captured)
   - Simple freeze-frame effect: pause the replay at the moment of button press
   - **Implementation:** OBS Instant Replay source plays the cached buffer, then freezes on last frame

2. **Next 15 seconds - Media Format Options:**

   **Option A: p5.js (Recommended - Creative Coding Approach)**
   - **Format:** HTML file with p5.js library for creative visual programming
   - **Content:**
     - Background: Programmatically generated (gradient, particles, abstract patterns)
     - Main visual: Participant's face image (from instant replay) with creative effects
     - Text: Philosophical message with custom typography and animations
     - Effects: 
       - Zoom and transform effects on participant's image
       - Particle systems, data visualizations, or abstract patterns
       - Custom animations and transitions
       - Real-time visual effects (glitch, distortion, color manipulation)
   - **Implementation:** OBS Browser Source loads local HTML file with p5.js
   - **Pros:** 
     - Perfect for interactive art installations
     - Highly customizable visual effects
     - Can create unique, artistic visuals programmatically
     - Smooth animations and real-time rendering
     - Large community and extensive documentation
     - Can integrate with webcam/image data dynamically
   - **Tools:** Any text editor, p5.js library (CDN or local)
   - **Skills:** JavaScript basics, p5.js API (easy to learn)
   - **Example Effects:**
     - Slow zoom on participant's eyes with particle overlay
     - Glitch/distortion effects on the image
     - Data stream visualization (sound waves, data patterns)
     - Abstract geometric patterns that respond to the image

   **Option B: Static Image Sequence**
   - **Format:** Series of PNG/JPG images (3-5 images)
   - **Content:**
     - Image 1: Participant's face (extracted from instant replay) or generic image
     - Image 2: Same image with slight zoom
     - Image 3: Further zoom on eyes
     - Image 4: Full zoom with text overlay
     - Image 5: Final state with full text
   - **Implementation:** OBS Image Source, programmatically switch images every 3-4 seconds
   - **Pros:** Very simple, no video editing
   - **Tools:** Image editor (Photoshop, GIMP, or even online tools)

   **Option C: Live Image Processing (Real-Time Effects)**
   - **Format:** OBS filters applied to captured frame
   - **Content:**
     - Freeze frame from instant replay
     - Apply OBS filters: Zoom, Color Correction, Blur edges
     - Text source appears gradually
     - Background: Solid color source
   - **Implementation:** All in OBS, no external files needed
   - **Pros:** Fully dynamic, uses participant's actual image
   - **Cons:** Requires precise OBS filter configuration

   **Option D: Animated GIF**
   - **Format:** Single animated GIF file
   - **Content:** Simple animation (zoom, fade, text appearance)
   - **Implementation:** OBS Media Source plays GIF
   - **Pros:** Simple, single file
   - **Cons:** Limited quality, file size can be large

   **Option E: Code-Generated Visuals**
   - **Format:** Python script generating images/animations in real-time
   - **Content:** Script processes instant replay frame, generates visual with text
   - **Implementation:** Script outputs to image file, OBS Image Source reads it
   - **Pros:** Fully customizable, can add effects programmatically
   - **Tools:** Python with PIL/Pillow, OpenCV (optional)

3. **Recommended Approach: p5.js (Option A)**
   - Single HTML file with p5.js library (loaded via CDN or local file)
   - Creative coding approach perfect for art installations
   - Can load participant's image dynamically from instant replay
   - Programmatic visual effects (zoom, particles, glitch, data visualization)
   - Smooth animations and real-time rendering
   - Highly customizable and artistic
   - **OBS Setup:** Browser Source pointing to local HTML file
   - **File Structure:**
     - `consequence.html` - Main HTML file with p5.js sketch
     - Optional: `sketch.js` - p5.js code (can be embedded in HTML)
     - Optional: Image assets or data files

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
- **Recommended Setup (p5.js):**
  - **Sources:**
    - Black screen (solid color source) - shown for 2 seconds
    - Instant Replay Source: Plays captured buffer (2-3 seconds, shows participant pressing button)
    - Browser Source: Loads local HTML file with p5.js sketch
    - p5.js sketch handles: 
      - Image loading and display (participant's face from instant replay)
      - Creative visual effects (zoom, particles, glitch, data visualization)
      - Text rendering with custom typography
      - Real-time animations and transitions
    - **Note:** p5.js can load participant's image dynamically if extracted from instant replay, or use a generic image
  
- **Alternative Setup (Image Sequence):**
  - **Sources:**
    - Black screen (solid color source) - shown for 2 seconds
    - Instant Replay Source: Plays captured buffer first
    - Image Source: Switches between 3-5 images programmatically (via script or OBS scene transitions)
    - Text Source: Philosophical message (appears on final image)
    - Optional: Apply zoom filter to image source
  
- **Alternative Setup (Live Processing):**
  - **Sources:**
    - Solid color background (black/dark gray)
    - Instant Replay Source: Freezes on last frame
    - Apply OBS filters: Zoom, Color Correction, Blur
    - Text Source: Philosophical message (fades in gradually)
    - All effects applied in real-time, no external files needed

#### Hotkey Configuration
- **USB Button (e.g., F12):**
  1. Trigger Instant Replay recording
  2. Immediately switch to Scene 2 (Consequence)
  3. Stop all audio in Guidance Scene

### Consequence Media Requirements

**Option A: p5.js (Recommended - Creative Coding)**
- **Format:** Single HTML file with p5.js library
- **File Structure:**
  - `consequence.html` - Main HTML file with p5.js sketch
  - Optional: `sketch.js` - p5.js code (can be embedded in HTML or separate file)
  - Optional: Image assets (participant's face, generic images, fonts)
  - p5.js library loaded via CDN: `<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.js"></script>`
- **Content:**
  - **Background:** Programmatically generated (gradient, particles, abstract patterns)
  - **Main Visual:** 
    - `loadImage()` to display participant's face (from instant replay) or generic image
    - `image()` with `scale()` and `translate()` for zoom effects
    - Creative filters: `filter()`, `tint()`, custom pixel manipulation
  - **Text:** `text()` function with custom fonts and animations
  - **Effects Examples:**
    - Particle systems (`particles.js` or custom)
    - Data visualization (sound waves, data streams)
    - Glitch effects (pixel manipulation, color channel separation)
    - Geometric patterns (circles, lines, shapes)
  - **Philosophical Message:**
    ```
    "You attempted to filter the world, yet became the object of scrutiny.
    The clarity you sought is merely the reflection of self."
    ```
- **Production Tools:** 
  - Any text editor (VS Code recommended with p5.js extensions)
  - p5.js web editor for testing: https://editor.p5js.org/
- **Skills Required:** 
  - Basic JavaScript
  - p5.js API (well-documented, beginner-friendly)
  - Creative coding concepts (drawing, animation, image manipulation)
- **Pros:** 
  - Perfect for interactive art installations
  - Highly customizable and artistic
  - Real-time rendering and smooth animations
  - Large community and extensive examples
  - Can create unique visual effects programmatically
  - Easy to iterate and experiment
- **Learning Resources:**
  - p5.js official documentation: https://p5js.org/reference/
  - Coding Train YouTube channel (p5.js tutorials)
  - p5.js examples and reference

**Option B: Image Sequence**
- **Format:** 3-5 PNG/JPG images
- **Image Specifications:**
  - Resolution: Match OBS output resolution (e.g., 1920x1080)
  - Format: PNG (for transparency) or JPG
  - Content: Progressive zoom on face/eyes, text overlay on final image
- **Production Tools:** Image editor (Photoshop, GIMP, Canva, or online tools)
- **Skills Required:** Basic image editing
- **Pros:** Very simple, no coding needed
- **Cons:** Requires manual image creation, less dynamic

**Option C: Live OBS Processing (No External Files)**
- **Format:** Real-time OBS filters and sources
- **Setup:**
  - Freeze instant replay frame
  - Apply OBS built-in filters: Zoom, Color Correction, Blur
  - Add Text Source with fade-in
- **Production Tools:** None (all in OBS)
- **Skills Required:** OBS filter configuration
- **Pros:** Fully dynamic, uses actual participant image, no files needed
- **Cons:** Requires precise OBS setup, less control over timing

**Option D: Animated GIF**
- **Format:** Single animated GIF file
- **Specifications:**
  - Duration: 15-20 seconds
  - Resolution: Match OBS output
  - Content: Simple zoom/fade animation with text
- **Production Tools:** GIF animator (Photoshop, online GIF makers)
- **Pros:** Single file, simple
- **Cons:** Limited quality, large file size, less flexible

**Option E: Code-Generated Visuals**
- **Format:** Python script generating images/animations
- **Implementation:**
  - Script extracts frame from instant replay
  - Processes image (zoom, effects)
  - Generates final image with text overlay
  - Outputs to file that OBS reads
- **Production Tools:** Python with PIL/Pillow, OpenCV (optional)
- **Skills Required:** Basic Python programming
- **Pros:** Fully customizable, programmatic effects
- **Cons:** Requires programming knowledge

**Instant Replay Configuration:**
- Buffer duration: 2-3 seconds minimum
- Output format: Standard video (OBS default settings)
- **Transition:** After instant replay plays, OBS switches to consequence video/scene

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

**If Using p5.js for Consequence State (Option A):**
- **Web Browser** (for development/testing)
  - Modern browser (Chrome, Firefox, Safari, Edge)
  - p5.js library (loaded via CDN, no installation needed)
- **Development Tools:**
  - Text editor (VS Code recommended)
  - Optional: p5.js web editor (https://editor.p5js.org/) for quick prototyping
  - Optional: Local web server for testing (Python's `http.server`, Node's `http-server`, or VS Code Live Server extension)

### Media Assets Required

**Required for All Options:**
- Disorienting audio track (looping MP3/WAV)
- Guidance text (can be generated in OBS or as image overlay)

**Option-Specific Assets:**

**If using p5.js (Option A - Recommended):**
- `consequence.html` file with p5.js sketch
- Optional: `sketch.js` file (can be embedded in HTML)
- Optional: Generic eye/face image (stock photo) if not using participant's image
- Optional: Custom fonts (TTF/OTF) for text styling
- p5.js library (loaded via CDN, no download needed)
- Optional: Additional p5.js libraries (e.g., p5.sound for audio visualization)

**If using Image Sequence (Option B):**
- 3-5 PNG/JPG images (progressive zoom sequence)
- Text overlay can be embedded in final image or added via OBS Text Source

**If using Live Processing (Option C):**
- No additional media files needed (uses instant replay frame)

**If using Animated GIF (Option D):**
- Single animated GIF file (15-20 seconds)

**If using Code-Generated (Option E):**
- Python script for image processing
- Optional: Generic image assets for processing

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
