/* Mosaïque : aperçus des visuels de promotion. Les images JPG de partage/ n'existent pas encore : chaque visuel est une petite page HTML (partage/visuel-*.html)
   affichée en aperçu réduit (iframe mise à l'échelle). Quand les JPG auront été exportés dans partage/, remplacer ces aperçus par les images. */
(function(){
  var MAP={
    "visuel-carre-1-la-question":["visuel-semainier-carre","Le semainier","carré",1080,1080,"Carré 1:1 · Instagram, Facebook, WhatsApp"],
    "visuel-carre-2-500-parrainages":["visuel-chronologie-carre","La chronologie","carré",1080,1080,"Carré 1:1 · Instagram, Facebook, WhatsApp"],
    "visuel-carre-3-les-dates":["visuel-cartes-portrait","Les cartes à retourner","portrait",1080,1350,"Portrait 4:5 · Instagram, Facebook"],
    "visuel-story-vertical":["visuel-story-vertical","Story verticale","vertical",1080,1920,"Vertical 9:16 · stories Instagram et Facebook, statut WhatsApp"],
    "visuel-facebook-paysage":["visuel-facebook-paysage","Publication Facebook","paysage",1200,630,"Paysage 1,9:1 · Facebook, LinkedIn"]
  };
  var X=["visuel-x-paysage","Le site sur X","paysage",1600,900,"Paysage 16:9 · X"];
  function key(src){ var m=/partage\/([^\/?#]+)\.jpg/.exec(src||""); return m?m[1]:""; }
  function frame(v){
    var f=document.createElement("iframe"); f.className="pv"; f.src="partage/"+v[0]+".html"; f.title="Visuel « "+v[1]+" »";
    f.setAttribute("data-w",v[3]); f.setAttribute("data-h",v[4]); f.setAttribute("loading","lazy"); f.tabIndex=-1; f.setAttribute("scrolling","no");
    f.style.cssText="position:absolute;left:0;top:0;border:0;transform-origin:0 0;pointer-events:none;background:#E4E4DF";
    return f;
  }
  var frames=[];
  function fit(f){
    var p=f.parentNode, w=+f.getAttribute("data-w"), h=+f.getAttribute("data-h"), pw=p.clientWidth, ph=p.clientHeight; if(!pw||!ph) return;
    var sc=Math.max(pw/w,ph/h); f.style.width=w+"px"; f.style.height=h+"px";
    f.style.transform="translate("+((pw-w*sc)/2)+"px,"+((ph-h*sc)/2)+"px) scale("+sc+")";
  }
  function put(pic,v){
    pic.textContent=""; var f=frame(v); pic.appendChild(f); frames.push(f);
    if(window.ResizeObserver){ new ResizeObserver(function(){ fit(f); }).observe(pic); }
    fit(f);
  }
  /* Cartes de la mosaïque */
  var cards=document.querySelectorAll("#partager li.mo-img"), last=null;
  Array.prototype.forEach.call(cards,function(li){
    var im=li.querySelector("img"), a=li.querySelector(".mo-dl"), v=MAP[key(im?im.getAttribute("src"):(a?a.getAttribute("href"):""))];
    if(!v) return;
    put(li.querySelector(".mo-pic"),v);
    if(a){ a.removeAttribute("download"); a.href="partage/"+v[0]+".html"; a.target="_blank"; a.rel="noopener"; a.textContent=v[1]+" · Voir ↗"; }
    var k=li.querySelector(".mo-kick"); if(k) k.textContent="Visuel · "+v[2];
    last=li;
  });
  if(last){
    var c=last.cloneNode(true), pic=c.querySelector(".mo-pic"), a=c.querySelector(".mo-dl");
    last.parentNode.insertBefore(c,last.nextSibling); put(pic,X);
    a.href="partage/"+X[0]+".html"; a.textContent=X[1]+" · Voir ↗"; c.querySelector(".mo-kick").textContent="Visuel · "+X[2];
  }
  /* Liste détaillée (fenêtre « Des visuels prêts à publier ») */
  var items=document.querySelectorAll("#mo-visuels .visuels > li"), lastLi=null;
  Array.prototype.forEach.call(items,function(li){
    var im=li.querySelector("img"), v=MAP[key(im?im.getAttribute("src"):"")]; if(!v) return;
    var w=document.createElement("div"); w.className="pv-wrap"; w.style.cssText="position:relative;overflow:hidden;width:100%;aspect-ratio:"+v[3]+"/"+v[4]+";background:#E4E4DF";
    im.parentNode.replaceChild(w,im); put(w,v);
    var cap=li.querySelector(".cap"); if(cap){ cap.textContent=v[1]; var s=document.createElement("small"); s.textContent=v[5]; cap.appendChild(s); }
    var acts=li.querySelector(".acts"); if(acts){ acts.textContent=""; var b=document.createElement("a"); b.className="sbtn"; b.href="partage/"+v[0]+".html"; b.target="_blank"; b.rel="noopener"; b.textContent="Voir en grand"; acts.appendChild(b); }
    lastLi=li;
  });
  if(lastLi){
    var c2=lastLi.cloneNode(true), w2=c2.querySelector(".pv-wrap"), b2=c2.querySelector(".sbtn");
    lastLi.parentNode.insertBefore(c2,lastLi.nextSibling); w2.style.aspectRatio=X[3]+"/"+X[4]; put(w2,X);
    c2.querySelector(".cap").firstChild.nodeValue=X[1]; c2.querySelector(".cap small").textContent=X[5]; b2.href="partage/"+X[0]+".html";
  }
  var sub=document.querySelector('.mo-more[data-open="mo-visuels"]'); sub=sub&&sub.parentNode.querySelector(".mo-sub");
  if(sub) sub.textContent="Six visuels à publier : semainier, chronologie, cartes à retourner, story, Facebook et X.";
})();

/* Édito de la semaine en carte à retourner : si edito.json contient "suite" (liste de paragraphes), la carte reçoit un bouton « Lire la suite » qui ouvre le texte complet dans une fenêtre,
   comme les autres cartes. La carte est créée par agenda.js après le chargement de edito.json : on l'attend. */
(function(){
  if(!window.fetch||!document.createElement("dialog").showModal) return;
  fetch("edito.json",{cache:"no-cache"}).then(function(r){return r.json();}).then(function(j){
    if(!j||!j.suite||!j.suite.length) return;
    function attach(){
      var li=document.querySelector(".ag-edito"); if(!li) return false;
      if(li.querySelector(".mo-more")) return true;
      var b=document.createElement("button"); b.type="button"; b.className="mo-more"; b.textContent="Lire la suite";
      var sig=li.querySelector(".ag-edito-sig"); li.insertBefore(b,sig||null);
      var dlg=document.createElement("dialog"); dlg.className="mo-dialog"; dlg.setAttribute("aria-labelledby","ed-dt");
      var hd=document.createElement("div"); hd.className="mo-dh";
      var h=document.createElement("h2"); h.id="ed-dt"; h.textContent=j.titre||j.kick||"L’édito de la semaine";
      var x=document.createElement("button"); x.type="button"; x.className="mo-x"; x.textContent="Fermer";
      hd.appendChild(h); hd.appendChild(x);
      var bd=document.createElement("div"); bd.className="mo-db";
      [j.texte].concat(j.suite).forEach(function(t){ if(!t) return; var p=document.createElement("p"); p.textContent=t; bd.appendChild(p); });
      if(j.signe){ var s=document.createElement("p"); s.className="ag-edito-sig"; s.textContent=j.signe; bd.appendChild(s); }
      dlg.appendChild(hd); dlg.appendChild(bd); document.body.appendChild(dlg);
      b.addEventListener("click",function(){ dlg.showModal(); dlg.scrollTop=0; });
      x.addEventListener("click",function(){ dlg.close(); });
      dlg.addEventListener("click",function(e){ if(e.target===dlg) dlg.close(); });
      dlg.addEventListener("close",function(){ b.focus(); });
      return true;
    }
    if(attach()) return;
    var mo=new MutationObserver(function(){ if(attach()) mo.disconnect(); });
    mo.observe(document.body,{childList:true,subtree:true});
    setTimeout(function(){ mo.disconnect(); },15000);
  }).catch(function(){});
})();

/* Menu du haut : lien « La carte » (la carte des rendez-vous est construite par agenda.js, son titre porte l'id h-agmap), placé après « La semaine ». */
(function(){
  var first=document.querySelector(".tn-links li"); if(!first||document.querySelector('.tn-links a[href="#h-agmap"]')) return;
  var li=document.createElement("li"), a=document.createElement("a");
  a.href="#h-agmap"; a.textContent="La carte"; li.appendChild(a);
  first.parentNode.insertBefore(li,first.nextSibling);
})();

/* Bandeau défilant sous la barre noire (façon dépêches) : le texte de présentation du site défile doucement ; il se met en pause au survol
   et reste fixe (texte entier) si le visiteur a demandé moins d'animations. La phrase courte d'index.html sert de repli sans JavaScript. */
(function(){
  var p=document.querySelector("p.pitch"); if(!p) return;
  var TXT="L’Agenda Politique, c’est l’élection présidentielle de 2027 jour après jour, en un coup d’œil. L’agenda de la semaine : les réunions publiques des candidats, les séances du Parlement et une information internationale chaque jour. La carte : où se jouent les rendez-vous des candidats cette semaine. L’édito de la semaine. La chronologie de septembre 2026 à juin 2027 : dates clés, parrainages, deux tours de scrutin. Les cartes à retourner : candidats par courant politique, règles du vote, institutions, gouvernements. Actualisé chaque matin, avec ses sources, factuel et neutre : un site d’électeurs pour les électeurs.";
  p.textContent=""; p.className="pitch ticker"; p.setAttribute("aria-label",TXT);
  var lab=document.createElement("span"); lab.className="tk-label"; lab.setAttribute("aria-hidden","true"); lab.textContent="Le site en bref";
  var view=document.createElement("span"); view.className="tk-view"; view.setAttribute("aria-hidden","true");
  var tr=document.createElement("span"); tr.className="tk-track";
  for(var i=0;i<2;i++){ var s=document.createElement("span"); s.textContent=TXT; tr.appendChild(s); }
  view.appendChild(tr); p.appendChild(lab); p.appendChild(view);
  function speed(){ var w=tr.scrollWidth/2; tr.style.setProperty("--tkd",Math.max(40,Math.round(w/55))+"s"); }
  speed(); window.addEventListener("resize",speed);
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(speed);
})();

/* Mosaïque : le bouton « Lire la suite » ouvre le contenu complet dans une fenêtre (les boutons de partage gardent leur fonctionnement). */
(function(){
  /* Carte « Le site » (colonne à droite de la carte) : le début du texte complet remplit la carte, « Lire la suite » ouvre le reste. */
  (function(){ var ob=document.querySelector('.mo-more[data-open="mo-edito"]'), full=document.getElementById("mo-edito"), p=full&&full.querySelector("p"), sub=ob&&ob.parentNode.querySelector(".mo-sub"); if(p&&sub) sub.textContent=p.textContent; })();
  var btns=document.querySelectorAll(".mo-more");
  Array.prototype.forEach.call(document.querySelectorAll("[data-goto]"),function(g){ g.addEventListener("click",function(){ var b=document.querySelector('.mo-more[data-open="'+g.getAttribute("data-goto")+'"]'); if(b) b.click(); }); });
  if(!btns.length||!document.createElement("dialog").showModal) return;
  var dlg=document.createElement("dialog");
  dlg.className="mo-dialog"; dlg.setAttribute("aria-labelledby","mo-dt");
  dlg.innerHTML='<div class="mo-dh"><h2 id="mo-dt"></h2><button type="button" class="mo-x">Fermer</button></div><div class="mo-db"></div>';
  document.body.appendChild(dlg);
  var titre=dlg.querySelector("#mo-dt"), corps=dlg.querySelector(".mo-db"), noeud=null, maison=null, ouvreur=null;
  function ouvrir(b){
    var n=document.getElementById(b.getAttribute("data-open")); if(!n) return;
    noeud=n; maison=n.parentNode; ouvreur=b;
    titre.textContent=b.getAttribute("data-title")||"";
    n.hidden=false; corps.appendChild(n);
    dlg.showModal(); dlg.scrollTop=0;
  }
  dlg.addEventListener("close",function(){
    if(noeud){ noeud.hidden=true; maison.appendChild(noeud); noeud=null; }
    if(ouvreur) ouvreur.focus();
  });
  dlg.querySelector(".mo-x").addEventListener("click",function(){ dlg.close(); });
  dlg.addEventListener("click",function(e){ if(e.target===dlg) dlg.close(); });
  Array.prototype.forEach.call(btns,function(b){ b.addEventListener("click",function(){ ouvrir(b); }); });
})();