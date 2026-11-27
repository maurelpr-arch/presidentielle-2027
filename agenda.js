/* Bandeau noir du haut : le macaron A à point bleu (copie du macaron de la marque, même lettre, même police) remplace l'ancien logo.
   Sur fond noir, le disque noir reçoit un liseré blanc pour rester visible. */
(function(){
  var mk=document.querySelector(".brand-mark"), old=document.querySelector("#majbox .maj-logo");
  if(!mk||!old) return;
  var c=mk.cloneNode(true), disc=c.querySelector("circle");
  c.setAttribute("class","maj-logo maj-macaron");
  c.removeAttribute("role"); c.removeAttribute("aria-label"); c.setAttribute("aria-hidden","true"); c.setAttribute("focusable","false");
  if(disc){ disc.setAttribute("stroke","#fff"); disc.setAttribute("stroke-width","2.5"); }
  old.parentNode.replaceChild(c,old);
})();

/* L'agenda politique de la semaine : 7 jours glissants à partir d'aujourd'hui (heure de Paris).
   Les rendez-vous sont lus dans agenda.json. 1 à 4 rendez-vous français par jour, et au plus 1 information internationale.
   Une information internationale, quand il y en a une, est toujours en tête de la journée (en rouge) et porte le badge « À la une ».
   Sinon, l'actualité principale : "p":1 dans agenda.json impose le choix ; sinon première séance du Parlement, sinon
   premier candidat (les mentions « éventuelle » ou « si nécessaire » passent en dernier). */
