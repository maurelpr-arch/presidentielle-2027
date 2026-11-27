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