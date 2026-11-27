/* L'agenda politique de la semaine : 7 jours glissants à partir d'aujourd'hui (heure de Paris).
   Les rendez-vous sont lus dans agenda.json. 1 à 4 rendez-vous français par jour, et au plus 1 information internationale.
   Chaque journée met en tête son actualité principale (badge « À la une »), reprise dans la carte « L'actu du jour »
   à droite de la grande question. Pour imposer le choix, ajouter "p":1 au rendez-vous voulu dans agenda.json ;
   sinon : première séance du Parlement, sinon première information internationale, sinon premier candidat
   (les mentions « éventuelle » ou « si nécessaire » passent en dernier). */
(function(){
  var track=document.getElementById("ag-track");
  if(!track) return;
  var TAGS={candidat:"Candidat",parlement:"Parlement",international:"International"};
  var data=null, offset=0, ORDER=["candidat","parlement","international"], UNE_ORDER=["parlement","international","candidat"];
  var WEAK=/éventuelle|si nécessaire/i;
  var prev=document.getElementById("ag-prev"), next=document.getElementById("ag-next"), now=document.getElementById("ag-now"), note=document.getElementById("ag-note");

  function parisToday(){
    return new Intl.DateTimeFormat("en-CA",{timeZone:"Europe/Paris",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
  }
  function toUTC(s){var p=s.split("-");return new Date(Date.UTC(+p[0],+p[1]-1,+p[2]));}
  function iso(d){return d.toISOString().slice(0,10);}
  function addDays(s,n){var d=toUTC(s);d.setUTCDate(d.getUTCDate()+n);return iso(d);}
  var fmtDow=new Intl.DateTimeFormat("fr-FR",{weekday:"short",timeZone:"UTC"});
  var fmtMon=new Intl.DateTimeFormat("fr-FR",{month:"short",timeZone:"UTC"});
  var fmtLong=new Intl.DateTimeFormat("fr-FR",{weekday:"long",day:"numeric",month:"long",timeZone:"UTC"});
  function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e;}

  function eventsRaw(day){ return (data&&data.jours&&data.jours[day])||[]; }

  /* L'actualité principale d'une journée */
  function une(day){
    var list=eventsRaw(day), i, k;
    for(i=0;i<list.length;i++) if(list[i].p) return list[i];
    for(k=0;k<UNE_ORDER.length;k++){
      for(i=0;i<list.length;i++){
        if(list[i].c===UNE_ORDER[k] && !WEAK.test(list[i].t+" "+(list[i].q||""))) return list[i];
      }
    }
    return list[0]||null;
  }

  /* Rendez-vous du jour : l'actualité principale d'abord, puis les autres */
  function eventsFor(day){
    var u=une(day);
    var list=eventsRaw(day).slice().sort(function(a,b){return ORDER.indexOf(a.c)-ORDER.indexOf(b.c);});
    if(u){ var at=list.indexOf(u); if(at>0){ list.splice(at,1); list.unshift(u); } }
    return list;
  }

  function tagNodes(e,isUne){
    var f=document.createDocumentFragment();
    if(isUne) f.appendChild(el("span","ag-une-b","À la une"));
    f.appendChild(el("span","ag-tag",TAGS[e.c]||"Repère"));
    return f;
  }

  function card(e,id,isUne){
    var li=el("li","ag-li c-"+e.c+(isUne?" ag-une":""));
    var hasMore=!!(e.x||e.l);
    if(!hasMore){
      var st=el("div","ag-static");
      st.appendChild(tagNodes(e,isUne));
      st.appendChild(el("span","ag-t",e.t));
      if(e.q) st.appendChild(el("span","ag-q",e.q));
      li.appendChild(st); return li;
    }
    var b=el("button","ag-card"); b.type="button"; b.setAttribute("aria-expanded","false"); b.setAttribute("aria-controls",id);
    b.appendChild(tagNodes(e,isUne));
    b.appendChild(el("span","ag-t",e.t));
    if(e.q) b.appendChild(el("span","ag-q",e.q));
    b.appendChild(el("span","ag-more"));
    var d=el("div","ag-detail"); d.id=id; d.hidden=true;
    if(e.x) d.appendChild(el("p",null,e.x));
    if(e.l){var a=el("a",null,"Source : "+(e.s||"lien")+" ↗");a.href=e.l;a.target="_blank";a.rel="noopener";d.appendChild(a);}
    b.addEventListener("click",function(){
      var open=b.getAttribute("aria-expanded")==="true";
      b.setAttribute("aria-expanded",open?"false":"true"); d.hidden=open; li.classList.toggle("ag-li-open",!open);
    });
    li.appendChild(b); li.appendChild(d); return li;
  }

  function render(){
    var today=parisToday(), start=addDays(today,offset*7);
    track.textContent="";
    var days=Object.keys(data.jours||{}).sort(), last=days.length?days[days.length-1]:today, missing=0;
    for(var i=0;i<7;i++){
      var day=addDays(start,i), d=toUTC(day), dow=d.getUTCDay();
      var col=el("article","ag-day"+(day===today?" is-today":"")+((dow===0||dow===6)?" is-weekend":""));
      col.setAttribute("aria-label",fmtLong.format(d));
      var h=el("header","ag-head");
      if(day===today) h.appendChild(el("span","ag-badge","Aujourd’hui"));
      var dt=el("div","ag-date");
      dt.appendChild(el("span","ag-dow",fmtDow.format(d).replace(".","")));
      dt.appendChild(el("span","ag-num",String(d.getUTCDate())));
      dt.appendChild(el("span","ag-mon",fmtMon.format(d)));
      h.appendChild(dt);
      col.appendChild(h);
      var ul=el("ul","ag-list"), ev=eventsFor(day), u=une(day);
      if(!ev.length){ missing++; ev=[{c:"repere",t:"Rien d’annoncé pour l’instant",q:"L’agenda est actualisé chaque matin."}]; u=null; }
      ev.forEach(function(e,k){ ul.appendChild(card(e,"ag-"+day+"-"+k,e===u)); });
      col.appendChild(ul); track.appendChild(col);
    }
    prev.disabled=offset<=0;
    next.disabled=addDays(today,(offset+1)*7)>last;
    var txt=data.note||"";
    if(data.maj){ try{ txt+=" Agenda actualisé le "+new Intl.DateTimeFormat("fr-FR",{day:"numeric",month:"long",hour:"2-digit",minute:"2-digit",timeZone:"Europe/Paris"}).format(new Date(data.maj))+"."; }catch(e){} }
    if(missing) txt+=" Pour les jours sans rendez-vous, l’agenda n’a pas encore été complété.";
    note.textContent=txt;
  }

  /* Carte à retourner « L'actu du jour », à droite de la grande question */
  function daily(){
    var host=document.querySelector(".hero-top");
    if(!host||!data) return;
    var old=host.querySelector(".daily"); if(old) old.parentNode.removeChild(old);
    var day=parisToday(), e=une(day);
    if(!e) return;
    var more=!!(e.x||e.l);
    var root=el("aside","daily"); root.setAttribute("aria-label","L’actu du jour");
    var inner=el("div","daily-inner");
    var front=el("div","daily-face daily-front");
    var fl=el(more?"button":"div","daily-fbtn");
    if(more) fl.type="button";
    fl.appendChild(el("span","daily-kick","L’actu du jour"));
    var ds=fmtLong.format(toUTC(day));
    fl.appendChild(el("span","daily-date",ds.charAt(0).toUpperCase()+ds.slice(1)));
    fl.appendChild(el("span","daily-tag",TAGS[e.c]||"Repère"));
    fl.appendChild(el("span","daily-t",e.t));
    if(e.q) fl.appendChild(el("span","daily-q",e.q));
    if(more) fl.appendChild(el("span","daily-hint","Retourner la carte ↻"));
    front.appendChild(fl); inner.appendChild(front);
    if(more){
      var back=el("div","daily-face daily-back"), bh=el("div","daily-bh"), close=el("button","daily-close","Fermer");
      close.type="button";
      bh.appendChild(el("span","daily-kick","L’actu du jour")); bh.appendChild(close);
      var bb=el("div","daily-bb");
      bb.appendChild(el("h3",null,e.t));
      if(e.x) bb.appendChild(el("p",null,e.x));
      if(e.l){var a=el("a",null,"Source : "+(e.s||"lien")+" ↗");a.href=e.l;a.target="_blank";a.rel="noopener";bb.appendChild(a);}
      back.appendChild(bh); back.appendChild(bb); inner.appendChild(back);
      back.inert=true; back.setAttribute("aria-hidden","true");
      var flip=function(on){
        root.classList.toggle("is-flipped",on);
        front.inert=on; back.inert=!on;
        front.setAttribute("aria-hidden",on?"true":"false"); back.setAttribute("aria-hidden",on?"false":"true");
        (on?close:fl).focus({preventScroll:true});
      };
      fl.addEventListener("click",function(){flip(true);});
      close.addEventListener("click",function(){flip(false);});
      root.addEventListener("keydown",function(ev){ if(ev.key==="Escape"&&root.classList.contains("is-flipped")) flip(false); });
    }
    root.appendChild(inner); host.appendChild(root);
  }

  prev.addEventListener("click",function(){offset=Math.max(0,offset-1);render();});
  next.addEventListener("click",function(){offset+=1;render();});
  now.addEventListener("click",function(){offset=0;render();track.scrollLeft=0;});

  fetch("agenda.json",{cache:"no-cache"}).then(function(r){return r.json();}).then(function(j){data=j;render();daily();})
  .catch(function(){ track.textContent=""; note.textContent="L’agenda de la semaine n’a pas pu être chargé. Réessayez dans quelques instants."; });
})();
