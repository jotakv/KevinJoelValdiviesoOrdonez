import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {base} from '../site.config.mjs';
export async function serve() {
 const root=path.resolve('dist');
 const server=createServer(async(req,res)=>{
  try{
   const pathname=decodeURIComponent(new URL(req.url!,'http://localhost').pathname);
   if(!pathname.startsWith(base+'/')){res.writeHead(404).end();return;}
   let file=path.resolve(root,pathname.slice(base.length+1));
   if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
   if((await stat(file)).isDirectory())file=path.join(file,'index.html');
   const types:Record<string,string>={'.html':'text/html','.css':'text/css','.js':'text/javascript','.jpg':'image/jpeg','.png':'image/png','.pdf':'application/pdf'};
   res.writeHead(200,{'Content-Type':types[path.extname(file)]??'application/octet-stream'});res.end(await readFile(file));
  }catch{res.writeHead(404).end();}
 });
 await new Promise<void>(resolve=>server.listen(0,'127.0.0.1',resolve));
 const address=server.address();if(!address||typeof address==='string')throw new Error('No server address');
 return {origin:`http://127.0.0.1:${address.port}`,close:()=>new Promise<void>((resolve,reject)=>server.close(e=>e?reject(e):resolve()))};
}
