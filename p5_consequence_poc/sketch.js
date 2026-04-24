// Proof-of-concept for the installation state machine.
// - Press `H` to toggle headphones on/off.
// - Press mouse to "press the button".
// - No audio/video assets yet: we use placeholder text + simple animations.

const STATE = {
  STATE0: "State 0",
  STATE1: "State 1",
  STATE2: "State 2",
  END1: "End 1",
  END2: "End 2",
};

let mode = STATE.STATE0;
let modeStartMs = 0;
let headphonesOn = false;
let consequenceVideo = null;
let state2VideoStarted = false;
let errorSound = null;
let state1Stars = [];
let end1Stars = [];

// For small UI pulses in State 2 wrong-button presses.
let wrongAnswerFlashUntil = 0;
let lastHeadphonesToggleAt = 0; // debounce to avoid double-triggering from multiple handlers
let state2WrongPressCount = 0;
let state2QuestionVisible = false;

// Durations (ms) to match the brainstorm: 5s blank, then 5s text fade-in; End screens 10s.
const STATE2_BLANK_MS = 5000;
const STATE2_VIDEO_MS = 5000;
const END_MS = 10000;
const STATE1_FADE_MS = 3000;
const END1_FADE_MS = 5000;

function enterMode(nextMode) {
  const prevMode = mode;
  mode = nextMode;
  modeStartMs = millis();
  wrongAnswerFlashUntil = 0;
  state2WrongPressCount = 0;
  state2QuestionVisible = false;

  if (nextMode === STATE.STATE2) {
    state2VideoStarted = false;
    if (consequenceVideo) {
      consequenceVideo.stop();
      consequenceVideo.time(0);
    }
  } else if (prevMode === STATE.STATE2 && consequenceVideo) {
    consequenceVideo.stop();
    consequenceVideo.time(0);
  }

  // In the "End" states the headphones should effectively be off.
  if (mode === STATE.END1 || mode === STATE.END2) headphonesOn = false;

  // In State 0 the booth prompt expects headphones to be off.
  if (mode === STATE.STATE0) headphonesOn = false;
}

function setup() {
  const w = Math.max(1, Math.floor(window.innerWidth || windowWidth || 1280));
  const h = Math.max(1, Math.floor(window.innerHeight || windowHeight || 720));
  createCanvas(w, h);
  pixelDensity(1);
  textFont("system-ui");
  consequenceVideo = createVideo(["./assets/video.mp4"]);
  consequenceVideo.hide();
  consequenceVideo.pause();
  consequenceVideo.volume(1);
  consequenceVideo.elt.loop = true;
  errorSound = new Audio("./assets/error.mp3");
  errorSound.preload = "auto";
  initState1Stars();
  initEnd1Stars();
  enterMode(STATE.STATE0);

  // Global handler so `H` works even if the canvas isn't focused.
  window.addEventListener("keydown", (e) => {
    const k = e.key;
    if (k === "h" || k === "H") {
      e.preventDefault();
      handleHeadphonesToggle();
    } else if (k === "r" || k === "R") {
      e.preventDefault();
      enterMode(STATE.STATE0);
    }
  });
}

function windowResized() {
  const w = Math.max(1, Math.floor(window.innerWidth || windowWidth || 1280));
  const h = Math.max(1, Math.floor(window.innerHeight || windowHeight || 720));
  resizeCanvas(w, h);
  initState1Stars();
  initEnd1Stars();
}

function keyPressed() {
  // p5 also provides keyPressed; keep this as a fallback.
  if (key === "h" || key === "H" || key === "r" || key === "R") return;
}

function mousePressed() {
  if (mode === STATE.STATE1) {
    enterMode(STATE.STATE2);
  } else if (mode === STATE.STATE2) {
    // "Wrong answer": keep the same state and play the error sound.
    playErrorSound();
    state2WrongPressCount += 1;
    if (state2WrongPressCount >= 5) state2QuestionVisible = true;
  }
}

function draw() {
  // Auto-reset from End states.
  const elapsed = millis() - modeStartMs;
  if (mode === STATE.END1 && elapsed >= END_MS) enterMode(STATE.STATE0);
  if (mode === STATE.END2 && elapsed >= END_MS) enterMode(STATE.STATE0);

  drawBoothBackground();
  drawTopRightStateLabel();

  if (mode === STATE.STATE0) drawState0();
  if (mode === STATE.STATE1) drawState1();
  if (mode === STATE.STATE2) drawState2();
  if (mode === STATE.END1) drawEnd1();
  if (mode === STATE.END2) drawEnd2();
}

