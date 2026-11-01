import {readFile,writeFile,mkdir,rm,cp} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {createPages} from './pages.mjs';
await rm('_site',{recursive:true,force:true});
await mkdir('_site',{recursive:true});
const documents=createPages(await readFile('index.html','utf8'));
const versions=new Map();
for(const file of ['style.css','app.js','fleet-data.js','ms.js','i18n.js','services.js','particles.js','carousel.js','navigation.js','quick-quote.js']){
 const bytes=await readFile(file);
 const hash=createHash('sha256').update(bytes).digest('hex').slice(0,12);
 const name=file.replace(/(\.[^.]+)$/,`.${hash}$1`);
 await writeFile('_site/'+name,bytes);
 versions.set(file,name);
}
await cp('assets','_site/assets',{recursive:true});
for(const [file,source] of Object.entries(documents)){
 let html=source;
 for(const [original,version] of versions)html=html.replaceAll('./'+original,'./'+version);
 await writeFile('_site/'+file,html);
}
await writeFile('_site/.nojekyll','');
console.log(`Built ${Object.keys(documents).length} independent pages with versioned assets.`);
