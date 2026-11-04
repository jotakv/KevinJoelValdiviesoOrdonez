import assert from 'node:assert/strict';
import {readdir,readFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {chromium} from 'playwright';
import {load} from '../src/lib/load';
import {serve} from './server';
import {checkPDF} from './pdf-check';
import {url} from '../site.config.mjs';
const {master,cvs,profiles}=load();
const server=await serve();const browser=await chromium.launch().catch(async e=>{await server.close();throw e;});
try{
 const page=await browser.newPage();const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 async function auditPage(route:string){
  assert.equal((await page.goto(server.origin+route,{waitUntil:'networkidle'}))?.status(),200,route);
  await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));});
  const resources=await page.locator('a[href],img[src],link[href],script[src]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')??n.getAttribute('src')).filter(Boolean));
  for(const resource of resources){const u=new URL(resource!,page.url());if(u.origin!==server.origin)continue;assert.equal((await page.request.get(u.href)).status(),200,`Broken resource ${u.href}`);if(u.hash){assert.ok(await page.locator(`[id="${decodeURIComponent(u.hash.slice(1))}"]`).count() || u.pathname!==new URL(page.url()).pathname,`Missing anchor ${u.hash}`);}}
  assert.ok(await page.locator('h1').count());
 }
 await auditPage(url());assert.equal(await page.locator('.portrait img').getAttribute('alt'),master.identity.name);
 assert.equal(await page.locator('[data-profile]').count(),cvs.length);
 assert.deepEqual(await page.locator('[data-profile]').evaluateAll(ns=>ns.map(n=>n.getAttribute('data-profile'))),cvs.map(c=>c.slug));
 await mkdir('artifacts',{recursive:true});await page.screenshot({path:'artifacts/home-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Mobile overflow');await page.screenshot({path:'artifacts/home-mobile.png',fullPage:true});
 for(const cv of cvs){
  await auditPage(url(`cv/${cv.slug}/`));assert.equal(await page.locator('.cv-header h1').innerText(),cv.name);
  assert.equal(await page.locator('.cv-photo').count(),cv.photo?1:0);
  assert.equal(await page.locator('a[href^="tel:"]').count(),cv.contact.phone?1:0);
  const html=await page.content();for(const number of Object.values(master.contacts.phones))if(number!==cv.contact.phone)assert.ok(!html.includes(number),`Hidden phone leaked on ${cv.slug}`);
  for(const key of ['summary','experience','technicalSkills','functionalSkills','projects','education','certifications','languages'] as const)if(!cv.sectionOrder.includes(key))assert.equal(await page.locator(`[data-section="${key}"]`).count(),0);
  assert.deepEqual(await page.locator('[data-section="technicalSkills"] li').evaluateAll(ns=>ns.map(n=>n.getAttribute('data-id'))),cv.technicalSkills.map(s=>s.id));
  await page.evaluate(()=>{(window as unknown as {print:()=>void}).print=()=>{document.body.dataset.printCalled='yes';};});await page.locator('#print-cv').click();assert.equal(await page.locator('body').getAttribute('data-print-called'),'yes');
  await page.emulateMedia({media:'print'});assert.equal(await page.locator('.cv-toolbar').isVisible(),false);assert.equal(await page.locator('.site-header').isVisible(),false);if(cv.photo)assert.equal(await page.locator('.cv-photo').isVisible(),true);
  await page.emulateMedia({media:'screen'});
  const pdf=await checkPDF(`dist/pdfs/${cv.pdfName}`,cv.maxPages,[cv.name,cv.title]);assert.ok(pdf.links>0);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'CV mobile overflow');
 }
 for(const p of profiles.filter(p=>!p.published)){
  assert.equal((await page.request.get(server.origin+url(`cv/${p.slug}/`))).status(),404);
  assert.equal((await page.request.get(server.origin+url(`pdfs/kevin-valdivieso-${p.slug}.pdf`))).status(),404);
 }
 assert.deepEqual((await readdir('dist/pdfs')).sort(),cvs.map(c=>c.pdfName).sort());
 // Every emitted text asset must exclude contact values unused by every profile.
 async function files(dir:string):Promise<string[]>{return (await Promise.all((await readdir(dir,{withFileTypes:true})).map(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]))).flat();}
 const hidden=Object.values(master.contacts.phones).filter(v=>!cvs.some(c=>c.contact.phone===v));
 for(const file of await files('dist'))if(/\.(html|js|json|css)$/.test(file)){const contents=await readFile(file,'utf8');for(const value of hidden)assert.ok(!contents.includes(value),`${file}: unused phone leaked`);}
 assert.deepEqual(errors,[]);console.log(`Site acceptance passed: home, ${cvs.length} CVs, assets, print, PDF text, privacy, mobile layout.`);
}finally{await browser.close();await server.close();}
