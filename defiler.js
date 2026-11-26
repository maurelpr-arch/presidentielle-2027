/* Repères de défilement.
   - « Faire défiler » : visible en haut de page, disparaît dès qu'on descend ; un clic mène aux deux colonnes.
   - « Plus de cartes » : visible tant que la colonne de droite n'est pas arrivée en bas.
   - Ordre des cartes à retourner : les plus importantes en haut, les plus secondaires en bas. */
(function(){
  "use strict";

  /* Ordre des cartes (identifiants de app.js). Les cartes sont rangées deux par deux ; l'ordre alterne les couleurs
     et les types d'information (chiffres, dates, institutions…) pour que deux cartes voisines ne se ressemblent pas.
     Une carte absente de cette liste (ajoutée plus tard dans app.js) reste à la fin, dans son ordre d'origine.
       1re ligne : candidatures · électeurs      2e : parrainages · 18 avril      3e : FAQ · présidents
       4e : gouvernements · législatives          5e : Assemblée · élection         6e : loi · résultats 2022
       7e : histoire · cohabitations              8e : référendums · Ve République  9e : 49.3 · Conseil constitutionnel
       10e : mandat présidentiel · motion de censure */
  var ORDRE=["candidats","electeurs","parrainages","dates","faq","presidents","gouvernements","legislatives",
             "assemblee","election","loi","2022","histoire","cohabitations","referendums","republique",
             "493","cc","president","motion"];
  var flipsBox=document.getElementById("flips");
  if(flipsBox){
    ORDRE.forEach(function(id){
      var carte=document.getElementById("flip-"+id);
      if(carte&&carte.parentNode===flipsBox)flipsBox.appendChild(carte);
    });
    /* les cartes non listées passent après les cartes classées, sans changer leur ordre relatif */
    Array.prototype.slice.call(flipsBox.children).forEach(function(c){
      var id=(c.id||"").replace(/^flip-/,"");
      if(c.id&&ORDRE.indexOf(id)===-1)flipsBox.appendChild(c);
    });
  }

  var cue=document.getElementById("scrollcue");
  var right=document.querySelector(".col-right");
  var more=document.getElementById("more");

  function updateCue(){
    if(!cue)return;
    var hide=window.scrollY>80;
    cue.classList.toggle("is-hidden",hide);
    cue.tabIndex=hide?-1:0;
    cue.setAttribute("aria-hidden",hide?"true":"false");
  }
  if(cue){
    cue.addEventListener("click",function(){
      var target=document.querySelector(".layout");
      var top=target?target.getBoundingClientRect().top+window.scrollY-12:window.innerHeight;
      window.scrollTo({top:top,behavior:"smooth"});
    });
    window.addEventListener("scroll",updateCue,{passive:true});
    updateCue();
  }

  function updateMore(){
    if(!right||!more)return;
    var scrollable=right.scrollHeight>right.clientHeight+8;
    var atEnd=right.scrollTop+right.clientHeight>=right.scrollHeight-12;
    more.classList.toggle("is-hidden",!scrollable||atEnd);
  }
  if(right&&more){
    right.addEventListener("scroll",updateMore,{passive:true});
    window.addEventListener("resize",updateMore);
    if(window.ResizeObserver){
      var ro=new ResizeObserver(updateMore);
      ro.observe(right);
      var flips=document.getElementById("flips");
      if(flips)ro.observe(flips);
    }
    updateMore();
    setTimeout(updateMore,600);
  }
})();
