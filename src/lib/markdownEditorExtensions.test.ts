import { describe, expect, it } from "vitest";
import { Editor } from "@tiptap/react";
import { markdownEditorExtensions } from "@/lib/markdownEditorExtensions";

function roundTrip(markdown: string) {
  const editor = new Editor({
    extensions: markdownEditorExtensions(),
    content: markdown,
    contentType: "markdown",
  });
  const out = editor.getMarkdown();
  editor.destroy();
  return out;
}

describe("markdown editor round-trip", () => {
  it("keeps single line breaks from legacy plain-text notes", () => {
    const out = roundTrip("buy milk\ncall mom\nfix bike");
    // Each line must remain on its own line (as a markdown hard break).
    expect(out.split("\n").map((l) => l.replace(/(\\| {2})$/, ""))).toEqual([
      "buy milk",
      "call mom",
      "fix bike",
    ]);
  });

  it("keeps paragraphs, lists, checklists and formatting", () => {
    const md = "# Title\n\n**bold** and *italic*\n\n- one\n- two\n\n- [ ] todo\n- [x] done";
    const out = roundTrip(md);
    expect(out).toContain("# Title");
    expect(out).toContain("**bold**");
    expect(out).toContain("- one");
    expect(out).toContain("- [ ] todo");
    expect(out).toContain("- [x] done");
  });

  it("is stable across repeated saves", () => {
    const once = roundTrip("line a\nline b\n\n- item");
    expect(roundTrip(once)).toBe(once);
  });
});