(function(){
  var track=document.getElementById("ag-track");
  if(!track) return;
  var TAGS={candidat:"Candidat",parlement:"Parlement",international:"International"};
  var data=null, offset=0, ORDER=["candidat","parlement","international"], UNE_ORDER=["international","parlement","candidat"];
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

  /* Rendez-vous du jour : l'information internationale d'abord, puis l'actualité principale, puis les autres */
  function eventsFor(day){
    var u=une(day);
    var list=eventsRaw(day).slice().sort(function(a,b){return ORDER.indexOf(a.c)-ORDER.indexOf(b.c);});
    if(u){ var at=list.indexOf(u); if(at>0){ list.splice(at,1); list.unshift(u); } }
    /* Une information internationale, quand il y en a une, est toujours en tête de la journée (en rouge). */
    var intl=list.filter(function(e){return e.c==="international";}), rest=list.filter(function(e){return e.c!=="international";});
    return intl.concat(rest);
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

  /* ===== Carte des rendez-vous de la semaine (candidats) =====
     Un point par rendez-vous de candidat qui porte "ll":[latitude,longitude] et "v":"Ville" dans agenda.json (le même point pour
     tous les candidats, aucun nom). Les rendez-vous proches sont regroupés. Métropole et Corse seulement. */
  var FRPATH="M718,331 709,332 710,336 706,337 703,344 711,342 714,345 713,346 707,350 707,353 702,360 695,365 692,369 692,371 688,374 680,376 677,380 678,384 677,391 678,392 658,410 660,413 656,420 655,424 661,428 657,435 659,438 650,441 649,443 651,444 649,448 654,447 659,447 667,441 669,438 667,438 665,436 669,428 671,428 674,430 681,425 694,425 699,427 696,429 702,435 698,442 698,448 704,449 702,455 705,454 707,455 712,466 706,472 699,473 699,483 706,489 710,490 709,494 710,502 716,505 717,508 721,510 717,517 718,523 714,527 713,525 708,527 707,529 704,530 704,533 701,534 696,531 695,533 691,533 688,536 691,543 695,543 695,553 702,557 705,558 706,556 710,558 710,563 714,569 714,572 709,571 707,573 706,581 701,585 706,592 704,594 703,599 709,606 710,610 719,612 726,618 730,617 731,620 750,615 749,618 752,624 749,627 748,632 745,634 743,639 739,642 741,648 734,653 731,653 727,657 724,656 722,660 719,659 717,667 716,666 707,669 707,674 704,678 697,680 696,679 694,680 693,686 685,691 692,692 688,701 684,699 680,702 675,702 673,703 673,707 667,705 663,705 661,707 660,713 658,712 659,708 653,708 652,706 647,704 645,705 646,708 641,711 640,706 633,703 631,699 628,701 624,697 622,698 613,697 614,694 613,691 614,688 612,685 606,687 595,687 591,679 589,678 585,680 584,687 573,685 567,683 568,681 567,677 544,675 541,673 542,670 540,668 535,668 528,671 518,681 514,682 505,692 498,691 491,696 481,709 478,718 477,747 479,754 483,756 483,759 485,763 480,764 478,760 473,761 472,759 471,761 466,761 463,765 456,766 456,771 451,770 448,772 445,771 442,767 432,763 424,765 422,769 416,769 413,762 410,762 405,759 401,758 401,753 404,751 401,750 401,748 394,747 390,744 386,745 386,748 384,749 379,739 371,738 367,740 364,734 356,732 353,733 341,727 338,729 339,732 337,733 339,741 325,741 320,739 316,743 315,739 310,737 299,742 293,739 290,732 289,733 281,728 276,732 273,732 269,730 267,734 260,725 257,724 255,718 244,719 234,713 233,714 227,710 225,711 223,709 224,705 220,707 220,713 215,711 213,707 216,704 218,693 211,690 208,690 207,694 205,694 204,689 202,688 198,690 195,685 194,683 205,678 214,662 222,619 226,583 229,575 231,573 236,575 240,574 237,569 231,564 225,576 233,501 235,497 237,497 238,501 250,512 254,520 259,538 264,543 265,541 260,534 256,513 252,505 241,495 240,493 227,484 226,478 233,476 232,471 235,470 237,464 235,460 238,458 233,449 228,445 229,441 234,437 233,433 229,432 229,437 220,430 213,430 211,426 205,424 193,417 190,408 185,401 174,390 173,384 175,383 180,373 183,372 179,366 169,363 169,361 172,360 172,351 171,350 164,354 160,351 156,352 152,350 153,346 149,342 156,338 153,335 153,332 156,332 155,331 152,329 147,330 144,328 142,332 132,332 129,326 137,328 140,325 138,320 132,321 130,325 127,323 123,326 122,324 116,326 116,329 118,333 116,334 114,331 115,325 111,320 112,316 116,313 113,312 111,319 103,312 101,314 97,315 93,310 93,302 92,309 83,308 80,306 73,306 66,297 66,301 57,301 55,302 54,300 53,301 55,303 54,306 43,306 42,304 44,303 44,301 40,292 33,288 32,289 28,286 24,287 23,284 43,280 47,281 48,280 49,276 47,272 38,269 35,269 32,275 33,268 29,267 31,265 31,262 32,260 33,265 40,264 42,266 47,264 49,265 52,264 45,262 46,260 43,260 43,261 39,261 41,256 40,255 29,260 25,259 23,261 19,261 20,257 18,254 20,249 19,246 22,242 29,240 32,236 39,235 44,231 52,234 54,231 61,230 66,227 68,233 70,232 74,236 73,231 75,229 85,230 85,233 89,232 89,228 91,225 89,223 92,221 92,219 100,221 104,218 108,218 110,215 111,218 118,215 118,219 123,219 123,221 121,222 128,225 127,228 134,234 134,238 140,242 141,246 142,244 145,244 153,237 155,234 158,234 164,232 165,233 162,236 164,237 167,234 170,240 175,238 174,235 176,235 180,236 184,243 185,243 181,233 186,230 191,230 190,234 191,236 195,238 215,236 218,234 211,230 208,226 207,219 205,218 209,210 205,197 206,184 204,186 199,176 193,172 189,158 191,155 191,151 190,148 185,146 185,142 204,149 210,148 213,144 216,144 225,145 227,152 223,154 223,158 231,169 230,172 234,173 236,171 244,170 251,173 275,175 286,180 299,176 307,169 319,166 306,164 303,161 311,144 333,131 359,126 370,121 385,109 386,104 390,100 393,103 398,103 390,95 390,89 396,89 391,85 392,73 394,73 392,70 391,59 393,54 392,44 396,44 404,37 449,26 450,33 454,38 451,40 454,49 459,49 464,58 466,57 469,59 472,55 477,53 480,53 482,51 484,52 488,58 490,59 489,63 492,74 497,77 503,73 506,74 504,76 511,76 514,80 514,87 517,93 519,89 525,89 529,91 536,88 541,93 541,95 546,95 547,97 541,107 545,107 547,112 542,117 542,120 545,122 552,121 560,124 564,123 568,120 573,119 574,113 579,107 582,105 586,106 586,107 584,110 580,121 586,126 584,130 584,136 593,136 598,139 602,145 608,144 612,148 611,152 613,150 618,153 620,161 631,157 634,158 638,156 642,158 644,161 650,162 650,165 658,163 660,161 666,160 673,165 676,163 679,164 684,168 683,170 686,171 685,174 692,185 693,185 695,190 700,191 702,189 700,186 706,185 712,188 713,194 716,192 726,194 731,191 731,189 736,188 737,190 739,189 741,196 747,199 753,200 756,198 761,201 765,199 774,205 782,206 774,220 767,225 766,228 759,234 757,240 757,245 753,255 754,260 744,279 743,286 746,291 743,299 741,307 742,311 740,314 744,325 740,328 741,330 738,333 735,332 735,333 736,334 732,337 724,338 720,336 721,332 718,331ZM414,760 414,762 417,762 416,760 414,760ZM593,668 593,675 596,676 597,681 601,681 604,678 606,676 606,674 601,676 599,670 595,671 593,668ZM164,399 162,401 159,398 164,399ZM170,378 167,378 164,375 166,372 169,373 169,376 173,380 172,382 170,378ZM0,252 0,249 2,248 4,249 0,252ZM99,321 94,320 94,318 98,319 99,321ZM112,343 120,348 118,350 114,349 110,349 109,347 108,343 112,343ZM212,442 216,440 216,442 224,444 224,447 220,446 214,442 209,442 208,439 212,438 213,440 211,440 212,442ZM226,473 218,463 216,455 223,460 226,460 227,466 230,469 229,474 227,476 226,473ZM677,714 680,711 679,714 677,714ZM675,716 674,714 676,714 675,716ZM666,713 666,715 663,716 661,715 666,713ZM851,812 850,829 844,834 845,836 846,834 849,835 844,841 844,844 840,848 842,851 840,854 838,854 833,851 833,848 820,842 814,835 815,832 820,830 822,827 814,825 814,822 811,824 809,822 811,819 810,817 814,816 814,810 816,810 814,807 805,809 804,804 808,802 807,799 812,797 810,792 806,790 802,787 801,780 809,778 809,777 805,774 805,770 801,772 801,771 802,768 804,767 804,765 807,765 808,756 810,756 813,752 815,753 816,749 820,747 828,746 834,738 840,738 844,743 847,737 845,730 848,720 847,715 851,714 854,716 856,732 853,743 858,752 860,783 859,791 851,804 851,812Z";
  var PJ={lon0:-5.1036,lat1:51.0884,kx:58.65,sc:85.2,oy:25.86};
  var mapSec=null;
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
  function proj(ll){return [(ll[1]-PJ.lon0)*PJ.kx,(PJ.lat1-ll[0])*PJ.sc+PJ.oy];}
  function inFrance(ll){return ll&&ll.length===2&&ll[0]>41&&ll[0]<51.2&&ll[1]>-5.3&&ll[1]<9.8;}
  function ensureMap(){
    if(mapSec) return mapSec;
    var host=track.closest("section")||track.parentNode;
    mapSec=el("section","ag-map"); mapSec.setAttribute("aria-labelledby","h-agmap");
    /* Titre et sous-titre en dehors de la carte, au-dessus des deux colonnes (comme les autres titres de section) */
    var head=el("div","ag-map-head"), main=el("div","ag-map-main");
    var h=el("h3","ag-map-t"); h.id="h-agmap"; h.appendChild(document.createTextNode("Où se joue la campagne cette semaine"));
    h.appendChild(el("span","ag-map-qm"," ?"));
    head.appendChild(h);
    head.appendChild(el("p","ag-map-sub"));
    mapSec.appendChild(head);
    var g=el("div","ag-map-grid"); g.appendChild(el("div","ag-map-box")); g.appendChild(el("ul","ag-map-list")); main.appendChild(g);
    var rd=el("div","ag-map-read"); rd.appendChild(el("p","ag-map-stat"));
    rd.appendChild(el("p","ag-map-how","Comment lire la carte : chaque point est un lieu où au moins un candidat déclaré tient une réunion publique ou un meeting cette semaine. Un chiffre dans le point indique plusieurs rendez-vous regroupés dans la même zone ; le trait relie le point à son étiquette. Tous les candidats sont traités de la même façon : même point, même taille, aucun nom sur la carte (les noms sont dans la liste de droite et dans le semainier, avec la source). La carte ne mesure ni l’audience ni le poids d’un candidat : elle montre seulement où se passent les rendez-vous annoncés."));
    main.appendChild(rd);
    main.appendChild(el("p","ag-map-note","Rendez-vous publics annoncés par les candidats déclarés, les mêmes règles pour tous : un point, un ou plusieurs rendez-vous. Métropole et Corse ; les sources sont dans le détail de chaque rendez-vous du semainier."));
    mapSec.appendChild(main);
    /* Colonne de droite (un tiers) : en haut l'édito de la semaine (edito.json), en bas la carte « Le site » reprise de la mosaïque ;
       son bouton « Lire la suite » garde son fonctionnement. La carte « Les coulisses » (le concepteur du site) prend la première place de la mosaïque. */
    var side=el("ul","ag-map-side"), cards=document.querySelectorAll("#partager .mo-card.mo-art"), grid=document.querySelector("#partager .mo-grid"), coul=null;
    for(var i=0;i<cards.length;i++){
      var k=cards[i].querySelector(".mo-kick"), n=k?k.textContent.trim():"";
      if(n==="Le site") side.appendChild(cards[i]); else if(n==="Les coulisses") coul=cards[i];
    }
    if(grid&&coul) grid.insertBefore(coul,grid.firstChild);
    mapSec.appendChild(side);
    if(!side.children.length) mapSec.className+=" ag-map-solo";
    fetch("edito.json",{cache:"no-cache"}).then(function(r){return r.json();}).then(function(j){
      if(!j||!j.texte) return;
      var li=el("li","mo-card mo-art ag-edito");
      li.appendChild(el("span","mo-kick",j.kick||"L’édito de la semaine"));
      if(j.titre) li.appendChild(el("h3",null,j.titre));
      li.appendChild(el("p","ag-edito-txt",j.texte));
      var sg=(j.signe||"")+(j.date?(j.signe?" · ":"")+new Intl.DateTimeFormat("fr-FR",{day:"numeric",month:"long",year:"numeric",timeZone:"UTC"}).format(toUTC(j.date)):"");
      if(sg) li.appendChild(el("p","ag-edito-sig",sg));
      side.insertBefore(li,side.firstChild);
      mapSec.className=mapSec.className.replace(" ag-map-solo","");
    }).catch(function(){});
    host.parentNode.insertBefore(mapSec,host.nextSibling);
    return mapSec;
  }
  function renderMap(start){
    var s=ensureMap(), box=s.querySelector(".ag-map-box"), list=s.querySelector(".ag-map-list"), sub=s.querySelector(".ag-map-sub");
    var fmtDM=new Intl.DateTimeFormat("fr-FR",{day:"numeric",month:"long",timeZone:"UTC"});
    var total=0, items=[], rows=[], i;
    for(i=0;i<7;i++){
      var day=addDays(start,i), d=toUTC(day), evs=eventsRaw(day).filter(function(e){return e.c==="candidat";});
      if(!evs.length) continue;
      total+=evs.length;
      var names=[], short=d.getUTCDate()+" "+fmtMon.format(d);
      evs.forEach(function(e){
        var v=e.v||e.t; if(names.indexOf(v)<0) names.push(v);
        if(inFrance(e.ll)){ var p=proj(e.ll); items.push({x:p[0],y:p[1],v:e.v||e.t,date:short}); }
      });
      rows.push({lab:fmtDow.format(d).replace(".","")+" "+short,names:names});
    }
    var a=addDays(start,0), b=addDays(start,6);
    sub.textContent=(total?total+" rendez-vous de candidats":"Aucun rendez-vous de candidat annoncé")+", du "+fmtDM.format(toUTC(a))+" au "+fmtDM.format(toUTC(b))+".";
    list.textContent="";
    rows.forEach(function(r){ var li=el("li"); li.appendChild(el("b",null,r.lab+" ")); li.appendChild(document.createTextNode(r.names.join(", "))); list.appendChild(li); });
    var cl=[];
    items.forEach(function(it){
      for(var k=0;k<cl.length;k++){ if(Math.hypot(cl[k].x-it.x,cl[k].y-it.y)<34){ var c=cl[k]; c.x=(c.x*c.n+it.x)/(c.n+1); c.y=(c.y*c.n+it.y)/(c.n+1); c.n++; if(c.names.indexOf(it.v)<0) c.names.push(it.v); c.dates.push(it.date); return; } }
      cl.push({x:it.x,y:it.y,n:1,names:[it.v],dates:[it.date]});
    });
    /* Étiquettes : à droite ou à gauche du point, décalées en hauteur si elles se touchent, et reliées au point par un trait */
    var labs=cl.map(function(c){
      var r=c.n===1?11:Math.min(14+c.n*2.5,30), side=(c.x<400||c.x>560)?"l":"r";
      var l1=c.names.length>2?c.names.slice(0,2).join(", ")+" +"+(c.names.length-2):c.names.join(", ");
      var l2=c.n===1?c.dates[0]:c.n+" rendez-vous";
      return {c:c,r:r,side:side,y:c.y,l1:l1,l2:l2};
    }).sort(function(p,q){return p.c.y-q.c.y;});
    var lastY={l:-1e9,r:-1e9}, GAP=58;
    labs.forEach(function(L){
      var pref=L.side, oth=pref==="l"?"r":"l";
      if(L.c.y-lastY[pref]<GAP && L.c.y-lastY[oth]>=GAP) L.side=oth;
      L.y=Math.max(L.c.y,lastY[L.side]+GAP); lastY[L.side]=L.y;
      L.x=L.side==="l"?L.c.x-L.r-46:L.c.x+L.r+46;
    });
    var svg='<svg viewBox="-110 0 980 890" role="img" aria-label="Carte de la France métropolitaine : '+esc(total)+' rendez-vous de candidats cette semaine, détaillés dans la liste" focusable="false"><path d="'+FRPATH+'" class="ag-map-fr"/>';
    labs.forEach(function(L){
      var c=L.c, dx=L.side==="l"?-8:8;
      svg+='<path d="M'+c.x.toFixed(0)+','+c.y.toFixed(0)+' L'+(L.x+dx).toFixed(0)+','+(L.y-9).toFixed(0)+'" class="ag-map-lead"/>';
    });
    labs.forEach(function(L){
      var c=L.c, anchor=L.side==="l"?"end":"start";
      svg+='<circle cx="'+c.x.toFixed(0)+'" cy="'+c.y.toFixed(0)+'" r="'+(L.r+9)+'" class="ag-map-halo"/><circle cx="'+c.x.toFixed(0)+'" cy="'+c.y.toFixed(0)+'" r="'+L.r+'" class="ag-map-dot"/>';
      if(c.n>1) svg+='<text x="'+c.x.toFixed(0)+'" y="'+(c.y+9).toFixed(0)+'" text-anchor="middle" class="ag-map-n">'+c.n+'</text>';
      svg+='<text x="'+L.x.toFixed(0)+'" y="'+(L.y-2).toFixed(0)+'" text-anchor="'+anchor+'" class="ag-map-l1">'+esc(L.l1)+'</text><text x="'+L.x.toFixed(0)+'" y="'+(L.y+24).toFixed(0)+'" text-anchor="'+anchor+'" class="ag-map-l2">'+esc(L.l2)+'</text>';
    });
    svg+='</svg>';
    box.innerHTML=svg;
    /* Texte sous la carte : chiffres de la semaine (calculés) */
    var stat=s.querySelector(".ag-map-stat"), villes=[], best=null;
    rows.forEach(function(r){ r.names.forEach(function(v){ if(villes.indexOf(v)<0) villes.push(v); }); });
    for(i=0;i<7;i++){ var dd=addDays(start,i), nn=eventsRaw(dd).filter(function(e){return e.c==="candidat";}).length; if(nn&&(!best||nn>best.n)){ var d2=toUTC(dd); best={n:nn,lab:fmtDow.format(d2).replace(".","")+" "+d2.getUTCDate()+" "+fmtMon.format(d2)}; } }
    stat.textContent=total?("Cette semaine : "+total+" rendez-vous de candidats dans "+villes.length+" lieu"+(villes.length>1?"x":"")+", répartis sur "+rows.length+" jour"+(rows.length>1?"s":"")+(best?". Le jour le plus chargé : "+best.lab+" ("+best.n+" rendez-vous)":"")+"."):"Aucun rendez-vous de candidat annoncé cette semaine pour l’instant.";
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
    renderMap(start);
    prev.disabled=offset<=0;
    next.disabled=addDays(today,(offset+1)*7)>last;
    var txt=data.note||"";
    if(data.maj){ try{ txt+=" Agenda actualisé le "+new Intl.DateTimeFormat("fr-FR",{day:"numeric",month:"long",hour:"2-digit",minute:"2-digit",timeZone:"Europe/Paris"}).format(new Date(data.maj))+"."; }catch(e){} }
    if(missing) txt+=" Pour les jours sans rendez-vous, l’agenda n’a pas encore été complété.";
    note.textContent=txt;
  }

  prev.addEventListener("click",function(){offset=Math.max(0,offset-1);render();});
  next.addEventListener("click",function(){offset+=1;render();});
  now.addEventListener("click",function(){offset=0;render();track.scrollLeft=0;});

  fetch("agenda.json",{cache:"no-cache"}).then(function(r){return r.json();}).then(function(j){data=j;render();})
  .catch(function(){ track.textContent=""; note.textContent="L’agenda de la semaine n’a pas pu être chargé. Réessayez dans quelques instants."; });
})();
