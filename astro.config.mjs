import { defineConfig } from 'astro/config';
import { site, base } from './site.config.mjs';
export default defineConfig({ site, base, output: 'static', trailingSlash: 'always' });
