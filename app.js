/* ObraGest — app vanilla JS con persistencia localStorage. Sin dependencias. Lista para GitHub Pages. */
const KEY = "obragest_v1";
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const uid = (p="id") => p + "_" + Math.random().toString(36).slice(2,9);
const todayISO = () => new Date().toISOString().slice(0,10);
const fmtDate = (d) => d ? new Date(d+"T00:00:00").toLocaleDateString("es") : "—";
const daysLeft = (d) => { if(!d) return null; return Math.ceil((new Date(d+"T00:00:00") - new Date(todayISO()+"T00:00:00"))/86400000); };
const esc = (s="") => String(s??"").replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

const ESTADOS = { pendiente:"Pendiente", en_curso:"En curso", en_revision:"En revisión", completada:"Completada" };
const PRIORIDADES = ["baja","media","alta"];
const ROLES = ["Jefe/a de obra","Arquitecto/a","Ingeniero/a","Topógrafo/a","Encargado/a","Administrativo/a","Seguridad y salud","Subcontrata"];

function seed(){
  const m1=uid("m"),m2=uid("m"),m3=uid("m"),m4=uid("m"),m5=uid("m");
  const p1=uid("p"),p2=uid("p"),p3=uid("p");
  const s1=uid("s"),s2=uid("s"),s3=uid("s"),s4=uid("s");
  const t=(id,sub,titulo,resp,est,av,prio,ini,fin,hest,hreal)=>({id:id||uid("t"),subproyectoId:sub,titulo,responsableId:resp,estado:est,avance:av,prioridad:prio,inicio:ini,fin:fin,hEstimadas:hest,hReales:hreal,descripcion:""});
  return {
    miembros:[
      {id:m1,nombre:"Lucía Ferrer",rol:"Jefa de obra",especialidad:"Vialidad",email:"lucia@example.com",telefono:"600111222"},
      {id:m2,nombre:"Marco Vidal",rol:"Arquitecto",especialidad:"Edificación",email:"marco@example.com",telefono:"600333444"},
      {id:m3,nombre:"Sara Cano",rol:"Ingeniera",especialidad:"Hidráulica",email:"sara@example.com",telefono:"600555666"},
      {id:m4,nombre:"Diego Ruiz",rol:"Encargado",especialidad:"Movimiento de tierras",email:"diego@example.com",telefono:"600777888"},
      {id:m5,nombre:"Nora Gil",rol:"Seguridad y salud",especialidad:"PRL",email:"nora@example.com",telefono:"600999000"},
    ],
    proyectos:[
      {id:p1,nombre:"Rehabilitación Av. del Puerto",codigo:"EXP-2026-014",tipo:"Vialidad",ubicacion:"Tramo Km 2–5",presupuesto:850000,responsableId:m1,inicio:"2026-06-01",fin:"2026-12-15",estado:"en_curso",descripcion:"Fresado, aglomerado, aceras y alumbrado."},
      {id:p2,nombre:"Red de agua potable Barrio Norte",codigo:"EXP-2026-021",tipo:"Hidráulica",ubicacion:"Barrio Norte",presupuesto:420000,responsableId:m3,inicio:"2026-07-10",fin:"2026-11-30",estado:"en_curso",descripcion:"Sustitución de 3,2 km de tubería y válvulas."},
      {id:p3,nombre:"Parque Central y zona deportiva",codigo:"EXP-2026-030",tipo:"Espacio público",ubicacion:"Parcela P-7",presupuesto:610000,responsableId:m2,inicio:"2026-09-01",fin:"2027-03-20",estado:"planificado",descripcion:"Urbanización, riego, juegos y pista."},
    ],
    subproyectos:[
      {id:s1,proyectoId:p1,nombre:"Tramo A — Fresado y aglomerado",responsableId:m4,presupuesto:320000,inicio:"2026-06-01",fin:"2026-09-30",estado:"en_curso"},
      {id:s2,proyectoId:p1,nombre:"Tramo B — Aceras y alumbrado",responsableId:m1,presupuesto:210000,inicio:"2026-08-01",fin:"2026-12-15",estado:"planificado"},
      {id:s3,proyectoId:p2,nombre:"Sector 1 — Tubería principal",responsableId:m3,presupuesto:250000,inicio:"2026-07-10",fin:"2026-10-15",estado:"en_curso"},
      {id:s4,proyectoId:p3,nombre:"Fase 1 — Movimiento de tierras",responsableId:m4,presupuesto:150000,inicio:"2026-09-01",fin:"2026-10-30",estado:"planificado"},
    ],
    tareas:[
      t(uid("t"),s1,"Fresado calzada Km 2–3",m4,"completada",100,"alta","2026-06-01","2026-06-20",120,118),
      t(uid("t"),s1,"Extendido aglomerado",m4,"en_curso",60,"alta","2026-06-21","2026-09-10",200,110),
      t(uid("t"),s2,"Demolición aceras",m1,"pendiente",0,"media","2026-08-05","2026-09-05",90,0),
      t(uid("t"),s3,"Zanja y colocación DN300",m3,"en_revision",85,"alta","2026-07-10","2026-09-20",160,140),
      t(uid("t"),s3,"Pruebas de presión",m3,"pendiente",0,"media","2026-09-21","2026-10-10",40,0),
      t(uid("t"),s4,"Desbroce y nivelación",m4,"pendiente",10,"media","2026-09-01","2026-09-25",80,8),
    ],
    registros:[
      {id:uid("r"),tareaId:null,miembroId:m4,fecha:todayISO(),horas:8,nota:"Avance extendido aglomerado"},
      {id:uid("r"),tareaId:null,miembroId:m3,fecha:todayISO(),horas:6,nota:"Inspección zanja sector 1"},
    ],
    bitacora:[
      {id:uid("b"),fecha:todayISO(),proyectoId:p1,autor:"Lucía Ferrer",texto:"Se completa fresado Km 2–3 sin incidencias. Control topográfico OK."},
      {id:uid("b"),fecha:todayISO(),proyectoId:p2,autor:"Sara Cano",texto:"Prueba parcial de estanqueidad superada en 400 m."},
    ]
  };
}

