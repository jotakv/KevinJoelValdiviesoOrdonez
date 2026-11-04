import {load} from '../src/lib/load';
import {existsSync} from 'node:fs';
try {const {master,profiles,published}=load();if(!existsSync(`public/${master.identity.photo}`))throw new Error('Profile photo missing');console.log(`Validated ${profiles.length} profiles (${published.length} published) and Master CV.`);}catch(e){console.error(e instanceof Error?e.message:e);process.exit(1);}
