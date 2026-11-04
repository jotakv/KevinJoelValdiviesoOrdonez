import {defineCollection} from 'astro:content';
import {glob} from 'astro/loaders';
import {profileSchema} from './lib/schema';
export const collections={cvs:defineCollection({loader:glob({pattern:'*.md',base:'./src/content/cvs'}),schema:profileSchema})};