let db;
try { db = JSON.parse(localStorage.getItem(KEY)) || seed(); } catch { db = seed(); }
if(!db.proyectos) db = seed();
const save = () => localStorage.setItem(KEY, JSON.stringify(db));

const miembro = (id) => db.miembros.find(m=>m.id===id);
const proyecto = (id) => db.proyectos.find(p=>p.id===id);
const sub = (id) => db.subproyectos.find(s=>s.id===id);
const tareasDe = (f) => db.tareas.filter(f);
const avanceTareas = (ts) => ts.length ? Math.round(ts.reduce((a,t)=>a+(+t.avance||0),0)/ts.length) : 0;
const subsDeProyecto = (pid) => db.subproyectos.filter(s=>s.proyectoId===pid);
const tareasDeProyecto = (pid) => db.tareas.filter(t=>subsDeProyecto(pid).some(s=>s.id===t.subproyectoId));

function toast(msg){ const d=document.createElement("div"); d.className="toast"; d.textContent=msg; $("#toasts").appendChild(d); setTimeout(()=>d.remove(),2600); }

/* ---------- Navegación ---------- */
$("#mainNav").addEventListener("click",e=>{
  const b=e.target.closest("button[data-view]"); if(!b) return;
  $$("#mainNav button").forEach(x=>x.classList.remove("active")); b.classList.add("active");
  $$(".view").forEach(v=>v.classList.remove("active")); $("#view-"+b.dataset.view).classList.add("active");
  $("#sidebar").classList.remove("open"); render();
});
$("#menuBtn").onclick=()=>$("#sidebar").classList.toggle("open");
document.addEventListener("keydown",e=>{ if(e.key==="/"&&document.activeElement.tagName!=="INPUT"){e.preventDefault();$("#globalSearch").focus();} });

/* ---------- Filtros globales ---------- */
function refreshSelects(){
  const fp=$("#filterProyectoGlobal"); const cur=fp.value;
  fp.innerHTML=`<option value="">Todos los proyectos</option>`+db.proyectos.map(p=>`<option value="${p.id}">${esc(p.nombre)}</option>`).join("");
  fp.value=cur||"";
  const fm=$("#filterMiembro"); const c2=fm.value;
  fm.innerHTML=`<option value="">Todos los miembros</option>`+db.miembros.map(m=>`<option value="${m.id}">${esc(m.nombre)}</option>`).join("");
  fm.value=c2||"";
  const q=($("#globalSearch").value||"").toLowerCase();
  $("#badgeTareas").textContent = db.tareas.filter(t=>t.estado!=="completada").length || "";
  return {fp:fp.value, q};
}

