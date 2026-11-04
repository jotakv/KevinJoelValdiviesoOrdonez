import {readFileSync,readdirSync} from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import {parse} from 'yaml';
import {masterSchema,profileSchema,type Profile} from './schema';
import {composeCV} from './compose-cv';
export function load(root=process.cwd()) {
 const master=masterSchema.parse(parse(readFileSync(path.join(root,'src/data/master.yaml'),'utf8')));
 const profiles:Profile[]=readdirSync(path.join(root,'src/content/cvs')).filter(f=>f.endsWith('.md')).sort().map(file=>{
   const slug=file.slice(0,-3);if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))throw new Error(`Invalid CV filename: ${file}`);
   try {const {data,content}=matter(readFileSync(path.join(root,'src/content/cvs',file),'utf8'),{engines:{yaml:s=>parse(s)}});return {...profileSchema.parse(data),slug,summary:content.trim()};}
   catch(e){throw new Error(`${file}: ${e instanceof Error?e.message:e}`);}
 });
 if(new Set(profiles.map(p=>p.id)).size!==profiles.length)throw new Error('Duplicate CV identifier');
 profiles.forEach(p=>composeCV(master,p)); // Drafts are validated but never emitted.
 const published=profiles.filter(p=>p.published).sort((a,b)=>a.order-b.order||a.slug.localeCompare(b.slug));
 return {master,profiles,published,cvs:published.map(p=>composeCV(master,p))};
}
