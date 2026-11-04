import {mkdir,rm,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import {load} from '../src/lib/load';
import {serve} from './server';
import {checkPDF} from './pdf-check';
import {url} from '../site.config.mjs';
const {cvs}=load();
await rm('dist/pdfs',{recursive:true,force:true});await mkdir('dist/pdfs',{recursive:true});
const server=await serve();
const browser=await chromium.launch().catch(async e=>{await server.close();throw e;});
try{
 for(const cv of cvs){
  const page=await browser.newPage();
  const response=await page.goto(server.origin+url(`cv/${cv.slug}/`),{waitUntil:'networkidle'});
  if(response?.status()!==200)throw new Error(`Missing CV page: ${cv.slug}`);
  await page.emulateMedia({media:'print'});
  await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(async img=>{await img.decode();if(!img.naturalWidth)throw new Error('Image failed');}));});
  const expected=await page.locator('.cv-document').innerText();
  const file=`dist/pdfs/${cv.pdfName}`;
  await page.pdf({path:file,format:'A4',printBackground:true,preferCSSPageSize:true,tagged:true});
  const result=await checkPDF(file,cv.maxPages,[cv.name,cv.title,...cv.experience.flatMap(j=>j.bullets.map(b=>b.text))]);
  // Both formats must retain all document words, in the same sequence.
  const words=(s:string)=>s.normalize('NFKC').replace(/\s+/g,'').replace(/[•·]/g,'');
  if(words(expected)!==words(result.text))throw new Error(`${cv.slug}: PDF/HTML text mismatch`);
  if(Object.values(cv.contact).some(Boolean)&&result.links===0)throw new Error(`${cv.slug}: no clickable links`);
  console.log(`${cv.slug}: ${result.pages} A4 page(s), ${result.characters} selectable characters, ${result.links} links`);
  await page.close();
 }
 await mkdir('artifacts',{recursive:true});await writeFile('artifacts/pdf-summary.json',JSON.stringify(cvs.map(c=>({slug:c.slug,maxPages:c.maxPages})),null,2));
}finally{await browser.close();await server.close();}
