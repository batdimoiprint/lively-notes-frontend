import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { JobLinkEditor } from "./JobTracker";

test("truncates a long link while retaining full editable value", () => {
  const value = "https://example.com/a-long-job-application-link-that-exceeds-the-table-cell-width";

  render(<JobLinkEditor value={value} onBlur={vi.fn()} />);

  const input = screen.getByRole("textbox");
  expect(input).toHaveValue(value);
  expect(input).toHaveAttribute("title", value);
  expect(input).toHaveClass("truncate", "whitespace-nowrap");
});
