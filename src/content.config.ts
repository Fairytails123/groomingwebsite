import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Legacy blog migration: filename = legacy ROOT-LEVEL slug (the old WordPress
// post lives at /why-dog-grooming-is-important/, not under /blog/), and
// pubDate = the ORIGINAL publish date (17 Apr 2020) — SEO + honesty.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      category: z.enum(['Grooming', 'Health & Care']),
      heroImage: image(),
      heroAlt: z.string().default(''),
    }),
});

export const collections = { blog };
