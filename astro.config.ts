import { unified } from '@astrojs/markdown-remark';
import { defineConfig, fontProviders } from 'astro/config';
import rehypeScriptIndent from './src/lib/rehype-script-indent';

// https://astro.build/config
export default defineConfig({
	markdown: {
		processor: unified({
			rehypePlugins: [rehypeScriptIndent],
		}),
	},
	fonts: [
		{
			name: 'Shippori Mincho B1',
			cssVariable: '--font-lain-serif',
			provider: fontProviders.google(),
			fallbacks: ['serif'],
			subsets: ['latin', 'japanese'],
			styles: ['normal'],
			weights: [400],
		},
		{
			name: 'Shippori Antique B1',
			cssVariable: '--font-lain-sans',
			provider: fontProviders.google(),
			fallbacks: ['sans-serif'],
			subsets: ['latin', 'japanese'],
			styles: ['normal'],
			weights: [400],
		},
	],
});
