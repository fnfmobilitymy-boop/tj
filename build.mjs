import {readFile,writeFile,mkdir,rm,cp} from 'node:fs/promises';
import {createHash} from 'node:crypto';
await rm('_site',{recursive:true,force:true});
await mkdir('_site',{recursive:true});
let html=await readFile('index.html','utf8');
for(const file of ['style.css','app.js','fleet-data.js','i18n.js','services.js','particles.js','carousel.js','navigation.js']){
 if(!html.includes('./'+file))continue;
 const bytes=await readFile(file);
 const hash=createHash('sha256').update(bytes).digest('hex').slice(0,12);
 const name=file.replace(/(\.[^.]+)$/,`.${hash}$1`);
 await writeFile('_site/'+name,bytes);
 html=html.replaceAll('./'+file,'./'+name);
}
await cp('assets','_site/assets',{recursive:true});
await writeFile('_site/index.html',html);
await writeFile('_site/.nojekyll','');
console.log('Built website with content-versioned CSS and JavaScript.');
