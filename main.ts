import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// Real-Life Patch Notes: The Comedy Changelog (make.fun).
// One patch note, at most 160 characters, for a bug in real life
// or human biology, written in the terse register of a shipped
// release note. This program writes the note to /output/entry.txt.
//
// The bug is the brain's stale name cache. It keeps calling the
// new manager by the old manager's name, in every meeting, for
// six weeks straight — and the old manager left in March. Three
// beats in one line: the wrong name, the public repetition, and
// the person who is not even there any more.
// v2 rebuild: the v1 sneeze line placed #1,479 in round 1, so this
// entry replaces it with a bug every office worker has shipped.
const NOTE =
  "v1.5.2: fixed a bug where the brain called the new manager by the old manager's name in every meeting for 6 weeks straight. The old manager left in March.";

const OUT_PATH = "/output/entry.txt";
const CHAR_LIMIT = 160;

// The gate from the bounty rules: /output/entry.txt must hold
// UTF-8 text of 1 to 160 characters, and must not be only
// white space. The judge's brief adds the shape: a version
// number, a terse engineering register, a fix stated as shipped.
function checkNote(note: string): void {
  const chars = [...note].length;
  if (chars < 1 || chars > CHAR_LIMIT) {
    throw new Error(`patch note must be 1-${CHAR_LIMIT} characters, got ${chars}`);
  }
  if (note.trim().length === 0) {
    throw new Error("patch note must not be only white space");
  }
  const hasControlChar = [...note].some((ch) => {
    const code = ch.codePointAt(0) as number;
    return code < 32 || code === 127;
  });
  if (hasControlChar) {
    throw new Error("patch note must be one clean line, no control characters");
  }
  const releaseNoteShape = /^v[0-9]+\.[0-9]+\.[0-9]+: fixed a bug where .+\.$/;
  if (!releaseNoteShape.test(note)) {
    throw new Error("patch note must read like a release note: vX.Y.Z: fixed a bug where ... .");
  }
}

function main(): void {
  checkNote(NOTE);
  mkdirSync("/output", { recursive: true });
  writeFileSync(OUT_PATH, NOTE, "utf8");
  const back = readFileSync(OUT_PATH, "utf8");
  if (back !== NOTE) {
    throw new Error("read-back mismatch: entry.txt does not hold NOTE");
  }
  const chars = [...NOTE].length;
  const bytes = Buffer.byteLength(NOTE, "utf8");
  console.log(`entry.txt written: ${chars} characters, ${bytes} bytes, no trailing newline`);
}

main();
