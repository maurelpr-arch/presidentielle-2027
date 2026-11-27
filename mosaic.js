/* Mosaïque : le bouton « Lire la suite » ouvre le contenu complet dans une fenêtre (les boutons de partage gardent leur fonctionnement). */
(function(){
  var btns=document.querySelectorAll(".mo-more");
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
