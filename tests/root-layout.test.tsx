import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import RootLayout from "@/app/layout";

describe("root layout document shell", () => {
  it("renders the required html and body tags", () => {
    const markup = renderToStaticMarkup(
      <RootLayout>
        <main>Runtime verification</main>
      </RootLayout>
    );

    expect(markup).toContain('<html lang="en">');
    expect(markup).toContain("<body>");
    expect(markup).toContain("Runtime verification");
  });
});
