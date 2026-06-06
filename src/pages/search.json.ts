import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async () => {
  const entries = await getCollection("docs");

  const index = entries
    .map((e) => {
      // Strip frontmatter/markdown to a plain-text body for searching.
      const text = (e.body ?? "")
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/[#>*`_|\-]+/g, " ")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/\s+/g, " ")
        .trim();

      return {
        slug: e.id,
        title: e.data.title,
        description: e.data.description,
        category: e.data.category,
        order: e.data.order,
        commands: e.data.commands,
        body: text.slice(0, 1200),
      };
    })
    .sort((a, b) => a.order - b.order);

  return new Response(JSON.stringify(index), {
    headers: { "Content-Type": "application/json" },
  });
};
