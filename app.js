/* PetCare front-end: datos y sesión simulados con localStorage (sin servidor). */
const $=(s,r=document)=>r.querySelector(s);
const PAGE=document.body.dataset.page, params=new URLSearchParams(location.search);
const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const LS={get(k,d){try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},
 set(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch{alert('No hay espacio para guardar. Usa una imagen más pequeña.');return false}}};
const users=()=>LS.get('pc_users',[]), me=()=>users().find(u=>u.id===LS.get('pc_session'));
const saveMe=u=>LS.set('pc_users',users().map(x=>x.id===u.id?u:x));
const flash=m=>sessionStorage.setItem('flash',m);
const AV=n=>`https://ui-avatars.com/api/?background=0e4f55&color=ffc43d&bold=true&size=200&name=${encodeURIComponent(n)}`;
const DEF='https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&q=60';
const plural=(n,a,b)=>`${n} ${n==1?a:b}`;
const loadImg=(f,max)=>new Promise((ok,no)=>{
 if(!/^image\/(jpeg|png|webp)$/.test(f.type))return no('Sube una imagen JPG, PNG o WEBP');
 const r=new FileReader();r.onload=()=>{const i=new Image();i.onload=()=>{
  const s=Math.min(1,max/Math.max(i.width,i.height)),c=document.createElement('canvas');
  c.width=i.width*s;c.height=i.height*s;c.getContext('2d').drawImage(i,0,0,c.width,c.height);ok(c.toDataURL('image/jpeg',.82))};i.src=r.result};r.readAsDataURL(f)});

function toast(m){const t=$('#toast');t.innerHTML=`<div class="flash" role="status">${esc(m)}</div>`;clearTimeout(toast.t);toast.t=setTimeout(()=>t.innerHTML='',4000)}
function layout(){
 const u=me();
 const user=u?`<details class="user"><summary><img class="avatar-sm" src="${u.avatar||AV(u.name)}" alt=""><span>${esc(u.name.split(' ')[0])}</span> ▾</summary><div class="menu"><a href="mi-cuenta.html">Mi cuenta</a><a href="perfil.html">Editar perfil</a><button data-act="logout">Cerrar sesión</button></div></details>`
  :`<a href="login.html">Iniciar sesión</a><a class="btn sm alt" href="registro.html">Crear cuenta</a>`;
 $('#nav').innerHTML=`<nav><div class="wrap"><a class="logo" href="index.html">Pet<span>Care</span></a><button id="burger" aria-label="Abrir menú">☰</button><div class="links" id="links"><a href="index.html#servicios">Servicios</a><a href="adopcion.html">Adopción</a><a href="consejos.html">Consejos</a><a href="contacto.html">Contacto</a>${user}</div></div></nav><div id="toast"></div>`;
 $('#foot').innerHTML=`<footer><div class="wrap fgrid"><div><a class="logo" href="index.html" style="color:#fff">Pet<span>Care</span></a><p>Cuidado, salud y cariño para tus mascotas en un solo lugar.</p></div><div><h4>Explora</h4><a href="adopcion.html">Adopción</a><a href="consejos.html">Consejos</a><a href="contacto.html">Contacto</a></div><div><h4>Servicios</h4><a href="index.html#servicios">Veterinaria</a><a href="index.html#servicios">Baño y peluquería</a><a href="index.html#servicios">Paseos</a></div><div><h4>Contacto</h4><p>San Isidro, Lima</p><p>hola@petcare.pe</p><p>Lun a sáb · 8:00 a 19:00</p></div></div><p class="copy">© ${new Date().getFullYear()} PetCare · Proyecto final</p></footer>`;
}
const artCard=a=>`<a class="card" href="articulo.html?slug=${a.slug}" style="text-decoration:none"><img src="${a.image}" alt="" loading="lazy"><div><small>${a.category}</small><h3>${a.title}</h3><p>${a.excerpt}</p></div></a>`;

