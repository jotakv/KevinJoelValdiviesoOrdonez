import { marked } from 'marked';
import sanitize from 'sanitize-html';
import { sectionNames, type Master, type Profile } from './schema';
export function composeCV(m:Master,p:Profile) {
  const local = (t:{en:string;es?:string}) => {
    const s=t[p.language];
    if(!s) throw new Error(`${p.slug}: missing ${p.language} translation: ${t.en}`);
    return s;
  };
  const pick = <T extends {id:string}>(xs:T[],ids:string[],where:string):T[] => ids.map(id=>{
    const x=xs.find(x=>x.id===id);if(!x)throw new Error(`${p.slug}: unknown ${where} reference "${id}"`);return x;
  });
  const contact = (kind:'phones'|'emails'|'addresses',key:string) => {
    if(key==='none')return undefined;
    const value=m.contacts[kind][key]; if(!value)throw new Error(`${p.slug}: unknown ${kind} selector "${key}"`);return value;
  };
  for(const key of Object.keys(p.experience.bullets))if(!p.experience.include.includes(key))throw new Error(`${p.slug}: bullets configured for unselected job ${key}`);
  for(const key of sectionNames)if(p.sections[key]&&!p.sectionOrder.includes(key))throw new Error(`${p.slug}: enabled section ${key} missing from sectionOrder`);
  const jobs=pick(m.experience,p.experience.include,'experience').map(e=>({id:e.id,employer:e.employer,role:local(e.role),from:e.from,to:e.to,bullets:pick(e.bullets,p.experience.bullets[e.id]??e.bullets.map(b=>b.id),'bullet').map(b=>({id:b.id,text:local(b.text)}))}));
  const skills=pick(m.skills,p.skills.include,'skill');
  for(const id of p.skills.first)if(!p.skills.include.includes(id))throw new Error(`${p.slug}: priority skill ${id} is not selected`);
  const sorted=[...pick(skills,p.skills.first,'priority skill'),...skills.filter(s=>!p.skills.first.includes(s.id))].map(s=>({id:s.id,text:local(s.text),kind:s.kind}));
  const items = (key:'projects'|'education'|'certifications'|'languages') => pick(m[key],p[key],key).map(x=>({id:x.id,text:local(x.text)}));
  const projects=items('projects'),education=items('education'),certifications=items('certifications'),languages=items('languages');
  // Return only selected public values. Never spread master or profile into the view.
  return {
    id:p.id,slug:p.slug,title:p.title,description:p.description,language:p.language,version:p.version,
    updatedAt:[m.updatedAt,p.updatedAt].sort().at(-1)!,pdfName:`kevin-valdivieso-${p.slug}.pdf`,maxPages:p.print.maxPages,
    name:m.identity.name,photo:p.print.showPhoto?m.identity.photo:undefined,
    contact:{phone:contact('phones',p.contact.phone),email:contact('emails',p.contact.email),address:contact('addresses',p.contact.address),linkedin:p.contact.linkedin?m.contacts.linkedin:undefined,github:p.contact.github?m.contacts.github:undefined},
    sectionOrder:p.sectionOrder.filter(k=>p.sections[k]),
    summary:p.sections.summary?sanitize(marked.parse(p.summary||local(m.identity.summary),{async:false}),{allowedTags:['p','strong','em','ul','ol','li','a'],allowedAttributes:{a:['href']},allowedSchemes:['https','mailto']}):'',
    experience:p.sections.experience?jobs:[],technicalSkills:p.sections.technicalSkills?sorted.filter(s=>s.kind==='technical'):[],functionalSkills:p.sections.functionalSkills?sorted.filter(s=>s.kind==='functional'):[],
    projects:p.sections.projects?projects:[],education:p.sections.education?education:[],certifications:p.sections.certifications?certifications:[],languages:p.sections.languages?languages:[]
  };
}
export type CV = ReturnType<typeof composeCV>;
