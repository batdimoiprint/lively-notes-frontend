import { render, screen, fireEvent } from "@testing-library/react";
import { expect, test, describe, beforeEach, vi } from "vitest";
import EdenNotebook from "./EdenNotebook";
import EdenNotebookForm from "./EdenNotebookForm";
import { INITIAL_EDEN_NOTEBOOK_ENTRIES } from "./edenNotebookData";

describe("EDEN Notebook Component", () => {
  beforeEach(() => {
    localStorage.clear();
    // Mock navigator.clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  test("contains all initial seeded entries from TASKS 9-1-26 through TASKS 10-1-26", () => {
    expect(INITIAL_EDEN_NOTEBOOK_ENTRIES.length).toBeGreaterThanOrEqual(17);

    const titles = INITIAL_EDEN_NOTEBOOK_ENTRIES.map((e) => e.title);
    expect(titles).toContain("TASKS 10-1-26");
    expect(titles).toContain("TASKS 9-29-26");
    expect(titles).toContain("TASKS 9-28-26");
    expect(titles).toContain("TASK 9-26-26");
    expect(titles).toContain("TASK 9-25-26");
    expect(titles).toContain("TASKS 9-24-26");
    expect(titles).toContain("TASKS 9-23-26");
    expect(titles).toContain("TASKS 9-22-26");
    expect(titles).toContain("TASKS 9-21-26");
    expect(titles).toContain("TASKS 9-18-26");
    expect(titles).toContain("TASKS 9-17-26");
    expect(titles).toContain("TASKS 9-15-26");
    expect(titles).toContain("TASKS 9-14-26");
    expect(titles).toContain("TASKS 9-11-26");
    expect(titles).toContain("TASKS 9-8-26");
    expect(titles).toContain("TASKS 9-7-26");
    expect(titles).toContain("TASKS 9-4-26");
    expect(titles).toContain("TASKS 9-3-26");
    expect(titles).toContain("TASKS 9-1-26");
  });

  test("renders EDEN Notebook title and initial list", () => {
    render(<EdenNotebook />);
    expect(screen.getByText("EDEN Notebook")).toBeInTheDocument();
    expect(screen.getAllByText("TASK 9-26-26").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("TASK 9-25-26").length).toBeGreaterThanOrEqual(1);
  });

  test("displays the three primary templated sections in selected entry view", () => {
    render(<EdenNotebook />);
    expect(screen.getByText("What I have done last workday")).toBeInTheDocument();
    expect(screen.getByText("What I will do today")).toBeInTheDocument();
    expect(screen.getByText("Blockers / Urgent Concerns / Other Concerns")).toBeInTheDocument();
  });

  test("form has the three required templated inputs", () => {
    const handleSave = vi.fn();
    render(<EdenNotebookForm onSave={handleSave} />);

    expect(screen.getByLabelText(/What I have done last workday/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/What I will do today/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Blockers \/ Urgent Concerns \/ Other Concerns/i)
    ).toBeInTheDocument();

    const whatIdidInput = screen.getByLabelText(/What I have done last workday/i);
    const whatIWillDoInput = screen.getByLabelText(/What I will do today/i);
    const blockersInput = screen.getByLabelText(/Blockers \/ Urgent Concerns \/ Other Concerns/i);

    fireEvent.change(whatIdidInput, { target: { value: "Completed Maker QA check" } });
    fireEvent.change(whatIWillDoInput, { target: { value: "Work on AI VA reference product" } });
    fireEvent.change(blockersInput, { target: { value: "None" } });

    const submitBtn = screen.getByRole("button", { name: /Add to Notebook/i });
    fireEvent.click(submitBtn);

    expect(handleSave).toHaveBeenCalledTimes(1);
    expect(handleSave).toHaveBeenCalledWith(
      expect.objectContaining({
        whatIdidLastWorkday: "Completed Maker QA check",
        whatIWillDoToday: "Work on AI VA reference product",
        blockers: "None",
      })
    );
  });

  test("allows searching entries by keyword", () => {
    render(<EdenNotebook />);
    const searchInput = screen.getByPlaceholderText(/Search tasks, blockers, dates.../i);

    fireEvent.change(searchInput, { target: { value: "Meralco" } });
    expect(screen.getByText("TASKS 9-7-26")).toBeInTheDocument();
  });

  test("copies standup format to clipboard", () => {
    render(<EdenNotebook />);
    const copyButton = screen.getByRole("button", { name: /Copy Standup/i });
    fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });
});