/* ---------- Páginas ---------- */
const pages={
 home(){
  $('#homeAdopt').innerHTML=ADOPT.slice(0,3).map(a=>`<article class="card"><img src="${a.photo}" alt="${a.name}" loading="lazy"><div><h3>${a.name}</h3><p>${a.breed} · ${a.age}</p></div></article>`).join('');
  $('#homeArt').innerHTML=ARTICLES.slice(0,3).map(artCard).join('');
 },
 adopcion(){
  const sp=params.get('species')||'';
  $('#filters').innerHTML=[['','Todos'],['Perro','Perros'],['Gato','Gatos'],['Hámster','Hámsters']].map(([k,v])=>`<a class="btn sm ${sp==k?'alt':''}" href="adopcion.html${k?'?species='+k:''}">${v}</a>`).join('');
  const l=ADOPT.filter(a=>!sp||a.species==sp);
  $('#pets').innerHTML=l.length?l.map(a=>`<article class="card"><img src="${a.photo}" alt="${a.name}" loading="lazy"><div><h3>${a.name}</h3><p><strong>${a.breed}</strong> · ${a.age} · ${a.gender}</p><p>${a.description}</p><br><a class="btn sm" href="contacto.html?asunto=${encodeURIComponent('Adopción de '+a.name)}">Quiero adoptar</a></div></article>`).join(''):'<p class="empty">No hay mascotas en esta categoría por ahora.</p>';
 },
 consejos(){
  const cat=params.get('category')||'', n=c=>ARTICLES.filter(a=>a.category==c).length;
  $('#cats').innerHTML=`<a class="cat ${!cat?'on':''}" href="consejos.html"><span>📚</span><b>Todos</b><small>${plural(ARTICLES.length,'artículo','artículos')}</small></a>`+
   Object.entries(ICONS).map(([c,i])=>`<a class="cat ${cat==c?'on':''}" href="consejos.html?category=${c}"><span>${i}</span><b>${c}</b><small>${plural(n(c),'artículo','artículos')}</small></a>`).join('');
  const l=ARTICLES.filter(a=>!cat||a.category==cat), f=cat?null:l[0], rest=f?l.slice(1):l;
  $('#featured').innerHTML=f?`<a class="featured" href="articulo.html?slug=${f.slug}"><img src="${f.image}" alt="" loading="lazy"><div><small>Destacado · ${f.category}</small><h2>${f.title}</h2><p>${f.excerpt}</p><strong>Leer artículo →</strong></div></a>`:'';
  $('#arts').innerHTML=rest.map(artCard).join('')||(f?'':'<p class="empty">Aún no hay artículos en esta categoría.</p>');
 },
 articulo(){
  const a=ARTICLES.find(x=>x.slug==params.get('slug'));
  if(!a){$('#art').innerHTML='<h1>Artículo no encontrado</h1><p><a href="consejos.html"><strong>Volver a consejos</strong></a></p>';return}
  document.title=a.title+' | PetCare';
  $('#art').innerHTML=`<small>${a.category} · ${a.date}</small><h1>${a.title}</h1><img src="${a.image}" alt="">${a.body.map(p=>`<p>${p}</p>`).join('')}<h2>Sigue leyendo</h2><div class="grid">${ARTICLES.filter(x=>x!=a).slice(0,2).map(x=>`<a class="card" href="articulo.html?slug=${x.slug}" style="text-decoration:none"><div><h3>${x.title}</h3><p>${x.excerpt}</p></div></a>`).join('')}</div>`;
 },
 contacto(){const s=params.get('asunto');if(s)$('#fContact').subject.value=s},
 login(){},registro(){},
 cuenta(){
  const u=me(),now=new Date(),ap=[...u.appts].sort((a,b)=>new Date(a.date)-new Date(b.date)),up=ap.filter(a=>new Date(a.date)>now);
  $('#banner').style.backgroundImage=u.banner?`url('${u.banner}')`:'';
  $('#av').src=u.avatar||AV(u.name);$('#av').alt='Foto de perfil de '+u.name;
  $('#uName').textContent=u.name;
  $('#uMeta').textContent=[u.email,u.city,u.phone].filter(Boolean).join(' · ');$('#uBio').textContent=u.bio||'';
  $('#stats').innerHTML=`<div><b>${u.pets.length}</b><span>Mascotas</span></div><div><b>${up.length}</b><span>Citas próximas</span></div><div><b>${up[0]?new Date(up[0].date).toLocaleString('es-PE',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).replace(',',''):'—'}</b><span>Próxima cita</span></div>`;
  $('#pets').innerHTML=u.pets.length?u.pets.map(p=>`<article class="pet"><img src="${p.photo||DEF}" alt="${esc(p.name)}"><div><h3>${esc(p.name)}</h3><p>${esc(p.species)}${p.breed?' · '+esc(p.breed):''}${p.age!==''&&p.age!=null?' · '+esc(p.age)+' años':''}</p><button class="btn sm del" data-act="delPet" data-id="${p.id}">Eliminar</button></div></article>`).join(''):'<p class="empty">Aún no tienes mascotas. Agrega la primera arriba.</p>';
  $('#apptBox').innerHTML=u.pets.length?`<form id="fAppt"><p class="err" role="alert"></p><div class="row2"><label>Mascota<select name="pet_id">${u.pets.map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join('')}</select></label><label>Servicio<select name="service"><option>Veterinaria</option><option>Baño y peluquería</option><option>Paseo</option><option>Guardería</option></select></label></div><label>Fecha y hora<input name="date" type="datetime-local" required></label><label>Notas<textarea name="notes" rows="2" maxlength="255"></textarea></label><button class="btn">Agendar cita</button></form>`:'<p class="empty">Agrega una mascota para poder agendar citas.</p>';
  $('#appts').innerHTML=ap.length?ap.map(a=>{const p=u.pets.find(x=>x.id==a.petId);return `<div class="appt"><div><strong>${esc(a.service)}</strong> para ${esc(p?p.name:'—')}<br><small>${new Date(a.date).toLocaleString('es-PE',{weekday:'long',day:'numeric',month:'long',hour:'2-digit',minute:'2-digit'})}${a.notes?' — '+esc(a.notes):''}</small></div><button class="btn sm del" data-act="delAppt" data-id="${a.id}">Cancelar</button></div>`}).join(''):'<p class="empty">No tienes citas agendadas.</p>';
 },
 perfil(){
  const u=me(),f=$('#fProf');
  ['name','email','phone','city','bio'].forEach(k=>f[k].value=u[k]||'');
  $('#avPrev').src=u.avatar||AV(u.name);$('#banPrev').style.backgroundImage=u.banner?`url('${u.banner}')`:'';
  $('[data-act=rmAv]').hidden=!u.avatar;$('[data-act=rmBan]').hidden=!u.banner;
 }
};
const refresh=()=>{layout();if(PAGE=='cuenta'||PAGE=='perfil')pages[PAGE]()};

