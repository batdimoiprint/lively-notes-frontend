import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PicturesView from "./PicturesView";

vi.mock("@/components/home/PictureCards/PictureCardsGroup", () => ({
  default: () => <div data-testid="mock-picture-cards">Picture Cards</div>,
}));

vi.mock("@/components/home/PictureCards/ColorSearch", () => ({
  default: () => <div data-testid="mock-color-search">Color Search</div>,
}));

describe("PicturesView", () => {
  it("renders picture cards visible by default", () => {
    const { container } = render(<PicturesView />);
    const wrapper = container.querySelector(".origin-top");
    expect(wrapper).not.toBeNull();
    expect(wrapper?.className).toContain("max-h-[500px]");
    expect(wrapper?.className).toContain("scale-y-100");
    expect(wrapper?.className).toContain("opacity-100");
  });

  it("collapses picture cards when hideHeaders is true", () => {
    const { container } = render(<PicturesView hideHeaders={true} />);
    const wrapper = container.querySelector(".origin-top");
    expect(wrapper).not.toBeNull();
    expect(wrapper?.className).toContain("max-h-0");
    expect(wrapper?.className).toContain("scale-y-0");
    expect(wrapper?.className).toContain("opacity-0");
    expect(wrapper?.className).toContain("pointer-events-none");
  });
});
