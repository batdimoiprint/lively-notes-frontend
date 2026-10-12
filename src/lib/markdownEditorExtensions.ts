import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extensions";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { Markdown } from "@tiptap/markdown";

// Extensions are shared with the round-trip test so it exercises the real config.
export const markdownEditorExtensions = (placeholder?: string) => [
  StarterKit.configure({
    link: { openOnClick: false, autolink: true },
  }),
  TaskList,
  TaskItem.configure({ nested: true }),
  Placeholder.configure({ placeholder }),
  // `breaks: true` turns a single newline into a hard break, which is how
  // plain-text notes written before markdown support were displayed.
  Markdown.configure({ markedOptions: { gfm: true, breaks: true } }),
];
