import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const lain = defineCollection({
	loader: glob({ pattern: '*.md', base: './src/content/lain' }),
	schema: z.object({
		title: z.string().optional(),
		description: z.string().optional(),
		order: z.number().optional(),
	}),
});

export const collections = { lain };
