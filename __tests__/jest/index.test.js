import { render, screen } from "@testing-library/react";
import Home from "@/pages/index";
import "@testing-library/jest-dom";

describe("Home", () => {
  it("renders a submit button", () => {
    render(<Home />);

    const button = screen.getByRole("button", {
      name: "Get Weather Data",
    });

    expect(button).toBeInTheDocument();
  });
});
