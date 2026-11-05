import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,cpSync,writeFileSync,rmSync,readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {load} from '../src/lib/load';
import {composeCV} from '../src/lib/compose-cv';
import {masterSchema,profileSchema} from '../src/lib/schema';
const fixture=()=>structuredClone(load());
test('five published profiles with distinct IDs',()=>{const d=fixture();assert.equal(d.cvs.length,5);assert.equal(new Set(d.cvs.map(c=>c.id)).size,5);});
test('phone/email/address selectors and no hidden master data in composed view',()=>{
 const {master,profiles}=fixture();const p=profiles[0];
 master.contacts.phones.secondary='+353 000 TEST';master.contacts.emails.other='test@example.com';master.contacts.addresses.full='SYNTHETIC FULL ADDRESS';master.contacts.addresses.city='TEST CITY';
 for(const key of ['primary','secondary']){p.contact.phone=key;assert.equal(composeCV(master,p).contact.phone,master.contacts.phones[key]);}
 p.contact.email='other';p.contact.address='full';assert.equal(composeCV(master,p).contact.email,'test@example.com');assert.equal(composeCV(master,p).contact.address,'SYNTHETIC FULL ADDRESS');
 p.contact.phone=p.contact.email=p.contact.address='none';p.contact.github=p.contact.linkedin=false;
 const output=JSON.stringify(composeCV(master,p));for(const secret of ['+353','SYNTHETIC','test@example.com','695 416','linkedin.com','github.com'])assert.ok(!output.includes(secret));
});
test('sections, photo, selection and order apply',()=>{
 const {master,profiles}=fixture();const p=profiles[0];p.print.showPhoto=false;p.sections.certifications=false;p.experience.include=['alten'];p.experience.bullets={alten:['alten-3','alten-1']};p.skills.first=['azure','d365'];
 const cv=composeCV(master,p);assert.equal(cv.photo,undefined);assert.deepEqual(cv.certifications,[]);assert.equal(cv.experience.length,1);assert.equal(cv.experience[0].bullets[0].id,'alten-3');assert.deepEqual(cv.technicalSkills.slice(0,2).map(s=>s.id),['azure','d365']);
});
test('single Master change propagates to all dependent profiles',()=>{
 const {master,profiles}=fixture();master.experience.find(e=>e.id==='bravent')!.bullets[0].text.en='SHARED UPDATE';
 for(const p of profiles)assert.ok(JSON.stringify(composeCV(master,p)).includes('SHARED UPDATE'));
});
test('invalid config and references fail with readable errors',()=>{
 const {master,profiles}=fixture();const p=profiles[0];p.experience.include=['unknown'];p.experience.bullets={};assert.throws(()=>composeCV(master,p),/unknown experience reference/);
 assert.throws(()=>profileSchema.parse({...p,print:{format:'Letter'}}));
 assert.throws(()=>masterSchema.parse({...master,skills:[...master.skills,master.skills[0]]}),/globally unique/);
 const q=fixture().profiles[0];q.contact.phone='missing';assert.throws(()=>composeCV(master,q),/unknown phones selector/);
});
test('Spanish requires actual translated facts, never silently publishes English',()=>{
 const {master,profiles}=fixture();profiles[0].language='es';assert.throws(()=>composeCV(master,profiles[0]),/missing es translation/);
});
test('new Markdown profile is discovered; unpublished profiles never enter public collection',()=>{
 const root=mkdtempSync(path.join(tmpdir(),'cv-discovery-'));
 try{mkdirSync(path.join(root,'src'),{recursive:true});cpSync('src/data',path.join(root,'src/data'),{recursive:true});cpSync('src/content',path.join(root,'src/content'),{recursive:true});
 const file=path.join(root,'src/content/cvs/solution-architect.md');writeFileSync(file,readFileSync('templates/solution-architect.md'));
 assert.equal(load(root).profiles.length,6);assert.equal(load(root).cvs.length,5);
 writeFileSync(file,readFileSync(file,'utf8').replace('published: false','published: true'));
 assert.equal(load(root).cvs.length,6);assert.ok(load(root).cvs.some(c=>c.slug==='solution-architect'));
 }finally{rmSync(root,{recursive:true,force:true});}
});