/* ---------- Renders ---------- */
function render(){
  const {fp,q}=refreshSelects();
  renderDashboard(fp); renderProyectos(q,fp); renderSubproyectos(q,fp);
  renderKanban(q,fp); renderEquipo(q); renderTiempos(fp); renderAvances(fp);
}

function kpi(label,val,sub2=""){return `<div class="kpi"><small>${label}</small><strong>${val}</strong><small>${sub2}</small></div>`;}

function renderDashboard(fp){
  const projs = db.proyectos.filter(p=>!fp||p.id===fp);
  const tids = new Set(); projs.forEach(p=>tareasDeProyecto(p.id).forEach(t=>tids.add(t.id)));
  const ts = db.tareas.filter(t=>tids.has(t.id));
  const comp = ts.filter(t=>t.estado==="completada").length;
  const hEst = ts.reduce((a,t)=>a+(+t.hEstimadas||0),0), hReal = ts.reduce((a,t)=>a+(+t.hReales||0),0);
  const pres = projs.reduce((a,p)=>a+(+p.presupuesto||0),0);
  const av = avanceTareas(ts);
  $("#kpis").innerHTML =
    kpi("Proyectos",projs.length, projs.filter(p=>p.estado==="en_curso").length+" en curso")+
    kpi("Tareas abiertas",ts.length-comp)+
    kpi("Avance medio",av+"%")+
    kpi("Presupuesto",pres.toLocaleString("es")+" €")+
    kpi("Horas est. / reales",`${hEst} / ${hReal}`);
  $("#avanceProyectos").innerHTML = projs.map(p=>{
    const a=avanceTareas(tareasDeProyecto(p.id));
    return `<div class="bar-row"><span>${esc(p.nombre)}</span><div class="progress"><i style="width:${a}%"></i></div><b>${a}%</b></div>`;
  }).join("") || "<p class='meta'>Sin proyectos.</p>";
  const prox = db.tareas.filter(t=>t.estado!=="completada"&&t.fin&&daysLeft(t.fin)!==null&&daysLeft(t.fin)<=14)
    .sort((a,b)=>a.fin.localeCompare(b.fin)).slice(0,8);
  $("#vencimientos").innerHTML = prox.map(t=>{
    const d=daysLeft(t.fin); const cls=d<0?"⛔ vencida":d<=3?"🔴":"🟡";
    return `<div class="bar-row"><span>${cls} ${esc(t.titulo)}</span><small>${fmtDate(t.fin)} · ${esc(miembro(t.responsableId)?.nombre||"—")}</small><b>${d<0?Math.abs(d)+"d tarde":d+"d"}</b></div>`;
  }).join("") || "<p class='meta'>Sin vencimientos próximos. 🎉</p>";
  const rec = [...db.bitacora].sort((a,b)=>b.fecha.localeCompare(a.fecha)).slice(0,5);
  $("#bitacoraReciente").innerHTML = rec.map(b=>`<div class="ev"><b>${fmtDate(b.fecha)}</b> · ${esc(proyecto(b.proyectoId)?.nombre||"")} — ${esc(b.texto)} <small>(${esc(b.autor)})</small></div>`).join("")||"<p class='meta'>Sin anotaciones.</p>";
  barChart($("#chartCarga"), db.miembros.map(m=>m.nombre.split(" ")[0]), db.miembros.map(m=>db.tareas.filter(t=>t.responsableId===m.id&&t.estado!=="completada").length));
  const est=["pendiente","en_curso","en_revision","completada"];
  donut($("#chartEstados"), est.map(e=>db.tareas.filter(t=>t.estado===e).length));
  $("#legendEstados").innerHTML = est.map(e=>`<span>● ${ESTADOS[e]}: <b>${db.tareas.filter(t=>t.estado===e).length}</b></span>`).join("");
}

