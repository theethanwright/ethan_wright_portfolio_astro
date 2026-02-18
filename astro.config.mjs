import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
	site: 'https://www.theethanwright.com',
	integrations: [
	  tailwind({
		applyBaseStyles: false,
	  }),
	],
	 
	build: {
	  format: 'file'
	},

	
	base: '/',
   	trailingSlash: "never",
	 

	
	server: { port: 1234, host: true}


  });