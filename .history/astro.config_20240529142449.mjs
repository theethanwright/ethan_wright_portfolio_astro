import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
	// ...
	integrations: [
	  tailwind({
		applyBaseStyles: false,
	  }),
	],
  });

  {
	build: {
	  // Example: Generate `page.html` instead of `page/index.html` during build.
	  format: 'file'
	}
  }

  {
	// Example: Require a trailing slash during development
	trailingSlash: 'never'
  }