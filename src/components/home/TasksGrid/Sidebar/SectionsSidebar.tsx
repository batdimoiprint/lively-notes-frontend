import { useState, useRef, useEffect, useMemo, type RefObject } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSections, createSection, deleteSection, updateSection, reorderSections, type Section } from "@/api/sections";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Plus, Trash, FolderIcon, MoreVertical, Edit2, ChevronUp, ChevronDown, Inbox, Check, X } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

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
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
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
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
}: DroppableSectionProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `section-${section._id}`,
  });



  const activeClass = isSelected
    ? "bg-accent/80 text-accent-foreground font-semibold shadow-xs"
    : "text-muted-foreground hover:bg-accent/40 hover:text-foreground";

  const dropClass = isOver
    ? "ring-2 ring-primary ring-offset-1 scale-[1.02] bg-primary/5"
    : "";

  return (
    <div
      ref={setNodeRef}
      className={`group relative flex items-center justify-between rounded-lg p-2 transition-all duration-200 ease-out select-none active:scale-[0.99] gap-2 ${activeClass} ${dropClass}`}
    >
      {/* Selected Indicator Pill */}
      {isSelected && (
        <span className="absolute left-1 top-2.5 bottom-2.5 w-1 rounded-full bg-primary" />
      )}

      {isEditing ? (
        <div
          className="flex items-center gap-1.5 w-full bg-background rounded-md border p-0.5 shadow-xs"
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <Input
            ref={editInputRef}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                saveEdit();
              } else if (e.key === "Escape") {
                cancelEditing();
              }
            }}
            className="h-7 flex-1 border-0 focus-visible:ring-0 px-2 text-sm shadow-none"
          />
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
            onClick={(e) => {
              e.stopPropagation();
              saveEdit();
            }}
          >
            <Check className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={(e) => {
              e.stopPropagation();
              cancelEditing();
            }}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      ) : (
        <>
          <div
            className="flex flex-1 items-center gap-2.5 min-w-0 cursor-pointer pl-1"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            {section._id === "default" ? (
              <Inbox className="h-4 w-4 shrink-0 text-primary transition-colors" />
            ) : (
              <FolderIcon className="h-4 w-4 shrink-0 transition-colors text-primary" />
            )}
            <span className="truncate text-sm font-medium leading-none">
              {section.title}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 pl-1">
            {section.noteCount !== undefined && section.noteCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-muted text-muted-foreground group-hover:bg-background/80 transition-colors">
                {section.noteCount}
              </span>
            )}

            {section._id !== "default" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit();
                    }}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Rename
                  </DropdownMenuItem>
                  {canMoveUp && (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveUp();
                      }}
                    >
                      <ChevronUp className="h-4 w-4 mr-2" />
                      Move Up
                    </DropdownMenuItem>
                  )}
                  {canMoveDown && (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveDown();
                      }}
                    >
                      <ChevronDown className="h-4 w-4 mr-2" />
                      Move Down
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                    }}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
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

  const reorderMutation = useMutation({
    mutationFn: reorderSections,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      toast.success("Sections reordered");
    },
    onError: () => {
      toast.error("Failed to reorder sections");
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

  const handleMoveUp = (id: string) => {
    const index = allSections.findIndex((s) => s._id === id);
    if (index > 1) {
      const newSections = [...allSections];
      const temp = newSections[index];
      newSections[index] = newSections[index - 1];
      newSections[index - 1] = temp;
      
      const customSectionIds = newSections
        .filter((s) => s._id !== "default")
        .map((s) => s._id);
      reorderMutation.mutate(customSectionIds);
    }
  };

  const handleMoveDown = (id: string) => {
    const index = allSections.findIndex((s) => s._id === id);
    if (index > 0 && index < allSections.length - 1) {
      const newSections = [...allSections];
      const temp = newSections[index];
      newSections[index] = newSections[index + 1];
      newSections[index + 1] = temp;

      const customSectionIds = newSections
        .filter((s) => s._id !== "default")
        .map((s) => s._id);
      reorderMutation.mutate(customSectionIds);
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
    <Card className="flex h-full w-64 shrink-0 flex-col overflow-hidden border-primary/10 shadow-lg backdrop-blur-md bg-card/45">
      <CardHeader className="shrink-0 pb-2">
        <div className="flex items-center justify-between">
          <Label className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Sections</Label>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full hover:bg-accent"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col gap-2">
        {isAdding && (
          <div className="flex items-center gap-1.5 border rounded-lg p-1 bg-background shadow-xs transition-all animate-in fade-in-50 slide-in-from-top-2 duration-150">
            <Input
              ref={addInputRef}
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreate();
                } else if (e.key === "Escape") {
                  setNewSectionTitle("");
                  setIsAdding(false);
                }
              }}
              placeholder="New section name..."
              className="h-8 flex-1 border-0 focus-visible:ring-0 px-2 text-sm shadow-none"
            />
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
              onClick={handleCreate}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={() => {
                setNewSectionTitle("");
                setIsAdding(false);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        <ScrollArea className="min-h-0 flex-1">
          <div className="flex flex-col gap-1 pr-2">
            {allSections.map((section, index) => (
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
                canMoveUp={index > 1}
                canMoveDown={index > 0 && index < allSections.length - 1}
                onMoveUp={() => handleMoveUp(section._id)}
                onMoveDown={() => handleMoveDown(section._id)}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
