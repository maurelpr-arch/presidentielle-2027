/* Bandeau d'accueil : défilé des candidats, un par un. Après chaque série de 4, une diapo « ? » (le logo couronné).
   Les candidats viennent de CANDS (donnees.js), donc le défilé suit la mise à jour quotidienne.
   Ordre aléatoire à chaque visite, même temps d'affichage pour tous : aucun candidat n'est mis en avant.

   Le rond affiche les initiales du candidat, sur la couleur de son courant. Dès qu'une photo existe, elle les recouvre.
   PHOTOS : pour en ajouter une, déposer le fichier dans le dossier photos/ sous le nom du candidat
   en minuscules, sans accents, avec des tirets, au format .jpg :
   « Marine Le Pen » → photos/marine-le-pen.jpg ; « Jean-Luc Mélenchon » → photos/jean-luc-melenchon.jpg.
   Aucune modification de code n'est nécessaire.
   Mieux vaut des photos pour tous les candidats, ou pour aucun. */
(function(){
  "use strict";
  var stage=document.getElementById("hero-stage");
  var steps=document.getElementById("hero-steps");
  var btnPlay=document.getElementById("hero-play");
  var btnNext=document.getElementById("hero-next");
  if(!stage||typeof CANDS==="undefined"||!CANDS.length)return;

  var PHOTO_DIR="photos/",PHOTO_EXT=".jpg";
  var LOGO="logo.svg";
  var GROUP=4,T_CAND=1400,T_Q=1900;
  var colors={};
  (typeof COURANTS!=="undefined"?COURANTS:[]).forEach(function(c){colors[c.k]=c.color});

  function el(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e}
  function slug(n){return n.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}
  function initials(n){
    var w=n.replace(/’/g,"'").split(/\s+/).filter(Boolean);
    var last=w[w.length-1].replace(/^(d|l)'/i,"");
    return ((w[0][0]||"")+(w.length>1?last[0]:"")).toUpperCase();
  }
  function textOn(hex){
    var r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
    return (0.299*r+0.587*g+0.114*b)>150?"#13203B":"#FFFFFF";
  }
  function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t}return a}

  /* diapos : 4 candidats, un « ? », 4 candidats, un « ? »… */
  var list=shuffle(CANDS),slides=[];
  list.forEach(function(c,i){
    slides.push({c:c,n:i+1,pos:i%GROUP});
    if((i+1)%GROUP===0)slides.push({q:true,pos:GROUP});
  });
  if(list.length%GROUP!==0)slides.push({q:true,pos:GROUP});

  /* repère 1 2 3 4 ? */
  var dots=[];
  if(steps){
    for(var k=0;k<GROUP;k++){var s=el("span",null,String(k+1));steps.appendChild(s);dots.push(s)}
    var sq=el("span",null,"?");steps.appendChild(sq);dots.push(sq);
  }

  function render(s){
    var slide=el("div","hero-slide"+(s.q?" is-q":""));
    if(s.q){
      /* le logo (point d'interrogation couronné) remplace le grand « ? » ; sa taille suit celle de .hero-bigq */
      var big=el("div","hero-bigq");
      var logo=document.createElement("img");
      logo.src=LOGO;logo.alt="";
      logo.style.cssText="display:block;width:1.15em;height:1.15em";
      logo.onerror=function(){logo.remove();big.textContent="?"};
      big.appendChild(logo);
      slide.appendChild(big);
      var t=el("p","hero-qtext","Qui sera le ou la prochain·e président·e ?");
      t.appendChild(el("small",null,"Réponse les 18 avril et 2 mai 2027"));
      slide.appendChild(t);
    }else{
      var name=s.c[0],party=s.c[1],col=colors[s.c[2]]||"#A8A39A";
      var av=el("div","hero-av",initials(name));   /* initiales ; recouvertes par la photo si elle existe */
      av.style.setProperty("--c",col);av.style.setProperty("--t",textOn(col));
      var img=document.createElement("img");
      img.alt="";
      img.onerror=function(){img.remove()};
      img.src=PHOTO_DIR+slug(name)+PHOTO_EXT;
      av.appendChild(img);
      var txt=el("div","hero-txt");
      txt.appendChild(el("div","hero-rank","Candidat "+s.n+" sur "+list.length));
      txt.appendChild(el("h3","hero-name",name));
      txt.appendChild(el("p","hero-party",party));
      slide.appendChild(av);slide.appendChild(txt);
    }
    stage.replaceChildren(slide);
    dots.forEach(function(d,i){d.classList.toggle("on",i===s.pos)});
  }

  var i=-1,timer=null,playing=true;
  var reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(reduce)playing=false;

  function step(){i=(i+1)%slides.length;render(slides[i])}
  function loop(){
    step();
    timer=setTimeout(function(){if(playing)loop()},slides[i].q?T_Q:T_CAND);
  }
  function setPlaying(on){
    playing=on;clearTimeout(timer);
    if(btnPlay)btnPlay.textContent=on?"Pause":"Lecture";
    if(on)timer=setTimeout(loop,300);
  }

  step();                       /* première diapo tout de suite */
  if(btnPlay){
    btnPlay.textContent=playing?"Pause":"Lecture";
    btnPlay.addEventListener("click",function(){setPlaying(!playing)});
  }
  if(btnNext)btnNext.addEventListener("click",function(){setPlaying(false);step()});
  if(playing)timer=setTimeout(loop,T_CAND);

  document.addEventListener("visibilitychange",function(){
    if(document.hidden){clearTimeout(timer)}
    else if(playing){clearTimeout(timer);timer=setTimeout(loop,T_CAND)}
  });
})();