function renderProyectos(q,fp){
  const list=db.proyectos.filter(p=>(!fp||p.id===fp)&&(!q||(p.nombre+p.codigo+p.ubicacion).toLowerCase().includes(q)));
  $("#listaProyectos").innerHTML=list.map(p=>{
    const ts=tareasDeProyecto(p.id); const a=avanceTareas(ts);
    return `<div class="proj-card">
      <h3>${esc(p.nombre)}</h3>
      <div class="meta"><span class="tag">${esc(p.codigo||"s/c")}</span><span class="tag">${esc(p.tipo||"—")}</span><span class="tag">${esc(p.estado||"")}</span></div>
      <div class="meta">📍 ${esc(p.ubicacion||"—")} · 👷 ${esc(miembro(p.responsableId)?.nombre||"—")}</div>
      <div class="meta">💰 ${( +p.presupuesto||0).toLocaleString("es")} € · 📅 ${fmtDate(p.inicio)} → ${fmtDate(p.fin)}</div>
      <div class="meta">${subsDeProyecto(p.id).length} subproyectos · ${ts.length} tareas</div>
      <div class="progress"><i style="width:${a}%"></i></div>
      <p class="meta">Avance ${a}%</p><p class="meta">${esc(p.descripcion||"")}</p>
      <div class="task-actions">
        <button class="btn small" onclick="editar('proyecto','${p.id}')">✏️ Editar</button>
        <button class="btn small danger" onclick="eliminar('proyecto','${p.id}')">🗑️</button>
      </div></div>`;
  }).join("")||"<p class='meta'>Sin proyectos. Crea el primero.</p>";
}

function renderSubproyectos(q,fp){
  const rows=db.subproyectos.filter(s=>(!fp||s.proyectoId===fp)&&(!q||(s.nombre).toLowerCase().includes(q)));
  $("#tablaSubproyectos").innerHTML=`<tr><th>Subproyecto</th><th>Proyecto</th><th>Adjudicado a</th><th>Plazo</th><th>Avance</th><th></th></tr>`+
    rows.map(s=>{
      const ts=db.tareas.filter(t=>t.subproyectoId===s.id); const a=avanceTareas(ts);
      return `<tr><td><b>${esc(s.nombre)}</b><br><small>${ts.length} tareas</small></td>
      <td>${esc(proyecto(s.proyectoId)?.nombre||"—")}</td>
      <td>👷 ${esc(miembro(s.responsableId)?.nombre||"Sin adjudicar")}</td>
      <td>${fmtDate(s.inicio)} → ${fmtDate(s.fin)}</td>
      <td style="min-width:140px"><div class="progress"><i style="width:${a}%"></i></div><small>${a}%</small></td>
      <td><button class="btn small" onclick="editar('subproyecto','${s.id}')">✏️</button>
      <button class="btn small danger" onclick="eliminar('subproyecto','${s.id}')">🗑️</button></td></tr>`;
    }).join("");
}

function renderKanban(q,fp){
  const fe=$("#filterEstado").value, fm=$("#filterMiembro").value;
  let ts=db.tareas.filter(t=>{
    const s=sub(t.subproyectoId); const okP=!fp||(s&&s.proyectoId===fp);
    const okQ=!q||(t.titulo+(miembro(t.responsableId)?.nombre||"")).toLowerCase().includes(q);
    return okP&&okQ&&(!fe||t.estado===fe)&&(!fm||t.responsableId===fm);
  });
  $("#kanban").innerHTML=Object.keys(ESTADOS).map(e=>{
    const col=ts.filter(t=>t.estado===e);
    return `<div class="col" data-est="${e}"><h4>${ESTADOS[e]} (${col.length})</h4>`+
    col.map(t=>`<div class="task prio-${t.prioridad}" draggable="true" data-id="${t.id}">
      <h5>${esc(t.titulo)}</h5>
      <small>${esc(sub(t.subproyectoId)?.nombre||"")} · 👷 ${esc(miembro(t.responsableId)?.nombre||"—")}</small><br>
      <small>📅 ${fmtDate(t.fin)} · ${t.avance}% · ${t.hReales||0}/${t.hEstimadas||0}h</small>
      <div class="progress"><i style="width:${t.avance}%"></i></div>
      <div class="task-actions">
        <button class="btn small" onclick="editar('tarea','${t.id}')">✏️</button>
        <button class="btn small" onclick="avanzarTarea('${t.id}')">⏩</button>
        <button class="btn small danger" onclick="eliminar('tarea','${t.id}')">🗑️</button>
      </div></div>`).join("")+`</div>`;
  }).join("");
  // drag & drop
  $$("#kanban .task").forEach(el=>{
    el.addEventListener("dragstart",ev=>ev.dataTransfer.setData("text/plain",el.dataset.id));
  });
  $$("#kanban .col").forEach(col=>{
    col.addEventListener("dragover",ev=>ev.preventDefault());
    col.addEventListener("drop",ev=>{
      const id=ev.dataTransfer.getData("text/plain");
      const t=db.tareas.find(x=>x.id===id); if(t){t.estado=col.dataset.est; if(t.estado==="completada")t.avance=100; save(); render(); toast("Tarea movida a "+ESTADOS[t.estado]);}
    });
  });
}

