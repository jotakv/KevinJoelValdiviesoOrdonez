import {test} from 'node:test';
import assert from 'node:assert/strict';
import {load} from '../src/lib/load';

const {master,profiles,cvs}=load();

test('four Markdown CVs are consolidated into one shared experience history',()=>{
  const jobs=master.experience.map(x=>x.id);
  assert.deepEqual(jobs,['freelance','bravent','alten','everis','ciemat']);
  assert.equal(new Set(jobs).size,jobs.length);
  assert.equal(master.experience.find(x=>x.id==='bravent')?.to,'2026-09');
  assert.equal(master.experience.find(x=>x.id==='freelance')?.from,'2026-09');
  assert.ok(master.experience.find(x=>x.id==='bravent')!.bullets.length>=10);
  assert.ok(master.experience.find(x=>x.id==='alten')!.bullets.length>=7);
});

test('the central record includes education, training and enriched skill categories',()=>{
  assert.deepEqual(master.education.map(x=>x.id),['dorset','ucm','clara-del-rey']);
  assert.ok(master.certifications.some(x=>x.id==='scrum-manager'));
  for(const id of ['dataverse-security','pcf-controls','fit-gap','stakeholders','azure-functions','ssis','alm','power-automate']){
    assert.ok(master.skills.some(x=>x.id===id),id);
  }
});

test('five variants are independently prioritised without duplicating facts',()=>{
  assert.equal(cvs.length,5);
  assert.ok(cvs.every(cv=>cv.version==='1.1.0'));
  const signatures=cvs.map(cv=>JSON.stringify({summary:cv.summary,skills:cv.technicalSkills.map(x=>x.id),bullets:cv.experience.flatMap(x=>x.bullets.map(b=>b.id))}));
  assert.equal(new Set(signatures).size,5);
  for(const cv of cvs){
    assert.ok(cv.experience.some(x=>x.id==='freelance'),cv.slug);
    assert.ok(cv.experience.some(x=>x.id==='bravent'),cv.slug);
    assert.ok(cv.education.some(x=>x.id==='dorset'),cv.slug);
    assert.ok(cv.experience.flatMap(x=>x.bullets).some(x=>x.id==='bravent-1'),cv.slug);
    assert.equal(cv.contact.phone,undefined,'legacy phone remains hidden');
    assert.equal(cv.contact.address,undefined,'no residential address published');
  }
  assert.ok(cvs.find(x=>x.id==='senior-functional-consultant')!.functionalSkills.some(x=>x.id==='requirements'));
  assert.ok(cvs.find(x=>x.id==='senior-technical-consultant')!.technicalSkills.some(x=>x.id==='plugins'));
  assert.ok(cvs.find(x=>x.id==='power-platform-consultant')!.technicalSkills.some(x=>x.id==='canvas-apps'));
});

test('unconfirmed numeric outcomes and OCR artefacts are not exposed in CV output',()=>{
  const rendered=JSON.stringify(cvs);
  for(const token of ['20%','20 %','1M records','23%','P—CSC','<mark>','38 Shanliss','899429829'])assert.ok(!rendered.includes(token),token);
  assert.ok(profiles.every(p=>p.language==='en'));
});
