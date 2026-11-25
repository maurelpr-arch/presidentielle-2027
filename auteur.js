/* Carte « Le concepteur du site » : retourne la carte au clic, ferme avec « Retour » ou Échap. */
(function(){
  "use strict";
  var card=document.getElementById("auteur");
  if(!card)return;
  var front=card.querySelector(".afl-front"),back=card.querySelector(".afl-back"),
      open=card.querySelector(".afl-btn"),close=card.querySelector(".afl-close");
  function apply(on){
    card.classList.toggle("is-flipped",on);
    open.setAttribute("aria-expanded",on?"true":"false");
    front.inert=on;back.inert=!on;
    front.setAttribute("aria-hidden",on?"true":"false");
    back.setAttribute("aria-hidden",on?"false":"true");
  }
  function flip(on){
    apply(on);
    setTimeout(function(){(on?close:open).focus({preventScroll:true})},on?320:80);
  }
  apply(false);
  open.addEventListener("click",function(){flip(true)});
  close.addEventListener("click",function(){flip(false)});
  document.addEventListener("keydown",function(e){
    if(e.key==="Escape"&&card.classList.contains("is-flipped"))flip(false);
  });
})();
