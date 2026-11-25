/* Repères de défilement.
   - « Faire défiler » : visible en haut de page, disparaît dès qu'on descend ; un clic mène aux deux colonnes.
   - « Plus de cartes » : visible tant que la colonne de droite n'est pas arrivée en bas. */
(function(){
  "use strict";
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