function renderEquipo(q){
  const list=db.miembros.filter(m=>!q||(m.nombre+m.rol+m.especialidad).toLowerCase().includes(q));
  $("#listaEquipo").innerHTML=list.map(m=>{
    const ts=db.tareas.filter(t=>t.responsableId===m.id);
    const ab=ts.filter(t=>t.estado!=="completada").length;
    return `<div class="member-card"><h3>👷 ${esc(m.nombre)}</h3>
    <div class="meta"><span class="tag">${esc(m.rol)}</span><span class="tag">${esc(m.especialidad||"—")}</span></div>
    <div class="meta">📧 ${esc(m.email||"—")} · 📞 ${esc(m.telefono||"—")}</div>
    <div class="meta">${ts.length} tareas totales · <b>${ab} abiertas</b></div>
    <div class="task-actions"><button class="btn small" onclick="editar('miembro','${m.id}')">✏️ Editar</button>
    <button class="btn small danger" onclick="eliminar('miembro','${m.id}')">🗑️</button></div></div>`;
  }).join("");
}

function renderTiempos(fp){
  const projs=db.proyectos.filter(p=>!fp||p.id===fp);
  const labels=projs.map(p=>p.nombre.slice(0,18)), est=[], real=[];
  projs.forEach(p=>{const ts=tareasDeProyecto(p.id); est.push(ts.reduce((a,t)=>a+(+t.hEstimadas||0),0)); real.push(ts.reduce((a,t)=>a+(+t.hReales||0),0));});
  groupedBars($("#chartHoras"),labels,est,real);
  // Gantt
  const all=[...db.tareas].filter(t=>{const s=sub(t.subproyectoId); return s&&(!fp||s.proyectoId===fp);}).sort((a,b)=>(a.inicio||"").localeCompare(b.inicio||"")).slice(0,12);
  const dates=all.flatMap(t=>[t.inicio,t.fin]).filter(Boolean).sort();
  const min=dates[0]||todayISO(), max=dates[dates.length-1]||todayISO();
  const span=Math.max(1,(new Date(max)-new Date(min))/86400000);
  $("#gantt").innerHTML=all.map(t=>{
    const off=Math.max(0,(new Date(t.inicio||min)-new Date(min))/86400000/span*100);
    const w=Math.max(4,((new Date(t.fin||t.inicio||min)-new Date(t.inicio||min))/86400000+1)/span*100);
    return `<div class="gantt-row"><span>${esc(t.titulo.slice(0,24))}</span>
    <div class="gantt-bar"><div class="gantt-fill" style="left:${off}%;width:${Math.min(100-off,w)}%"></div></div></div>`;
  }).join("")||"<p class='meta'>Sin tareas con fechas.</p>";
  $("#tablaRegistros").innerHTML=`<tr><th>Fecha</th><th>Miembro</th><th>Horas</th><th>Nota</th><th></th></tr>`+
    [...db.registros].sort((a,b)=>b.fecha.localeCompare(a.fecha)).map(r=>
    `<tr><td>${fmtDate(r.fecha)}</td><td>${esc(miembro(r.miembroId)?.nombre||"—")}</td><td>${r.horas} h</td><td>${esc(r.nota||"")}</td>
    <td><button class="btn small danger" onclick="eliminar('registro','${r.id}')">🗑️</button></td></tr>`).join("");
}

