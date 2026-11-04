import {readFile,writeFile,rm} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
const dir='src/content/cvs/';const original=await readFile('src/data/master.yaml','utf8');
const run=(script:string)=>execFileSync('npm',['run',script],{stdio:'inherit'});
try{
 const template=await readFile('templates/solution-architect.md','utf8');
 await writeFile(dir+'acceptance-new-profile.md',template.replace('id: solution-architect','id: acceptance-new-profile').replace('published: false','published: true').replace('showPhoto: true','showPhoto: false').replace('phone: none','phone: acceptance').replace('certifications: true','certifications: false'));
 await writeFile(dir+'acceptance-draft.md',template.replace('id: solution-architect','id: acceptance-draft').replace('title: Solution Architect','title: UNPUBLISHED_SENTINEL'));
 await writeFile('src/data/master.yaml',original.replace('phones:\n','phones:\n    acceptance: "+353 000 TEST"\n    unused: "HIDDEN_PHONE_SENTINEL"\n'));
 run('build');run('export:pdf');run('test:site');
 const home=await readFile('dist/index.html','utf8');assert.ok(home.includes('acceptance-new-profile'));assert.ok(!home.includes('UNPUBLISHED_SENTINEL'));
 const added=await readFile('dist/cv/acceptance-new-profile/index.html','utf8');assert.ok(added.includes('+353 000 TEST'));assert.ok(!added.includes('data-section="certifications"'));assert.ok(!added.includes('class="cv-photo"'));
 console.log('End-to-end Markdown discovery passed: new page, catalogue entry and PDF; draft excluded.');
}finally{
 await writeFile('src/data/master.yaml',original);await rm(dir+'acceptance-new-profile.md',{force:true});await rm(dir+'acceptance-draft.md',{force:true});
 run('build');run('export:pdf');
}
