import { useEffect, useRef } from "react";
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import {
  Bold,
  Code,
  Heading2,
  Italic,
  List,
  ListChecks,
  ListOrdered,
  Quote,
  Strikethrough,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { markdownEditorExtensions } from "@/lib/markdownEditorExtensions";

interface MarkdownEditorProps {
  value: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

/**
 * Rich-text (WYSIWYG) editor whose value is markdown. Typing markdown
 * shortcuts (`# `, `- `, `**bold**`, `[ ] `) also works.
 */
export function MarkdownEditor({
  value,
  onChange,
  placeholder,
  className,
  autoFocus,
}: MarkdownEditorProps) {
  const onChangeRef = useRef(onChange);
  // Last markdown this editor emitted, so echoes of our own value aren't re-applied.
  const lastEmittedRef = useRef(value);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const editor = useEditor({
    extensions: markdownEditorExtensions(placeholder),
    content: value,
    contentType: "markdown",
    autofocus: autoFocus ? "end" : false,
    // Fires only for real edits, not the initial load, so opening an old note
    // never triggers an autosave of a re-serialized body.
    onUpdate: ({ editor }) => {
      const markdown = editor.getMarkdown();
      lastEmittedRef.current = markdown;
      onChangeRef.current(markdown);
    },
  });

  // Sync external changes (e.g. switching to a different note).
  useEffect(() => {
    if (!editor || value === lastEmittedRef.current) return;
    lastEmittedRef.current = value;
    editor.commands.setContent(value, { contentType: "markdown", emitUpdate: false });
  }, [editor, value]);

  return (
    <div className={cn("flex flex-col gap-2", className)} onClick={(e) => e.stopPropagation()}>
      {editor && <Toolbar editor={editor} />}
      <EditorContent editor={editor} className="markdown text-sm" />
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor.isActive("bold"),
      italic: editor.isActive("italic"),
      strike: editor.isActive("strike"),
      code: editor.isActive("code"),
      heading: editor.isActive("heading", { level: 2 }),
      bulletList: editor.isActive("bulletList"),
      orderedList: editor.isActive("orderedList"),
      taskList: editor.isActive("taskList"),
      blockquote: editor.isActive("blockquote"),
    }),
  });

  const buttons = [
    {
      icon: Bold,
      label: "Bold",
      active: state.bold,
      run: () => editor.chain().focus().toggleBold().run(),
    },
    {
      icon: Italic,
      label: "Italic",
      active: state.italic,
      run: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      icon: Strikethrough,
      label: "Strikethrough",
      active: state.strike,
      run: () => editor.chain().focus().toggleStrike().run(),
    },
    {
      icon: Code,
      label: "Inline code",
      active: state.code,
      run: () => editor.chain().focus().toggleCode().run(),
    },
    {
      icon: Heading2,
      label: "Heading",
      active: state.heading,
      run: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      icon: List,
      label: "Bullet list",
      active: state.bulletList,
      run: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      icon: ListOrdered,
      label: "Numbered list",
      active: state.orderedList,
      run: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      icon: ListChecks,
      label: "Checklist",
      active: state.taskList,
      run: () => editor.chain().focus().toggleTaskList().run(),
    },
    {
      icon: Quote,
      label: "Quote",
      active: state.blockquote,
      run: () => editor.chain().focus().toggleBlockquote().run(),
    },
  ];

  return (
    <div className="flex flex-wrap gap-1 border-b pb-1">
      {buttons.map(({ icon: Icon, label, active, run }) => (
        <button
          key={label}
          type="button"
          title={label}
          aria-label={label}
          aria-pressed={active}
          // Keep the editor selection when clicking toolbar buttons.
          onMouseDown={(e) => e.preventDefault()}
          onClick={run}
          className={cn(
            "hover:bg-accent rounded p-1 opacity-70",
            active && "bg-accent opacity-100"
          )}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}