function renderAvances(fp){
  const projs=db.proyectos.filter(p=>!fp||p.id===fp);
  $("#avanceDetallado").innerHTML=projs.map(p=>{
    const subs=subsDeProyecto(p.id);
    return `<h4>${esc(p.nombre)} — ${avanceTareas(tareasDeProyecto(p.id))}%</h4>`+
    (subs.map(s=>{const ts=db.tareas.filter(t=>t.subproyectoId===s.id);
      return `<div class="bar-row"><span>🧩 ${esc(s.nombre)} (${esc(miembro(s.responsableId)?.nombre||"—")})</span><div class="progress"><i style="width:${avanceTareas(ts)}%"></i></div><b>${avanceTareas(ts)}%</b></div>`+
      ts.map(t=>`<div class="bar-row"><span style="padding-left:18px">↳ ${esc(t.titulo)}</span><div class="progress"><i style="width:${t.avance}%"></i></div><b>${t.avance}%</b></div>`).join("");
    }).join("")||"<p class='meta'>Sin subproyectos.</p>");
  }).join("");
  $("#bitacoraFull").innerHTML=[...db.bitacora].sort((a,b)=>b.fecha.localeCompare(a.fecha)).map(b=>
    `<div class="ev"><b>${fmtDate(b.fecha)}</b> · <b>${esc(proyecto(b.proyectoId)?.nombre||"")}</b> — ${esc(b.texto)} <small>(${esc(b.autor)})</small>
    <div class="task-actions"><button class="btn small danger" onclick="eliminar('bitacora','${b.id}')">🗑️ Eliminar</button></div></div>`).join("")||"<p class='meta'>Sin anotaciones.</p>";
}

/* ---------- Charts vanilla ---------- */
function setupCanvas(c){const dpr=window.devicePixelRatio||1;const w=c.clientWidth||600,h=+c.getAttribute("height")||220;c.width=w*dpr;c.height=h*dpr;const x=c.getContext("2d");x.scale(dpr,dpr);x.clearRect(0,0,w,h);return[x,w,h];}
function barChart(c,labels,vals){if(!c)return;const[x,W,H]=setupCanvas(c);const max=Math.max(1,...vals);const bw=W/labels.length;
  labels.forEach((l,i)=>{const h=(H-40)*vals[i]/max; x.fillStyle="#f59e0b";x.fillRect(i*bw+12,H-24-h,bw-24,h);x.fillStyle="#9fb0d0";x.font="11px sans-serif";x.fillText(String(l).slice(0,10),i*bw+12,H-8);x.fillStyle="#fff";x.fillText(vals[i],i*bw+14,H-28-h);});}
function donut(c,vals){if(!c)return;const[x,W,H]=setupCanvas(c);const tot=vals.reduce((a,b)=>a+b,0)||1;const cols=["#64748b","#38bdf8","#f59e0b","#22c55e"];let a=-Math.PI/2;const cx=W/2,cy=H/2,r=Math.min(W,H)/2-14;
  vals.forEach((v,i)=>{const a2=a+v/tot*Math.PI*2;x.beginPath();x.moveTo(cx,cy);x.arc(cx,cy,r,a,a2);x.closePath();x.fillStyle=cols[i%4];x.fill();a=a2;});
  x.fillStyle="#0e1830";x.beginPath();x.arc(cx,cy,r*0.55,0,7);x.fill();x.fillStyle="#fff";x.font="bold 15px sans-serif";x.textAlign="center";x.fillText(tot+" tareas",cx,cy+5);}
function groupedBars(c,labels,a,b){if(!c)return;const[x,W,H]=setupCanvas(c);const max=Math.max(1,...a,...b);const n=Math.max(1,labels.length);const gw=W/n;
  labels.forEach((l,i)=>{const h1=(H-40)*a[i]/max,h2=(H-40)*b[i]/max;
    x.fillStyle="#38bdf8";x.fillRect(i*gw+10,H-24-h1,gw/2-14,h1);
    x.fillStyle="#22c55e";x.fillRect(i*gw+gw/2,H-24-h2,gw/2-14,h2);
    x.fillStyle="#9fb0d0";x.font="11px sans-serif";x.fillText(l.slice(0,12),i*gw+10,H-8);});
  x.fillStyle="#9fb0d0";x.fillText("■ Estimadas  ■ Reales",10,14);}

