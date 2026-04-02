import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTodos, createTodo, deleteTodo, updateTodo, type Todo } from "@/api/todos";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Trash } from "lucide-react";

export default function TodoList() {
  const { data: todos = [], isLoading, error } = useTodos();
  const queryClient = useQueryClient();
  const [newTodoText, setNewTodoText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  const createMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setNewTodoText("");
      toast.success("Todo added");
    },
    onError: () => {
      toast.error("Failed to add todo");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast.info("Todo deleted");
    },
    onError: () => {
      toast.error("Failed to delete todo");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: () => {
      toast.error("Failed to update todo");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      createMutation.mutate(newTodoText.trim());
    }
  };

  const handleToggle = (todo: Todo) => {
    updateMutation.mutate({ _id: todo._id, completed: !todo.completed });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo._id);
    setEditText(todo.text);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText("");
  };

  const saveEdit = () => {
    if (editingId && editText.trim() && editText.trim() !== todos.find(t => t._id === editingId)?.text) {
      updateMutation.mutate({ _id: editingId, text: editText.trim() });
      toast.info("Todo updated");
    }
    cancelEditing();
  };

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  if (isLoading) return <Spinner />;
  if (error) return <div>Error loading todos</div>;

  return (
    <Card className="flex h-full w-full flex-col overflow-hidden">
      <CardHeader className="shrink-0 pb-2">
        <Label className="text-lg font-bold">Todo List</Label>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col gap-3">
        <form onSubmit={handleSubmit} className="flex shrink-0 gap-2">
          <Input
            type="text"
            placeholder="Add a new todo..."
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            disabled={createMutation.isPending}
          />
          <Button type="submit" size="icon" disabled={createMutation.isPending || !newTodoText.trim()}>
            {createMutation.isPending ? <Spinner className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </Button>
        </form>

        <ScrollArea className="min-h-0 flex-1">
          <div className="flex flex-col gap-2 pr-4">
            {todos.length === 0 ? (
              <p className="text-muted-foreground text-center text-sm">No todos yet. Add one above!</p>
            ) : (
              todos.map((todo) => (
                <div
                  key={todo._id}
                  className="flex items-center gap-3 rounded-md border p-3 transition-colors hover:bg-accent/50"
                >
                  <Checkbox
                    id={todo._id}
                    checked={todo.completed}
                    onCheckedChange={() => handleToggle(todo)}
                    disabled={updateMutation.isPending || editingId === todo._id}
                  />
                  {editingId === todo._id ? (
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
                      className="h-8 flex-1"
                    />
                  ) : (
                    <Label
                      htmlFor={todo._id}
                      className={`flex-1 cursor-pointer ${todo.completed ? "text-muted-foreground line-through" : ""}`}
                      onDoubleClick={(e) => {
                        e.preventDefault();
                        startEditing(todo);
                      }}
                    >
                      {todo.text}
                    </Label>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(todo._id)}
                    disabled={deleteMutation.isPending || editingId === todo._id}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
