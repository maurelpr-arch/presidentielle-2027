/* Partage : copie du lien, partage natif du téléphone (Instagram, Messages, etc.), partage d'un visuel.
   Les boutons WhatsApp, Facebook et E-mail sont de simples liens : ils marchent même sans ce script. */
(function(){
  var URL_SITE="https://maurelpr-arch.github.io/presidentielle-2027/";
  var TEXTE="Qui sera le prochain président ou la prochaine présidente de la République en 2027 ? Un site d’électeurs pour les électeurs, factuel et neutre.";
  var status=document.getElementById("share-status");
  function dire(m){ if(!status)return; status.textContent=m; clearTimeout(dire.t); dire.t=setTimeout(function(){status.textContent="";},4000); }

  /* Copier le lien */
  var copy=document.getElementById("copy-link"), champ=document.getElementById("share-url");
  function copier(){
    function ok(){ dire("Lien copié. Vous pouvez le coller où vous voulez."); }
    function repli(){
      try{ champ.focus(); champ.select(); champ.setSelectionRange(0,999); document.execCommand("copy")?ok():dire("Sélectionnez le lien puis copiez-le."); }
      catch(e){ dire("Sélectionnez le lien puis copiez-le."); }
    }
    if(navigator.clipboard&&window.isSecureContext){ navigator.clipboard.writeText(URL_SITE).then(ok,repli); } else repli();
  }
  if(copy) copy.addEventListener("click",copier);
  var copy2=document.getElementById("copy-link-2"); if(copy2) copy2.addEventListener("click",copier);
  if(champ) champ.addEventListener("focus",function(){champ.select();});

  /* Partage natif (surtout sur téléphone) : propose Instagram, Messages, Telegram, etc. */
  var nat=document.getElementById("native-share");
  if(nat&&navigator.share){
    nat.hidden=false;
    nat.addEventListener("click",function(){
      navigator.share({title:"Présidentielle 2027 : un site d’électeurs pour les électeurs",text:TEXTE,url:URL_SITE}).catch(function(){});
    });
  }

  /* Visuels : cache ceux qui ne se chargent pas, propose « Partager » si le téléphone sait envoyer une image */
  var items=document.querySelectorAll(".visuels li");
  Array.prototype.forEach.call(items,function(li){
    var img=li.querySelector("img");
    if(img) img.addEventListener("error",function(){ li.style.display="none"; });
    var b=li.querySelector("[data-share-img]");
    if(!b) return;
    b.hidden=true;
    if(!(navigator.share&&navigator.canShare&&window.fetch)) return;
    b.hidden=false;
    b.addEventListener("click",function(){
      var src=b.getAttribute("data-share-img");
      fetch(src).then(function(r){return r.blob();}).then(function(blob){
        var f=new File([blob],src.split("/").pop(),{type:blob.type||"image/jpeg"});
        if(navigator.canShare({files:[f]})) return navigator.share({files:[f],text:TEXTE+" "+URL_SITE});
        dire("Ce téléphone ne peut pas partager l’image directement : utilisez « Télécharger ».");
      }).catch(function(){});
    });
  });
})();