/* ---------- CRUD + modal ---------- */
let editing=null; // {kind,id}
const SCHEMAS={
  proyecto:[["nombre","Nombre","text",1],["codigo","Código expediente","text",0],["tipo","Tipo de obra","text",0],["ubicacion","Ubicación","text",0],["presupuesto","Presupuesto €","number",0],["responsableId","Responsable","miembro",0],["inicio","Inicio","date",0],["fin","Fin","date",0],["estado","Estado","estadoProyecto",0],["descripcion","Descripción","textarea",1]],
  subproyecto:[["nombre","Nombre","text",1],["proyectoId","Proyecto","proyecto",0],["responsableId","Adjudicar a","miembro",0],["presupuesto","Presupuesto €","number",0],["inicio","Inicio","date",0],["fin","Fin","date",0],["estado","Estado","estadoProyecto",0]],
  tarea:[["titulo","Título","text",1],["subproyectoId","Subproyecto","sub",0],["responsableId","Responsable","miembro",0],["estado","Estado","estadoTarea",0],["avance","Avance %","number",0],["prioridad","Prioridad","prioridad",0],["inicio","Inicio","date",0],["fin","Fin previsto","date",0],["hEstimadas","Horas estimadas","number",0],["hReales","Horas reales","number",0],["descripcion","Descripción","textarea",1]],
  miembro:[["nombre","Nombre","text",1],["rol","Rol","text",0],["especialidad","Especialidad","text",0],["email","Email","text",0],["telefono","Teléfono","text",0]],
  registro:[["miembroId","Miembro","miembro",0],["fecha","Fecha","date",0],["horas","Horas","number",0],["nota","Nota","text",1]],
  bitacora:[["proyectoId","Proyecto","proyecto",0],["fecha","Fecha","date",0],["autor","Autor","text",0],["texto","Anotación","textarea",1]],
};
function fieldHTML(kind,f,v){
  const [k,label,type,full]=f; const cls=full?"full":"";
  const val=v??"";
  let input="";
  if(type==="textarea") input=`<textarea name="${k}" rows="2">${esc(val)}</textarea>`;
  else if(type==="miembro") input=`<select name="${k}"><option value="">—</option>${db.miembros.map(m=>`<option value="${m.id}" ${m.id===val?"selected":""}>${esc(m.nombre)}</option>`).join("")}</select>`;
  else if(type==="proyecto") input=`<select name="${k}">${db.proyectos.map(p=>`<option value="${p.id}" ${p.id===val?"selected":""}>${esc(p.nombre)}</option>`).join("")}</select>`;
  else if(type==="sub") input=`<select name="${k}">${db.subproyectos.map(s=>`<option value="${s.id}" ${s.id===val?"selected":""}>${esc(s.nombre)}</option>`).join("")}</select>`;
  else if(type==="estadoTarea") input=`<select name="${k}">${Object.entries(ESTADOS).map(([a,b])=>`<option value="${a}" ${a===val?"selected":""}>${b}</option>`).join("")}</select>`;
  else if(type==="estadoProyecto") input=`<select name="${k}">${["planificado","en_curso","pausado","finalizado"].map(a=>`<option ${a===val?"selected":""}>${a}</option>`).join("")}</select>`;
  else if(type==="prioridad") input=`<select name="${k}">${PRIORIDADES.map(a=>`<option ${a===val?"selected":""}>${a}</option>`).join("")}</select>`;
  else input=`<input name="${k}" type="${type}" value="${esc(val)}">`;
  return `<label class="${cls}">${label}${input}</label>`;
}
function openModal(kind,id=null){
  editing={kind,id};
  const titles={proyecto:"Proyecto de obra",subproyecto:"Subproyecto",tarea:"Tarea",miembro:"Miembro del equipo",registro:"Registro de horas",bitacora:"Anotación de bitácora"};
  $("#modalTitle").textContent=(id?"Editar ":"Nuevo ")+titles[kind];
  const obj=id?findObj(kind,id):{};
  $("#modalForm").innerHTML=SCHEMAS[kind].map(f=>fieldHTML(kind,f,obj[f[0]])).join("");
  $("#modalBackdrop").hidden=false;
}
function findObj(kind,id){
  return {proyecto:db.proyectos,subproyecto:db.subproyectos,tarea:db.tareas,miembro:db.miembros,registro:db.registros,bitacora:db.bitacora}[kind].find(o=>o.id===id)||{};
}
window.editar=(kind,id)=>openModal(kind,id);
window.eliminar=(kind,id)=>{
  if(!confirm("¿Eliminar este registro?"))return;
  const map={proyecto:"proyectos",subproyecto:"subproyectos",tarea:"tareas",miembro:"miembros",registro:"registros",bitacora:"bitacora"};
  if(kind==="proyecto"){const subs=subsDeProyecto(id).map(s=>s.id); db.subproyectos=db.subproyectos.filter(s=>s.proyectoId!==id); db.tareas=db.tareas.filter(t=>!subs.includes(t.subproyectoId));}
  if(kind==="subproyecto"){db.subproyectos=db.subproyectos.filter(s=>s.id!==id); db.tareas=db.tareas.filter(t=>t.subproyectoId!==id);}
  db[map[kind]]=db[map[kind]].filter(o=>o.id!==id);
  save();render();toast("Eliminado");
};
window.avanzarTarea=(id)=>{
  const t=db.tareas.find(x=>x.id===id); const order=["pendiente","en_curso","en_revision","completada"];
  t.estado=order[Math.min(3,order.indexOf(t.estado)+1)];
  if(t.estado==="completada")t.avance=100; else if(t.avance===100)t.avance=80;
  save();render();
};
$("#modalCancel").onclick=()=>$("#modalBackdrop").hidden=true;
$("#modalBackdrop").addEventListener("click",e=>{if(e.target.id==="modalBackdrop")$("#modalBackdrop").hidden=true;});
$("#modalSave").onclick=()=>{
  const fd=new FormData($("#modalForm")); const data={}; fd.forEach((v,k)=>data[k]=v);
  ["presupuesto","avance","hEstimadas","hReales","horas"].forEach(k=>{if(data[k]!=null&&data[k]!=="")data[k]=+data[k];});
  if(data.avance!=null)data.avance=Math.max(0,Math.min(100,+data.avance||0));
  const {kind,id}=editing;
  const map={proyecto:"proyectos",subproyecto:"subproyectos",tarea:"tareas",miembro:"miembros",registro:"registros",bitacora:"bitacora"};
  if(id){Object.assign(findObj(kind,id),data); if(kind==="tarea"&&data.estado==="completada")findObj(kind,id).avance=100;}
  else{
    const nid=uid(kind[0]);
    const defaults={proyecto:{estado:"planificado"},subproyecto:{estado:"planificado"},tarea:{estado:"pendiente",avance:0,prioridad:"media"},registro:{fecha:todayISO(),horas:8},bitacora:{fecha:todayISO()}};
    db[map[kind]].push({id:nid,...defaults[kind],...data});
  }
  save();$("#modalBackdrop").hidden=true;render();toast("Guardado ✓");
};
document.addEventListener("click",e=>{const b=e.target.closest("[data-add]"); if(b)openModal(b.dataset.add);});
$("#btnQuickTask").onclick=()=>openModal("tarea");
["globalSearch","filterProyectoGlobal","filterEstado","filterMiembro"].forEach(id=>$("#"+id).addEventListener("input",render));

