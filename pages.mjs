export const servicePages = [
  {key:'packages',file:'kuching-holiday-packages.html',title:'Kuching Holiday Packages'},
  {key:'chauffeur',file:'private-charter.html',title:'Private Charter'},
  {key:'journal',file:'blog.html',title:'Blog'},
  {key:'sabah',file:'sabah-car-rental.html',title:'Sabah Car Rental'},
  {key:'sabah-charter',file:'sabah-private-charter.html',title:'Sabah Private Charter'},
  {key:'sabah-holiday',file:'sabah-holiday-packages.html',title:'Sabah Holiday Packages'},
  {key:'terms',file:'terms.html',title:'Terms & Conditions'},
  {key:'orders',file:'my-order.html',title:'My Order'}
];

function setActiveNavigation(html,file){
  return html.replace(/<nav id="headerLinks"[\s\S]*?<\/nav>/,nav=>nav
    .replace(/ class="active"| aria-current="(?:location|page)"/g,'')
    .replace(/<a href="([^"]+)"/g,(tag,href)=>href===`./${file}`?`${tag} class="active" aria-current="page"`:tag));
}

export function createPages(source){
  const pages = {'index.html':setActiveNavigation(source,'index.html')};
  for(const page of servicePages){
    let html=source
      .replace(/<title>[\s\S]*?<\/title>/,`<title>${page.title} | TJ Kuching Car Rental</title>`)
      .replace('<body>','<body class="service-page-body">')
      .replace(/<div class="brand-intro"[\s\S]*?<\/noscript>/,'')
      .replace(/<main>[\s\S]*?<\/main>/,`<main class="service-page"><section id="travelServices" class="travel-services" data-page="${page.key}"></section></main>`)
      .replace(/<script src="\.\/(?:app|fleet-data|particles|carousel|quick-quote)\.js"><\/script>/g,'');
    html=setActiveNavigation(html,page.file);
    if(page.key==='orders')html=html.replace('id="bookingLookup"','id="bookingLookup" aria-current="page"');
    pages[page.file]=html;
  }
  return pages;
}
