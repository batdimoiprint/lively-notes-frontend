import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import QuickCaptureModal, { formatQuickNoteTitle } from "./QuickCaptureModal";
import * as notesApi from "@/api/notes";

vi.mock("@/api/notes", () => ({
  createNotes: vi
    .fn()
    .mockResolvedValue({ _id: "new-note-1", title: "Sep 23, 2026, 9:00 PM", body: "Hello" }),
}));

function renderWithQuery(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

test("formatQuickNoteTitle formats date into readable string", () => {
  const date = new Date(2026, 8, 23, 21, 30);
  const formatted = formatQuickNoteTitle(date);
  expect(formatted).toContain("Sep 23, 2026");
  expect(formatted).toContain("9:30");
});

test("renders single textarea without title input and submits on Ctrl+Enter", async () => {
  const handleOpenChange = vi.fn();
  const createSpy = vi.spyOn(notesApi, "createNotes");

  renderWithQuery(
    <QuickCaptureModal open={true} onOpenChange={handleOpenChange} selectedSection="default" />
  );

  // Verify only textarea input is present, NO title input field
  expect(screen.queryByPlaceholderText(/^title$/i)).not.toBeInTheDocument();
  const textarea = screen.getByLabelText("Note content");
  expect(textarea).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Save note" })).toBeInTheDocument();

  // Type note content
  fireEvent.change(textarea, { target: { value: "Sudden brainstorm idea" } });

  // Press Ctrl+Enter to submit
  fireEvent.keyDown(textarea, { key: "Enter", ctrlKey: true });

  await waitFor(() => {
    expect(createSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        body: "Sudden brainstorm idea",
        sectionId: "default",
      })
    );
  });

  await waitFor(() => {
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });
});

test("does not submit empty note", async () => {
  const createSpy = vi.spyOn(notesApi, "createNotes");
  createSpy.mockClear();

  renderWithQuery(<QuickCaptureModal open={true} onOpenChange={vi.fn()} selectedSection="work" />);

  const textarea = screen.getByLabelText("Note content");
  fireEvent.change(textarea, { target: { value: "   " } });
  fireEvent.keyDown(textarea, { key: "Enter", ctrlKey: true });

  expect(createSpy).not.toHaveBeenCalled();
});

test("closes modal when clicking close or cancel button", async () => {
  const handleOpenChange = vi.fn();

  renderWithQuery(
    <QuickCaptureModal open={true} onOpenChange={handleOpenChange} selectedSection="default" />
  );

  const closeButton = screen.getByRole("button", { name: "Close" });
  fireEvent.click(closeButton);
  expect(handleOpenChange).toHaveBeenCalledWith(false);

  const cancelButton = screen.getByRole("button", { name: "Cancel" });
  fireEvent.click(cancelButton);
  expect(handleOpenChange).toHaveBeenCalledWith(false);
});
