import { z } from 'zod';
export const sectionNames = ['summary','experience','technicalSkills','functionalSkills','projects','certifications','education','languages'] as const;
const id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const text = z.object({en:z.string().min(1),es:z.string().min(1).optional()}).strict();
const item = z.object({id, text}).strict();
const unique = <T>(xs:T[]) => new Set(xs).size === xs.length;
const ids = z.array(id).refine(unique, 'Duplicate reference');
export const masterSchema = z.object({
  updatedAt:z.string().date(),
  identity:z.object({name:z.string().min(1),headline:text,photo:z.string().regex(/^images\/[a-zA-Z0-9._-]+$/),summary:text}).strict(),
  contacts:z.object({phones:z.record(z.string()),emails:z.record(z.string().email()),addresses:z.record(z.string()),linkedin:z.string().url(),github:z.string().url()}).strict(),
  experience:z.array(z.object({id,employer:z.string(),role:text,from:z.string().regex(/^\d{4}-\d{2}$/),to:z.string().regex(/^\d{4}-\d{2}$/).nullable(),bullets:z.array(item)}).strict()),
  skills:z.array(z.object({id,text,kind:z.enum(['technical','functional'])}).strict()),
  projects:z.array(item),education:z.array(item),certifications:z.array(item),languages:z.array(item)
}).strict().superRefine((m,ctx)=>{
  const all=[...m.experience,...m.experience.flatMap(x=>x.bullets),...m.skills,...m.projects,...m.education,...m.certifications,...m.languages].map(x=>x.id);
  if(!unique(all))ctx.addIssue({code:'custom',message:'Master IDs must be globally unique'});
  for(const e of m.experience)if(e.to && e.to<e.from)ctx.addIssue({code:'custom',message:`${e.id}: end date precedes start`});
});
export const profileSchema = z.object({
  id, title:z.string().min(1),description:z.string().min(1),published:z.boolean(),order:z.number().int().nonnegative(),language:z.enum(['en','es']),version:z.string().regex(/^\d+\.\d+\.\d+$/),updatedAt:z.string().date(),
  contact:z.object({phone:z.string().default('none'),email:z.string().default('none'),address:z.enum(['city','full','none']).default('none'),linkedin:z.boolean().default(true),github:z.boolean().default(true)}).strict(),
  print:z.object({format:z.literal('A4'),showPhoto:z.boolean(),maxPages:z.number().int().min(1).max(20)}).strict(),
  sections:z.object(Object.fromEntries(sectionNames.map(k=>[k,z.boolean().default(true)])) as Record<typeof sectionNames[number],z.ZodDefault<z.ZodBoolean>>).strict(),
  sectionOrder:z.array(z.enum(sectionNames)).refine(unique,'Duplicate section').default([...sectionNames]),
  experience:z.object({include:ids,bullets:z.record(ids)}).strict(),
  skills:z.object({include:ids,first:ids}).strict(),
  projects:ids,education:ids,certifications:ids,languages:ids
}).strict();
export type Master = z.infer<typeof masterSchema>;
export type Profile = z.infer<typeof profileSchema> & {slug:string; summary:string};
