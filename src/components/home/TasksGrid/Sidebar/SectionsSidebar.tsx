import { useState, useRef, useEffect, useMemo, type RefObject } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSections, createSection, deleteSection, updateSection, type Section } from "@/api/sections";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Plus, Trash, FolderIcon } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";

interface SectionsSidebarProps {
  selectedSection: string;
  onSectionSelect: (sectionId: string) => void;
  sectionCounts: Record<string, number>;
}

interface DroppableSectionProps {
  section: Section;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isEditing: boolean;
  editText: string;
  setEditText: (value: string) => void;
  saveEdit: () => void;
  cancelEditing: () => void;
  editInputRef: RefObject<HTMLInputElement | null>;
}

function DroppableSection({
  section,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  isEditing,
  editText,
  setEditText,
  saveEdit,
  cancelEditing,
  editInputRef,
}: DroppableSectionProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `section-${section._id}`,
  });

  return (
    <div
      ref={setNodeRef}
      className={` flex p-2 rounded-md gap-2 justify-between items-center ${
        isSelected ? "bg-accent" : ""
      } ${isOver ? "bg-accent/70 ring-2 ring-primary" : ""}`}
    >
      {isEditing ? (
        <Input
          ref={editInputRef}
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={saveEdit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              saveEdit();
            } else if (e.key === "Escape") {
              cancelEditing();
            }
          }}
          className="h-7 flex-1 text-sm"
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        />
      ) : (
        <>
          <FolderIcon className="h-4 w-4 shrink-0 " />
          <button
            className="flex-1 cursor-pointer truncate text-left text-sm "
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            {section.title}
          </button>
          {section.noteCount !== undefined && (
            <span className="text-muted-foreground text-xs ">{section.noteCount}</span>
          )}
          {section._id !== "default" && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash className="h-3 w-3" />
            </Button>
          )}
        </>
      )}
    </div>
  );
}

export default function SectionsSidebar({ selectedSection, onSectionSelect, sectionCounts }: SectionsSidebarProps) {
  const { data: sections = [], isLoading } = useSections();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);
  const addInputRef = useRef<HTMLInputElement>(null);

  // Ensure default "Notes" section always exists
  const allSections = useMemo(() => {
    const hasDefault = sections.some(s => s._id === "default");
    if (!hasDefault) {
      return [
        { _id: "default", title: "Notes", order: 0, noteCount: sectionCounts.default ?? 0, createdAt: new Date().toISOString() },
        ...sections
      ];
    }
    return sections.map((section) => ({
      ...section,
      noteCount: sectionCounts[section._id] ?? 0
    }));
  }, [sections, sectionCounts]);

  const createMutation = useMutation({
    mutationFn: (title: string) => createSection(title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      setNewSectionTitle("");
      setIsAdding(false);
      toast.success("Section created");
    },
    onError: () => {
      toast.error("Failed to create section");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.info("Section deleted");
    },
    onError: () => {
      toast.error("Failed to delete section");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
    },
    onError: () => {
      toast.error("Failed to update section");
    },
  });

  const handleCreate = () => {
    if (newSectionTitle.trim()) {
      createMutation.mutate(newSectionTitle.trim());
    }
  };

  const handleDelete = (id: string) => {
    if (id === "default") {
      toast.error("Cannot delete default section");
      return;
    }
    deleteMutation.mutate(id);
    if (selectedSection === id) {
      onSectionSelect("default");
    }
  };

  const startEditing = (section: Section) => {
    setEditingId(section._id);
    setEditText(section.title);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText("");
  };

  const saveEdit = () => {
    if (editingId && editText.trim()) {
      updateMutation.mutate({ _id: editingId, title: editText.trim() });
      toast.info("Section updated");
    }
    cancelEditing();
  };

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  useEffect(() => {
    if (isAdding && addInputRef.current) {
      addInputRef.current.focus();
    }
  }, [isAdding]);

  if (isLoading) return <Spinner />;

  return (
    <Card className="flex h-full shrink-0 flex-col overflow-hidden ">
      <CardHeader className="shrink-0 pb-2">
        <div className="flex items-center justify-between">
          <Label className="font-bold">Sections</Label>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col gap-2">
        {isAdding && (
          <div className="flex gap-1">
            <Input
              ref={addInputRef}
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              onBlur={() => {
                if (!newSectionTitle.trim()) setIsAdding(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreate();
                } else if (e.key === "Escape") {
                  setNewSectionTitle("");
                  setIsAdding(false);
                }
              }}
              placeholder="Section name..."
              className="h-8 text-sm"
            />
          </div>
        )}
        
        <ScrollArea className="min-h-0 flex-1">
          <div className="flex flex-col ">
            {allSections.map((section) => (
              <DroppableSection
                key={section._id}
                section={section}
                isSelected={selectedSection === section._id}
                onSelect={() => onSectionSelect(section._id)}
                onEdit={() => startEditing(section)}
                onDelete={() => handleDelete(section._id)}
                isEditing={editingId === section._id}
                editText={editText}
                setEditText={setEditText}
                saveEdit={saveEdit}
                cancelEditing={cancelEditing}
                editInputRef={editInputRef}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