function handleHeadphonesToggle() {
  // Debounce: if both the global handler and p5 handler fire, avoid double transitions.
  const now = millis();
  if (now - lastHeadphonesToggleAt < 120) return;
  lastHeadphonesToggleAt = now;

  // Ignore headphone toggles during End states; the booth auto-resets.
  if (mode === STATE.END1 || mode === STATE.END2) return;

  headphonesOn = !headphonesOn;

  // State transitions based on the brainstorm state machine.
  if (mode === STATE.STATE0 && headphonesOn) {
    enterMode(STATE.STATE1);
  } else if (mode === STATE.STATE1 && !headphonesOn) {
    enterMode(STATE.END1);
  } else if (mode === STATE.STATE2 && !headphonesOn) {
    enterMode(STATE.END2);
  }
}

function drawTopRightStateLabel() {
  if (mode === STATE.STATE1 || mode === STATE.END1) return;
  const x = width - 14;
  const y = 16;
  const padX = 10;
  const padY = 8;

  const label = `${mode}\nHeadphones: ${headphonesOn ? "ON" : "OFF"}`;
  const lines = label.split("\n");

  // Estimate background size.
  const lineH = 16;
  const boxW = Math.max(...lines.map((s) => textWidth(s))) + padX * 2;
  const boxH = lines.length * lineH + padY * 2 - 2;

  noStroke();
  fill(0, 0, 0, 160);
  rect(x - boxW, y, boxW, boxH, 10);

  fill(255);
  textAlign(LEFT, TOP);
  textSize(14);
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], x - boxW + padX, y + padY + i * lineH);
  }
}

function drawBoothBackground() {
  // Default background changes slightly by state to make it obvious for testing.
  if (mode === STATE.STATE0) {
    background(8, 8, 12);
  } else if (mode === STATE.STATE1) {
    background(0);
  } else if (mode === STATE.STATE2) {
    background(0);
  } else {
    background(0);
  }
}

function drawButton() {
  const bx = width * 0.52;
  const by = height * 0.68;

  const isEnabled = mode === STATE.STATE1;
  const t = millis();
  const glow = isEnabled ? (0.35 + 0.65 * (sin(t / 160) * 0.5 + 0.5)) : 0.12;

  // Button body
  noStroke();
  fill(55, 0, 0, 220);
  rectMode(CENTER);
  rect(bx, by + 64, 160, 18, 9);

  // Mushroom-style top
  fill(180, 10, 10, 210);
  ellipse(bx, by, 160, 140);

  // Rim glow (pulsing)
  noFill();
  stroke(255, 40, 40, 90 + 150 * glow);
  strokeWeight(8);
  ellipse(bx, by, 180 + glow * 18, 160 + glow * 10);

  // Enabled indicator
  noStroke();
  fill(255, 180, 180, 220);
  textAlign(CENTER, CENTER);
  textSize(14);
  if (isEnabled) text("PRESS", bx, by + 4);
}

function drawHeadphonesIndicator() {
  const hx = width * 0.18;
  const hy = height * 0.68;

  // Simple "headphones on a holder" icon: show ON by bright white + glow.
  const on = headphonesOn && (mode === STATE.STATE1 || mode === STATE.STATE2);

  noStroke();
  fill(on ? 240 : 70);
  ellipse(hx, hy + 40, 90, 22);

  if (on) {
    // Arc glow
    noFill();
    stroke(255, 255, 255, 90);
    strokeWeight(8);
    arc(hx, hy + 12, 120, 95, PI, TWO_PI);
  }

  stroke(on ? 255 : 120);
  strokeWeight(4);
  noFill();
  arc(hx, hy + 12, 120, 95, PI, TWO_PI);
  line(hx - 55, hy + 12 + 10, hx - 70, hy + 40);
  line(hx + 55, hy + 12 + 10, hx + 70, hy + 40);
  noStroke();

  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(13);
  text(on ? "HEADPHONES ON" : "HEADPHONES OFF", hx, hy + 92);
}

