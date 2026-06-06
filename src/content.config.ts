import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/blog",
  }),

  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      slug: z.string().optional(),
      cover: image(),
    }),
});

const docs = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/docs",
  }),

  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string().default("Commands"),
    order: z.number().default(99),
    commands: z.array(z.string()).default([]),
  }),
});

export const collections = { blog, docs };