/* ---------- Formularios ---------- */
const H={
 fLogin(f,d){const u=users().find(x=>x.email==d.email.trim().toLowerCase()&&x.password==d.password);
  if(!u)return 'Correo o contraseña incorrectos';LS.set('pc_session',u.id);flash('¡Bienvenido de nuevo!');location='mi-cuenta.html'},
 fReg(f,d){const email=d.email.trim().toLowerCase();
  if(!d.name.trim())return 'El nombre es obligatorio';
  if(users().some(x=>x.email==email))return 'Ese correo ya está registrado';
  if(d.password.length<6)return 'La contraseña debe tener al menos 6 caracteres';
  if(d.password!=d.password_confirmation)return 'Las contraseñas no coinciden';
  const u={id:'u'+Date.now(),name:d.name.trim(),email,password:d.password,avatar:null,banner:null,phone:'',city:'',bio:'',pets:[],appts:[]};
  if(LS.set('pc_users',[...users(),u])){LS.set('pc_session',u.id);flash('¡Bienvenido a PetCare!');location='mi-cuenta.html'}},
 async fPet(f,d){const u=me(),x=f.photo.files[0];let photo=null;
  if(!d.name.trim())return 'El nombre es obligatorio';
  if(x){if(x.size>3*1024*1024)return 'La foto no debe superar 3 MB';try{photo=await loadImg(x,600)}catch(e){return e}}
  u.pets.unshift({id:'p'+Date.now(),name:d.name.trim(),species:d.species,breed:d.breed.trim(),age:d.age,photo});
  if(saveMe(u)){f.reset();pages.cuenta();toast('Mascota agregada')}},
 fAppt(f,d){const u=me();if(!(new Date(d.date)>new Date()))return 'La fecha debe ser futura';
  u.appts.push({id:'a'+Date.now(),petId:d.pet_id,service:d.service,date:d.date,notes:d.notes.trim()});
  if(saveMe(u)){pages.cuenta();toast('Cita agendada')}},
 fContact(f,d){LS.set('pc_messages',[...LS.get('pc_messages',[]),{...d,at:new Date().toISOString()}]);f.reset();toast('¡Gracias! Te responderemos en menos de 24 horas.')},
 fProf(f,d){const u=me(),email=d.email.trim().toLowerCase();
  if(!d.name.trim())return 'El nombre es obligatorio';
  if(users().some(x=>x.email==email&&x.id!=u.id))return 'Ese correo ya está en uso';
  Object.assign(u,{name:d.name.trim(),email,phone:d.phone.trim(),city:d.city.trim(),bio:d.bio.trim().slice(0,200)});
  if(saveMe(u)){refresh();toast('Perfil actualizado')}},
 fPass(f,d){const u=me();if(d.current_password!=u.password)return 'La contraseña actual no es correcta';
  if(d.password.length<6)return 'La nueva contraseña debe tener al menos 6 caracteres';
  if(d.password!=d.password_confirmation)return 'Las contraseñas no coinciden';
  u.password=d.password;if(saveMe(u)){f.reset();toast('Contraseña actualizada')}},
 async fAv(f){return upload(f,'avatar',400,3,'Foto de perfil actualizada')},
 async fBan(f){return upload(f,'banner',1500,4,'Banner actualizado')}
};
async function upload(f,k,max,mb,msg){const x=f[k].files[0];if(!x)return 'Selecciona una imagen';
 if(x.size>mb*1024*1024)return `La imagen no debe superar ${mb} MB`;
 try{const u=me();u[k]=await loadImg(x,max);if(saveMe(u)){f.reset();refresh();toast(msg)}}catch(e){return e}}