function drawState0() {
  // Prompt to put on headphones.
  const x = width / 2;
  const y = height * 0.28;

  textAlign(CENTER, CENTER);
  fill(255);
  textSize(26);
  text("Put on the headphones", x, y);

  textSize(16);
  fill(255, 220);
  text("Press `H` to start", x, y + 30);

  // Small note for the button.
  fill(255, 160);
  textSize(14);
  text("Button is off until headphones are ON", x, y + 62);
}

function drawState1() {
  push();
  translate(width / 2, height / 2);
  for (const star of state1Stars) {
    star.update(10);
    star.show();
  }
  pop();

  let alphaVal = map(millis() - modeStartMs, 0, STATE1_FADE_MS, 0, 255);
  alphaVal = constrain(alphaVal, 0, 255);

  textAlign(CENTER, CENTER);
  noStroke();
  textFont("Cabin, system-ui, sans-serif");

  fill(255, alphaVal);
  textSize(24);
  text("This world is filled with noise.", width / 2, height / 2 - 80);

  fill(255, alphaVal);
  textSize(24);
  text("Truth is buried beneath it.", width / 2, height / 2 - 40);

  fill(255, alphaVal);
  textSize(20);
  text("Press the button to filter everything, confronting the core.", width / 2, height / 2);

  fill(200, alphaVal);
  textSize(20);
  text("Or leave.", width / 2, height / 2 + 30);
}

function initState1Stars() {
  state1Stars = [];
  const starCount = Math.max(1, floor((width * height) / 3000));
  for (let i = 0; i < starCount; i++) {
    state1Stars.push(new State1Star());
  }
}

function initEnd1Stars() {
  end1Stars = [];
  const starCount = Math.max(1, floor((width * height) / 3000));
  for (let i = 0; i < starCount; i++) {
    end1Stars.push(new End1Star());
  }
}

function drawState2() {
  // Sequence:
  // - 0-5s: black screen
  // - after 5s: full-screen looped video
  // - after 5+ wrong presses: show persistent question text until leaving State 2
  const t = millis() - modeStartMs;

  // 1) 0-5s black with subtle flicker
  if (t < STATE2_BLANK_MS) {
    flickerBackground();
    fill(255, 60);
    textAlign(CENTER, CENTER);
    textSize(14);
    text("Silence...", width / 2, height * 0.42);
    return;
  }

  // 2) show full-screen video (continuous loop after the blank phase)
  const videoPhase = t >= STATE2_BLANK_MS;
  if (!videoPhase) return;
  drawState2Video();

  // 3) show question only after 5+ wrong button presses; keep it visible.
  if (state2QuestionVisible) {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(26);
    text("How many times have you pressed, hoping for control?", width / 2, height * 0.86);
  }
}

function playErrorSound() {
  if (!errorSound) return;
  try {
    errorSound.pause();
    errorSound.currentTime = 0;
    const playPromise = errorSound.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        // Autoplay policies can reject playback in some browsers.
      });
    }
  } catch (_err) {
    // Ignore audio playback errors and keep interaction uninterrupted.
  }
}

function drawState2Video() {
  if (!consequenceVideo) return;

  if (!state2VideoStarted) {
    consequenceVideo.time(0);
    const playPromise = consequenceVideo.play();
    if (playPromise && typeof playPromise.then === "function") {
      playPromise
        .then(() => {
          state2VideoStarted = true;
        })
        .catch(() => {
          // Keep retrying on subsequent frames if the browser blocks play().
        });
    } else {
      // Older behavior: mark started and let paused-state check below recover.
      state2VideoStarted = true;
    }
  }

  // Recovery path: if playback stalls or was blocked earlier, try again.
  if (consequenceVideo.elt && consequenceVideo.elt.paused) {
    const retryPromise = consequenceVideo.play();
    if (retryPromise && typeof retryPromise.then === "function") {
      retryPromise
        .then(() => {
          state2VideoStarted = true;
        })
        .catch(() => {
          // Ignore and keep trying while in State 2.
        });
    }
  }

  // Draw video using "cover" behavior so the canvas is fully filled.
  const vw = consequenceVideo.elt.videoWidth || width;
  const vh = consequenceVideo.elt.videoHeight || height;
  const scale = Math.max(width / vw, height / vh);
  const dw = vw * scale;
  const dh = vh * scale;
  const dx = (width - dw) * 0.5;
  const dy = (height - dh) * 0.5;
  image(consequenceVideo, dx, dy, dw, dh);
}

