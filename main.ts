import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";

// Real-Life Patch Notes: The Comedy Changelog (make.fun).
// One original patch note, at most 160 characters, for a bug in
// real life or human biology, in the terse register of a release
// note. This program writes the note to /output/entry.txt.
//
// The bug: a sneeze that builds up for ten seconds, then
// cancels itself at the last frame. The body runs the whole
// wind-up — the inhale, the squint, the held breath — and then
// aborts the job with no error message. Everyone has lived it;
// nobody has ever gotten the sneeze back.
const PATCH =
  "v3.0.2: fixed a bug where a sneeze built up for ten seconds, then cancelled itself at the last frame.";

// Gate from the bounty rules: /output/entry.txt must be UTF-8
// text of 1 to 160 characters, not only white space.
const GATE = { minChars: 1, maxChars: 160 } as const;

function countCodePoints(text: string): number {
  return [...text].length;
}

function containsControlChars(text: string): boolean {
  // One clean line: no line breaks, no control characters at all.
  return /[\u0000-\u001f\u007f]/.test(text);
}

function isReleaseNoteShape(text: string): boolean {
  // Criterion 3 of the judge's brief: the line must read like an
  // actual release note — a version number, then a fix stated as
  // if it shipped. Enforce the shape in code so the entry can
  // never drift out of the release-note register by accident.
  return /^v\d+\.\d+\.\d+: fixed a bug where .+\.$/.test(text);
}

function validatePatch(text: string): void {
  const chars = countCodePoints(text);
  if (chars < GATE.minChars || chars > GATE.maxChars) {
    throw new Error(
      `patch note must be ${GATE.minChars}-${GATE.maxChars} characters, got ${chars}`,
    );
  }
  if (text.trim().length === 0) {
    throw new Error("patch note must not be only white space");
  }
  if (containsControlChars(text)) {
    throw new Error("patch note must be a single line without control characters");
  }
  if (!isReleaseNoteShape(text)) {
    throw new Error(
      "patch note must read like a release note: vX.Y.Z: fixed a bug where ...",
    );
  }
}

function emitPatch(): void {
  validatePatch(PATCH);
  mkdirSync("/output", { recursive: true });
  writeFileSync("/output/entry.txt", PATCH, "utf8");
}

function confirmPatch(): void {
  // Read back and confirm the file holds exactly the patch note.
  const back = readFileSync("/output/entry.txt", "utf8");
  if (back !== PATCH) {
    throw new Error("read-back mismatch: entry.txt differs from PATCH");
  }
  console.log(
    `wrote /output/entry.txt (${countCodePoints(PATCH)} chars, ${Buffer.byteLength(PATCH, "utf8")} bytes)`,
  );
}

emitPatch();
confirmPatch();

// Sanity: the output directory must already exist for the read-back
// above, so report its presence as a final cheap assertion.
if (!existsSync("/output/entry.txt")) {
  throw new Error("entry.txt missing after write");
}