document.addEventListener('submit',async e=>{const f=e.target,h=H[f.id];if(!h)return;e.preventDefault();
 const m=await h(f,Object.fromEntries(new FormData(f)));const p=f.querySelector('.err');if(p)p.textContent=m||''});

/* ---------- Clics ---------- */
document.addEventListener('click',e=>{
 if(e.target.id=='burger')$('#links').classList.toggle('open');
 const d=$('details.user');if(d&&!d.contains(e.target))d.open=false;
 const b=e.target.closest('[data-act]');if(!b)return;
 const a=b.dataset.act,id=b.dataset.id,u=me();
 if(a=='logout'){localStorage.removeItem('pc_session');flash('Sesión cerrada');location='index.html'}
 if(a=='delPet'&&confirm('¿Eliminar esta mascota y sus citas?')){u.pets=u.pets.filter(p=>p.id!=id);u.appts=u.appts.filter(x=>x.petId!=id);saveMe(u);pages.cuenta();toast('Mascota eliminada')}
 if(a=='delAppt'){u.appts=u.appts.filter(x=>x.id!=id);saveMe(u);pages.cuenta();toast('Cita cancelada')}
 if(a=='rmAv'){u.avatar=null;saveMe(u);refresh();toast('Foto eliminada')}
 if(a=='rmBan'){u.banner=null;saveMe(u);refresh();toast('Banner eliminado')}
});

/* ---------- Inicio ---------- */
layout();
const need=PAGE=='cuenta'||PAGE=='perfil';
if(need&&!me())location='login.html';
else if((PAGE=='login'||PAGE=='registro')&&me())location='mi-cuenta.html';
else{pages[PAGE]&&pages[PAGE]();const m=sessionStorage.getItem('flash');if(m){toast(m);sessionStorage.removeItem('flash')}}