function drawEnd1() {
  push();
  translate(width / 2, height / 2);
  for (const star of end1Stars) {
    star.update(2);
    star.show();
  }
  pop();

  const alpha = constrain(map(millis() - modeStartMs, 0, END1_FADE_MS, 0, 255), 0, 255);

  noStroke();
  textFont("Cabin, system-ui, sans-serif");
  fill(255, alpha);
  textAlign(CENTER, CENTER);
  textSize(24);
  text("You MAY escape from the WORLD,", width / 2, height / 2 - 40);
  text("but you NEVER escape from YOURSELF", width / 2, height / 2);
}

function drawEnd2() {
  const elapsed = millis() - modeStartMs;
  const alpha = constrain(elapsed / 600, 0, 1) * 255;

  fill(255, alpha);
  textAlign(CENTER, CENTER);
  textSize(30);
  text("True balance is not forced.\nIt is accepted.", width / 2, height * 0.48);

  fill(255, alpha * 0.7);
  textSize(14);
  text("Returning shortly...", width / 2, height * 0.68);
}

function drawTextBlock(content, x, y, w, lineH) {
  // Basic multi-line renderer. The input already contains \n line breaks,
  // so we just keep those lines and optionally wrap long lines.
  const rawLines = content.split("\n");
  let cy = y;

  for (const raw of rawLines) {
    const words = raw.split(" ");
    let line = "";

    for (const word of words) {
      const test = line.length ? `${line} ${word}` : word;
      if (textWidth(test) <= w) {
        line = test;
      } else {
        fill(255);
        textAlign(LEFT, TOP);
        text(line, x, cy);
        cy += lineH;
        line = word;
      }
    }

    if (line.length) {
      fill(255);
      textAlign(LEFT, TOP);
      text(line, x, cy);
      cy += lineH;
    }
  }
}

function flickerBackground() {
  // Small visual effect to reinforce "silence" in the 0-5s phase.
  // (No audio in this POC.)
  noStroke();
  const t = millis();
  const flick = (sin(t / 70) * 0.5 + 0.5) * 18;
  fill(flick);
  rect(0, 0, width, height);
}

class State1Star {
  constructor() {
    this.x = random(-width, width);
    this.y = random(-height, height);
    this.z = random(width);
    this.pz = this.z;
  }

  update(speed) {
    this.z -= speed;
    if (this.z < 1) {
      this.z = width;
      this.x = random(-width, width);
      this.y = random(-height, height);
      this.pz = this.z;
    }
  }

  show() {
    fill(255);
    noStroke();

    const sx = map(this.x / this.z, 0, 1, 0, width);
    const sy = map(this.y / this.z, 0, 1, 0, height);
    const r = map(this.z, 0, width, 8, 0);
    ellipse(sx, sy, r, r);

    const px = map(this.x / this.pz, 0, 1, 0, width);
    const py = map(this.y / this.pz, 0, 1, 0, height);
    this.pz = this.z;

    stroke(255, 50);
    line(sx, sy, px, py);
  }
}

class End1Star {
  constructor() {
    this.x = random(-width, width);
    this.y = random(-height, height);
    this.z = random(width);
    this.pz = this.z;
  }

  update(speed) {
    this.z -= speed;
    if (this.z < 1) {
      this.z = width;
      this.x = random(-width, width);
      this.y = random(-height, height);
      this.pz = this.z;
    }
  }

  show() {
    const blue = color(37, 45, 108);
    fill(blue);
    noStroke();

    const sx = map(this.x / this.z, 0, 1, 0, width);
    const sy = map(this.y / this.z, 0, 1, 0, height);
    const r = map(this.z, 0, width, 8, 0);
    ellipse(sx, sy, r, r);

    const px = map(this.x / this.pz, 0, 1, 0, width);
    const py = map(this.y / this.pz, 0, 1, 0, height);
    this.pz = this.z;

    stroke(37, 45, 108, 50);
    strokeWeight(2);
    line(sx, sy, px, py);
  }
}

