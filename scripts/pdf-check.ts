import {readFile} from 'node:fs/promises';
import {getDocument} from 'pdfjs-dist/legacy/build/pdf.mjs';
export async function checkPDF(file:string,maxPages:number,expected:string[]) {
 const bytes=await readFile(file);
 if(bytes.subarray(0,5).toString()!=='%PDF-')throw new Error(`${file}: invalid PDF signature`);
 const doc=await getDocument({data:new Uint8Array(bytes),useSystemFonts:true}).promise;
 try{
  if(doc.numPages>maxPages)throw new Error(`${file}: ${doc.numPages} pages exceeds maxPages=${maxPages}. Select fewer bullets or raise the explicit limit.`);
  let text='';let links=0;
  for(let i=1;i<=doc.numPages;i++){
   const page=await doc.getPage(i);const v=page.getViewport({scale:1});
   if(Math.abs(v.width-595.28)>2||Math.abs(v.height-841.89)>2)throw new Error(`${file}: page ${i} is not A4 portrait`);
   const content=await page.getTextContent();text+=content.items.map(x=>'str'in x?x.str:'').join(' ')+' ';
   links+=(await page.getAnnotations()).filter(x=>x.subtype==='Link').length;
  }
  const normalize=(s:string)=>s.normalize('NFKC').replace(/\s+/g,'').trim();
  for(const s of expected)if(!normalize(text).includes(normalize(s)))throw new Error(`${file}: selectable text missing: ${s}`);
  if(text.trim().length<100)throw new Error(`${file}: insufficient selectable text`);
  return {pages:doc.numPages,characters:text.length,links,text};
 } finally {await doc.destroy();}
}