/* ---------- Export / import / CSV ---------- */
$("#btnExport").onclick=()=>{
  const blob=new Blob([JSON.stringify(db,null,2)],{type:"application/json"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="obragest-datos.json";a.click();
};
$("#btnImport").onclick=()=>$("#fileImport").click();
$("#fileImport").addEventListener("change",e=>{
  const f=e.target.files[0]; if(!f)return;
  const r=new FileReader(); r.onload=()=>{try{db=JSON.parse(r.result);save();render();toast("Datos importados ✓");}catch{toast("Archivo no válido");}}; r.readAsText(f);
});
$("#btnReset").onclick=()=>{if(confirm("¿Restaurar datos de ejemplo?")){db=seed();save();render();}};
$("#btnCSV").onclick=()=>{
  const rows=[["Proyecto","Subproyecto","Tarea","Responsable","Estado","Avance%","Fin","H.Est","H.Real"]];
  db.tareas.forEach(t=>rows.push([proyecto(sub(t.subproyectoId)?.proyectoId)?.nombre||"",sub(t.subproyectoId)?.nombre||"",t.titulo,miembro(t.responsableId)?.nombre||"",ESTADOS[t.estado],t.avance,t.fin,t.hEstimadas,t.hReales]));
  const csv=rows.map(r=>r.map(x=>`"${String(x??"").replace(/"/g,'""')}"`).join(";")).join("\n");
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob(["\ufeff"+csv],{type:"text/csv"}));a.download="informe-avances.csv";a.click();
};

render();
