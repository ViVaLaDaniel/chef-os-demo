import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ChecklistRow } from "./ChecklistRow";

describe("ChecklistRow", () => {
  it("renders checklist content and calls the toggle handler", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <ChecklistRow
        item={{ id: "brief", title: "Короткий бриф смены проведен", done: false }}
        meta="Команда"
        onClick={onClick}
      />,
    );

    expect(screen.getByText("Короткий бриф смены проведен")).toBeInTheDocument();
    expect(screen.getByText("Команда")).toBeInTheDocument();

    await user.click(screen.getByRole("button"));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("shows completed items with a line-through state", () => {
    render(
      <ChecklistRow
        item={{ id: "brief", title: "Короткий бриф смены проведен", done: true }}
        onClick={() => {}}
      />,
    );

    expect(screen.getByText("Короткий бриф смены проведен")).toHaveClass("line-through");
  });
});
