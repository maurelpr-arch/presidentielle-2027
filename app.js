/* Application du site : affichage, cartes, calculs. Les données sont dans donnees.js. */
(function(){
"use strict";
var $=function(s,el){return (el||document).querySelector(s)};
var esc=function(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;")};
var pct=function(v,t){return (v/t*100).toFixed(1).replace(".",",")};

/* ---------- Chronologie ---------- */

$("#keys").innerHTML=KEYS.map(function(k){return '<div class="key" style="--k:'+k[2]+'"><b>'+esc(k[0])+'</b><span>'+esc(k[1])+'</span></div>'}).join("");
$("#pre").innerHTML=PRE.map(function(c){return '<div class="chip"><b>'+esc(c[0])+'</b> <span>· '+esc(c[1])+'</span></div>'}).join("");
$("#legend").innerHTML=Object.keys(TAGS).map(function(k){return '<span><i style="background:'+TAGS[k][1]+'"></i>'+TAGS[k][0]+'</span>'}).join("");
$("#timeline").innerHTML=EVENTS.map(function(x){
  if(x.t==="m")return '<div class="month"><h3>'+esc(x.label)+'</h3><hr></div>';
  if(x.t==="today")return '<div class="today" id="aujourdhui"><hr><span>Aujourd’hui · '+new Date().toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric",timeZone:"Europe/Paris"})+'</span><hr></div>';
  var c=TAGS[x.k][1];
  return '<div class="ev'+(x.major?" major":"")+'" style="--c:'+c+'"><div class="d">'+esc(x.date)+'</div><div class="r"><span class="dot"></span><div class="box"><span class="tag">'+TAGS[x.k][0]+'</span>'+(x.re?'<span class="recheck">date à recouper</span>':"")+'<h4>'+esc(x.title)+'</h4><p>'+esc(x.detail)+'</p></div></div></div>';
}).join("");

/* ---------- Données des cartes ---------- */
var PRESIDENTS=[
 ["Charles de Gaulle","8 janvier 1959 → 28 avril 1969","10 ans","Élu en 1958 par un collège de grands électeurs, puis au suffrage universel en 1965. Il démissionne en 1969.",0],
 ["Alain Poher","28 avril → 20 juin 1969","Intérim","Président du Sénat, il assure l’intérim.",1],
 ["Georges Pompidou","20 juin 1969 → 2 avril 1974","près de 5 ans","Élu en 1969. Il meurt en cours de mandat.",0],
 ["Alain Poher","2 avril → 27 mai 1974","Intérim","Second intérim, après le décès de Georges Pompidou.",1],
 ["Valéry Giscard d’Estaing","27 mai 1974 → 21 mai 1981","7 ans","Élu en 1974, battu en 1981.",0],
 ["François Mitterrand","21 mai 1981 → 17 mai 1995","14 ans","Élu en 1981, réélu en 1988.",0],
 ["Jacques Chirac","17 mai 1995 → 16 mai 2007","12 ans","Élu en 1995 pour 7 ans, réélu en 2002 pour 5 ans.",0],
 ["Nicolas Sarkozy","16 mai 2007 → 15 mai 2012","5 ans","Élu en 2007.",0],
 ["François Hollande","15 mai 2012 → 14 mai 2017","5 ans","Élu en 2012.",0],
 ["Emmanuel Macron","14 mai 2017 → mai 2027","10 ans","Élu en 2017, réélu en 2022. Il ne peut pas se représenter.",0]
];
/* [PM, gouvernement, début, fin, membres] groupés par président */
var GOVS=[
 ["Charles de Gaulle · 1959–1969",[["Michel Debré","Debré","janv. 1959","avr. 1962",26],["Georges Pompidou","Pompidou I","avr. 1962","nov. 1962",28],["Georges Pompidou","Pompidou II","nov. 1962","janv. 1966",25],["Georges Pompidou","Pompidou III","janv. 1966","avr. 1967",27],["Georges Pompidou","Pompidou IV","avr. 1967","juil. 1968",28],["Maurice Couve de Murville","Couve de Murville","juil. 1968","juin 1969",30]]],
 ["Georges Pompidou · 1969–1974",[["Jacques Chaban-Delmas","Chaban-Delmas","juin 1969","juil. 1972",38],["Pierre Messmer","Messmer I","juil. 1972","avr. 1973",29],["Pierre Messmer","Messmer II","avr. 1973","févr. 1974",37],["Pierre Messmer","Messmer III","mars 1974","mai 1974",28]]],
 ["Valéry Giscard d’Estaing · 1974–1981",[["Jacques Chirac","Chirac I","mai 1974","août 1976",36],["Raymond Barre","Barre I","août 1976","mars 1977",33],["Raymond Barre","Barre II","mars 1977","avr. 1978",39],["Raymond Barre","Barre III","avr. 1978","mai 1981",37]]],
 ["François Mitterrand · 1981–1995",[["Pierre Mauroy","Mauroy I","mai 1981","juin 1981",42],["Pierre Mauroy","Mauroy II","juin 1981","mars 1983",47],["Pierre Mauroy","Mauroy III","mars 1983","juil. 1984",42],["Laurent Fabius","Fabius","juil. 1984","mars 1986",43],["Jacques Chirac","Chirac II (cohabitation)","mars 1986","mai 1988",46],["Michel Rocard","Rocard I","mai 1988","juin 1988",41],["Michel Rocard","Rocard II","juin 1988","mai 1991",52],["Édith Cresson","Cresson","mai 1991","avr. 1992",45],["Pierre Bérégovoy","Bérégovoy","avr. 1992","mars 1993",43],["Édouard Balladur","Balladur (cohabitation)","mars 1993","mai 1995",29]]],
 ["Jacques Chirac · 1995–2007",[["Alain Juppé","Juppé I","mai 1995","nov. 1995",41],["Alain Juppé","Juppé II","nov. 1995","juin 1997",32],["Lionel Jospin","Jospin (cohabitation)","juin 1997","mai 2002",26],["Jean-Pierre Raffarin","Raffarin I","mai 2002","juin 2002",27],["Jean-Pierre Raffarin","Raffarin II","juin 2002","mars 2004",38],["Jean-Pierre Raffarin","Raffarin III","mars 2004","mai 2005",43],["Dominique de Villepin","Villepin","mai 2005","mai 2007",31]]],
 ["Nicolas Sarkozy · 2007–2012",[["François Fillon","Fillon I","mai 2007","juin 2007",21],["François Fillon","Fillon II","juin 2007","nov. 2010",32],["François Fillon","Fillon III","nov. 2010","mai 2012",31]]],
 ["François Hollande · 2012–2017",[["Jean-Marc Ayrault","Ayrault I","mai 2012","juin 2012",35],["Jean-Marc Ayrault","Ayrault II","juin 2012","mars 2014",39],["Manuel Valls","Valls I","avr. 2014","août 2014",31],["Manuel Valls","Valls II","août 2014","déc. 2016",34],["Bernard Cazeneuve","Cazeneuve","déc. 2016","mai 2017",38]]],
 ["Emmanuel Macron · depuis 2017",[["Édouard Philippe","Philippe I","mai 2017","juin 2017",23],["Édouard Philippe","Philippe II","juin 2017","juil. 2020",29],["Jean Castex","Castex","juil. 2020","mai 2022",42],["Élisabeth Borne","Borne","mai 2022","janv. 2024",27],["Gabriel Attal","Attal","janv. 2024","sept. 2024",34],["Michel Barnier","Barnier","sept. 2024","déc. 2024",41],["François Bayrou","Bayrou","déc. 2024","sept. 2025",35],["Sébastien Lecornu","Lecornu I","5–6 oct. 2025","",18],["Sébastien Lecornu","Lecornu II (remanié le 26 fév. 2026)","oct. 2025","en cours",34]]]
];
var NVAC=ASSEMBLY.reduce(function(s,i){return i.name==="Sièges vacants"?s+i.v:s},0);
var NDEP=ASSEMBLY.reduce(function(s,i){return i.name==="Sièges vacants"?s:s+i.v},0);
var T1_2022=[["Emmanuel Macron",27.84],["Marine Le Pen",23.15],["Jean-Luc Mélenchon",21.95],["Éric Zemmour",7.07],["Valérie Pécresse",4.78],["Yannick Jadot",4.63],["Jean Lassalle",3.13],["Fabien Roussel",2.28],["Nicolas Dupont-Aignan",2.06],["Anne Hidalgo",1.75],["Philippe Poutou",0.77],["Nathalie Arthaud",0.56]];

/* ---------- Donut ---------- */
function donutHTML(items,aria,cTitle,cSub){
  var R=120,r=72,c=R,tot=items.reduce(function(s,i){return s+i.v},0),a=-Math.PI/2,paths="";
  function P(rad,ang){return [(c+rad*Math.cos(ang)).toFixed(2),(c+rad*Math.sin(ang)).toFixed(2)]}
  items.forEach(function(it,i){
    var da=it.v/tot*2*Math.PI,a1=a+da,lg=da>Math.PI?1:0,p0=P(R,a),p1=P(R,a1-0.0001),p2=P(r,a1-0.0001),p3=P(r,a);
    paths+='<path class="seg" data-i="'+i+'" d="M'+p0[0]+' '+p0[1]+'A'+R+' '+R+' 0 '+lg+' 1 '+p1[0]+' '+p1[1]+'L'+p2[0]+' '+p2[1]+'A'+r+' '+r+' 0 '+lg+' 0 '+p3[0]+' '+p3[1]+'Z" fill="'+it.color+'" stroke="#fff" stroke-width="2"><title>'+esc(it.name)+' : '+it.v+'</title></path>';
    a=a1;
  });
  return '<div class="donut" data-ct="'+esc(cTitle)+'" data-cs="'+esc(cSub)+'"><svg viewBox="0 0 '+(2*R)+' '+(2*R)+'" role="img" aria-label="'+esc(aria)+'">'+paths+'</svg><div class="dcenter"><b>'+esc(cTitle)+'</b><span>'+esc(cSub)+'</span></div></div>';
}
function wireDonut(root,items){
  var tot=items.reduce(function(s,i){return s+i.v},0),don=$(".donut",root),ct=$(".dcenter b",root),cs=$(".dcenter span",root);
  var segs=root.querySelectorAll(".seg"),lgs=root.querySelectorAll("[data-lg]"),lock=-1;
  function show(i){
    don.classList.add("hasfocus");
    segs.forEach(function(s,j){s.classList.toggle("on",j===i)});
    lgs.forEach(function(l){l.classList.toggle("on",+l.getAttribute("data-lg")===i)});
    ct.textContent=items[i].name;cs.textContent=items[i].v+" · "+pct(items[i].v,tot)+" %";
  }
  function reset(){
    if(lock>=0){show(lock);return}
    don.classList.remove("hasfocus");segs.forEach(function(s){s.classList.remove("on")});lgs.forEach(function(l){l.classList.remove("on")});
    ct.textContent=don.getAttribute("data-ct");cs.textContent=don.getAttribute("data-cs");
  }
  function bind(el,i){
    el.addEventListener("mouseenter",function(){show(i)});el.addEventListener("mouseleave",reset);
    el.addEventListener("focus",function(){show(i)});el.addEventListener("blur",reset);
    el.addEventListener("click",function(){lock=(lock===i?-1:i);if(lock<0)reset();else show(i)});
  }
  segs.forEach(function(s,i){bind(s,i)});
  lgs.forEach(function(l){bind(l,+l.getAttribute("data-lg"))});
}

/* ---------- Contenu des cartes ---------- */
function backPresidents(){
  return '<p class="note">Du premier président de la Ve République à aujourd’hui : 8 présidents et 2 intérims.</p>'+PRESIDENTS.map(function(p){
    return '<div class="row'+(p[4]?" interim":"")+'"><div style="flex:1;min-width:0"><div class="n">'+esc(p[0])+'</div><div class="m">'+esc(p[1])+'</div><div class="m">'+esc(p[3])+'</div></div><div class="m" style="white-space:nowrap">'+esc(p[2])+'</div></div>';
  }).join("");
}
function backGovs(){
  var out='<div class="stats"><div class="stat"><b>48</b>gouvernements</div><div class="stat"><b>Ve</b>depuis 1959</div><div class="stat"><b>Jospin</b>le plus long, près de 5 ans</div><div class="stat"><b>Lecornu I</b>le plus court, moins de 48 h</div></div>';
  GOVS.forEach(function(g){
    out+='<div class="gov-group">'+esc(g[0])+'</div>';
    g[1].forEach(function(r){
      out+='<div class="gov"><div><b>'+esc(r[0])+'</b><br><small>'+esc(r[1])+'</small></div><div><small>'+esc(r[2])+(r[3]?" → "+esc(r[3]):"")+'</small></div><div class="cnt"><b>'+r[4]+'</b><span class="bar"><i style="width:'+(r[4]/52*100).toFixed(0)+'%"></i></span></div></div>';
    });
  });
  out+='<p class="src" style="margin-top:12px">Nombre de membres : composition initiale (ministres, ministres délégués et secrétaires d’État), ordre de grandeur d’après Wikipédia et le gouvernement. Dates au mois près. Chaque remaniement majeur compte comme un nouveau gouvernement.</p>';
  return out;
}
function backAssembly(){
  var tot=ASSEMBLY.reduce(function(s,i){return s+i.v},0);
  var lg=ASSEMBLY.map(function(it,i){return '<button type="button" class="lg" data-lg="'+i+'" style="--c:'+it.color+'"><i></i><span>'+esc(it.name)+'<em>'+esc(it.full)+'</em></span><b>'+it.v+'</b><span class="p">'+pct(it.v,tot)+" %</span></button>"}).join("");
  return '<div class="dwrap" id="d-asm">'+donutHTML(ASSEMBLY,"Répartition des 577 sièges de l’Assemblée nationale par groupe","577 sièges","majorité absolue : 288")+'<div class="dlegend">'+lg+'</div></div><p class="note" style="margin-top:12px">Données du '+META.assemblyDate+' : '+NDEP+' députés en fonction, '+NVAC+' sièges vacants. Aucun groupe n’approche la majorité absolue, fixée à 288. Les groupes sont rangés de la gauche à la droite autour du cercle ; les non-inscrits et les sièges vacants font tampon entre l’extrême droite et la gauche radicale.</p><p class="src">Sources : Assemblée nationale, Parlementeur, Minute News.</p>';
}
function backCands(){
  var items=COURANTS.map(function(c){return {name:c.name,color:c.color,v:CANDS.filter(function(x){return x[2]===c.k}).length}});
  var tot=CANDS.length;
  var lg=items.map(function(it,i){return '<button type="button" class="lg" data-lg="'+i+'" style="--c:'+it.color+'"><i></i><span>'+esc(it.name)+'</span><b>'+it.v+'</b><span class="p">'+pct(it.v,tot)+" %</span></button>"}).join("");
  var groups=COURANTS.map(function(c){
    var l=CANDS.filter(function(x){return x[2]===c.k});
    return '<div class="cgroup"><h4 style="--c:'+c.color+'"><i></i>'+esc(c.name)+' <span>'+l.length+'</span></h4><div class="chips">'+l.map(function(x){return '<div class="chip"><b>'+esc(x[0])+'</b> <span>· '+esc(x[1])+'</span></div>'}).join("")+'</div></div>';
  }).join("");
  return '<div class="dwrap" id="d-cand">'+donutHTML(items,"Candidatures annoncées à la présidentielle 2027 par courant politique",CANDS.length+" candidatures","annoncées au "+META.candDate)+'<div class="dlegend">'+lg+'</div></div><p class="note" style="margin-top:12px">Les courants sont rangés de l’extrême gauche à l’extrême droite ; la part des candidats sans étiquette ou divers referme le cercle, pour que les deux extrêmes ne se touchent pas.</p>'+groups+'<p class="src" style="margin-top:12px">Liste : '+esc(META.candSource)+'. Classement indicatif établi à partir des étiquettes des partis.</p>';
  }
function backWhy(){
  return '<p>Le mandat d’Emmanuel Macron a commencé le 14 mai 2017. La Constitution (article 7) impose d’élire le successeur entre 20 et 35 jours avant la fin du mandat.</p><p>Il n’y avait donc que deux calendriers possibles : <b>11 et 25 avril</b>, ou <b>18 avril et 2 mai</b>. Le Conseil des ministres du 1er juillet 2026 a choisi le second.</p><ul><li>Le décret de convocation paraît au moins 10 semaines avant le premier tour, soit le 7 février 2027 au plus tard.</li><li>Le second tour a lieu deux semaines après le premier.</li><li>Le nouveau président prend ses fonctions le 13 ou 14 mai 2027.</li></ul><p class="src">Sources : Club des juristes, Service-Public, Maire info, Toute l’Europe.</p>';
}
function backParr(){
  return '<p>Pour figurer sur la liste officielle, un candidat doit réunir <b>500 parrainages</b> d’élus : maires, parlementaires, élus locaux.</p><ul><li>Un élu ne peut parrainer qu’un seul candidat, et son choix est irrévocable.</li><li>L’envoi se fait par courrier, avec une signature manuscrite, au Conseil constitutionnel.</li><li>Date limite : <b>12 mars 2027, 18 h</b>.</li><li>Les parrainages doivent venir d’au moins 30 départements ou collectivités d’outre-mer, sans que plus d’un dixième viennent du même département.</li><li>Le candidat remet aussi une déclaration de patrimoine et une déclaration d’intérêts.</li></ul><p>Le Conseil constitutionnel vérifie tout et publie la liste des candidats au Journal officiel, prévue le 16 mars 2027. En 2022, 12 candidats ont franchi ce filtre.</p><p class="src">Sources : Maire info, info.gouv.fr, LCP.</p>';
}
function backDiss(){
  return '<p>Les législatives ne sont <b>pas</b> au calendrier de 2027. L’Assemblée actuelle sort des élections des 30 juin et 7 juillet 2024, et son mandat court en principe jusqu’en 2029.</p><p>Auparavant, les législatives suivaient la présidentielle de quelques semaines (2002, 2007, 2012, 2017, 2022). Cette fois, seule une <b>dissolution</b> peut en provoquer.</p><ul><li>L’article 12 permet au président de dissoudre l’Assemblée après avoir consulté le Premier ministre et les présidents des deux assemblées.</li><li>Une nouvelle dissolution est possible depuis le 8 juillet 2025, un an après le second tour de 2024.</li><li>Macron l’a écartée avant la présidentielle le 24 septembre 2026.</li><li>Après une dissolution, les élections ont lieu 20 à 40 jours plus tard.</li></ul><p>Le nouveau président peut dissoudre dès sa prise de fonctions. Avec une dissolution le 15 mai 2027, le vote tomberait entre le 4 et le 25 juin, avec un premier tour possible les 6, 13 ou 20 juin.</p><p class="src">Sources : Public Sénat, Maire info, Vie-publique.</p>';
}
function backCoh(){
  return '<p>Il y a cohabitation quand le président et le Premier ministre viennent de camps opposés, parce que la majorité de l’Assemblée n’est pas celle du président.</p><div class="row"><div style="flex:1"><div class="n">1986 → 1988</div><div class="m">Président François Mitterrand, Premier ministre Jacques Chirac</div></div></div><div class="row"><div style="flex:1"><div class="n">1993 → 1995</div><div class="m">Président François Mitterrand, Premier ministre Édouard Balladur</div></div></div><div class="row"><div style="flex:1"><div class="n">1997 → 2002</div><div class="m">Président Jacques Chirac, Premier ministre Lionel Jospin</div></div></div><p style="margin-top:10px">Depuis l’adoption du quinquennat, la présidentielle précède de peu les législatives, ce qui a évité toute cohabitation. En 2027, ce lien est rompu : l’Assemblée est élue pour 2029 sauf dissolution.</p>';
}
function backRes(){
  var mx=30;
  var t1=T1_2022.map(function(r){return '<div class="hbar"><span>'+esc(r[0])+'</span><span class="bar"><i style="width:'+(r[1]/mx*100).toFixed(1)+'%"></i></span><b>'+String(r[1]).replace(".",",")+' %</b></div>'}).join("");
  return '<h4 style="margin-top:0">Premier tour, 10 avril 2022</h4>'+t1+'<h4>Second tour, 24 avril 2022</h4><div class="hbar"><span>Emmanuel Macron</span><span class="bar"><i style="width:'+(58.55/60*100)+'%"></i></span><b>58,55 %</b></div><div class="hbar"><span>Marine Le Pen</span><span class="bar"><i style="width:'+(41.45/60*100)+'%"></i></span><b>41,45 %</b></div><p class="note" style="margin-top:10px">Au second tour : 48 752 339 inscrits, abstention de 28,01 %, 2 233 904 bulletins blancs. Emmanuel Macron l’emporte avec 18 768 639 voix.</p><p class="src">Sources : info.gouv.fr (Conseil constitutionnel), LCP, Vie-publique. Les scores des autres candidats viennent du ministère de l’Intérieur.</p>';
}
function backHist(){
  return '<div class="row"><div class="n" style="width:56px">1958</div><div>La Constitution de la Ve République. Le président est élu par un collège d’environ 80 000 grands électeurs.</div></div><div class="row"><div class="n" style="width:56px">1962</div><div>Un référendum décide que le président sera élu au suffrage universel direct.</div></div><div class="row"><div class="n" style="width:56px">1965</div><div>Première présidentielle au suffrage universel : Charles de Gaulle l’emporte face à François Mitterrand au second tour.</div></div><div class="row"><div class="n" style="width:56px">2000</div><div>Un référendum ramène le mandat de 7 à 5 ans (le quinquennat).</div></div><div class="row"><div class="n" style="width:56px">2002</div><div>Première élection pour un mandat de 5 ans : Jacques Chirac est réélu.</div></div><div class="row"><div class="n" style="width:56px">2008</div><div>Une révision limite à deux le nombre de mandats consécutifs. C’est pourquoi Emmanuel Macron ne peut pas se représenter en 2027.</div></div>';
}

function backRep(){
  var dates=[["1946","La IVe République est marquée par l’instabilité des gouvernements et par la guerre d’Algérie."],["1er juin 1958","Charles de Gaulle revient au pouvoir. Un comité prépare une nouvelle Constitution."],["28 sept. 1958","Référendum : environ 85 % des suffrages exprimés approuvent le texte."],["4 oct. 1958","Promulgation de la Constitution. Elle fait 92 articles à l’origine."],["1959","De Gaulle devient le premier président de la Ve République."],["1961","Premier et seul recours à l’article 16 (pouvoirs exceptionnels)."],["1962","Référendum : le président sera élu au suffrage universel direct."],["1971","Le Conseil constitutionnel commence à protéger les libertés fondamentales."],["1974","60 députés ou sénateurs peuvent saisir le Conseil constitutionnel."],["1981","Première alternance : François Mitterrand, de gauche, est élu."],["1986","Première cohabitation."],["2000","Le mandat présidentiel passe de 7 à 5 ans."],["2008","Deux mandats consécutifs maximum ; le 49.3 est limité."],["2010","La question prioritaire de constitutionnalité (QPC) permet à un citoyen de contester une loi."],["2024","Dissolution d’Emmanuel Macron le 9 juin, législatives les 30 juin et 7 juillet."]];
  var arts=[["Art. 5","Le président veille au respect de la Constitution et assure, par son arbitrage, le fonctionnement régulier des pouvoirs publics."],["Art. 8","Il nomme le Premier ministre, puis les autres ministres sur sa proposition."],["Art. 12","Il peut dissoudre l’Assemblée nationale, après consultation du Premier ministre et des présidents des deux assemblées."],["Art. 16","Pouvoirs exceptionnels en cas de menace grave sur les institutions ou l’indépendance de la Nation."],["Art. 20","Le gouvernement détermine et conduit la politique de la Nation. Il est responsable devant le Parlement."],["Art. 49","Le gouvernement engage sa responsabilité devant l’Assemblée. L’alinéa 3 permet d’adopter un texte sans vote, sauf motion de censure."],["Art. 89","Procédure de révision de la Constitution."]];
  return '<p><b>La Ve République</b> est le régime politique de la France depuis 1958. Elle a été conçue pour donner à l’exécutif un pouvoir stable, après l’instabilité de la IVe République. Son texte fondateur est la Constitution du 4 octobre 1958.</p><div class="stats"><div class="stat"><b>108</b>articles aujourd’hui</div><div class="stat"><b>16</b>titres</div><div class="stat"><b>25</b>révisions depuis 1958</div></div><h4>Ce qu’il faut retenir</h4><ul><li><b>Un président fort</b> : arbitre, chef des armées, il nomme le Premier ministre et peut dissoudre l’Assemblée.</li><li><b>Un gouvernement responsable devant le Parlement</b> : l’Assemblée nationale peut le renverser par une motion de censure.</li><li><b>Un Parlement de deux chambres</b> : l’Assemblée nationale (577 députés) et le Sénat.</li><li><b>Un Conseil constitutionnel</b> qui vérifie que les lois respectent la Constitution et veille aux élections.</li><li><b>Un régime semi-présidentiel</b> : le président est élu directement par les citoyens depuis 1962, mais le gouvernement dépend de l’Assemblée. D’où les cohabitations.</li></ul><h4>Quelques articles clés</h4>'+arts.map(function(a){return '<div class="row"><div class="n" style="width:56px;flex:none">'+a[0]+'</div><div>'+esc(a[1])+'</div></div>'}).join("")+'<h4>Les grandes dates</h4>'+dates.map(function(a){return '<div class="row"><div class="n" style="width:104px;flex:none">'+a[0]+'</div><div>'+esc(a[1])+'</div></div>'}).join("")+'<p class="src" style="margin-top:12px">Sources : Vie-publique, Larousse, Légifrance, Élysée. Les dates postérieures à 1958 sont données de mémoire et sont à recouper.</p>';
}
function backVoter(){
  var conds=[["Être de nationalité française","Les citoyens européens résidant en France ne votent qu’aux municipales et aux européennes, pas à la présidentielle."],["Avoir 18 ans","Il faut être majeur au plus tard la veille du scrutin. Les jeunes qui atteignent 18 ans sont en principe inscrits d’office."],["Jouir de ses droits civils et politiques","Certaines condamnations pénales peuvent priver du droit de vote, sur décision d’un juge. Les majeurs sous tutelle peuvent voter."],["Être inscrit sur une liste électorale","En mairie, ou sur une liste consulaire si l’on vit à l’étranger. La date limite pour la présidentielle est le 12 mars 2027."]];
  return '<p>Le corps électoral est l’ensemble des personnes autorisées à voter. Pour la présidentielle, quatre conditions s’additionnent :</p>'+conds.map(function(c,i){return '<div class="cond"><div class="no">'+(i+1)+'</div><div><b>'+esc(c[0])+'</b><div class="m">'+esc(c[1])+'</div></div></div>'}).join("")+'<h4>Combien d’électeurs ?</h4><div class="stats"><div class="stat"><b>50,2 M</b>inscrits au 11 février 2026 (hors Nouvelle-Calédonie)</div><div class="stat"><b>1,7 M</b>inscrits sur une liste consulaire, à l’étranger</div><div class="stat"><b>95 %</b>des Français en âge de voter sont inscrits en métropole et outre-mer</div></div><div class="split"><i style="background:#0B3D91;flex:48.7"></i><i style="background:#0F6B63;flex:1.7"></i></div><div class="splitl"><span style="--c:#0B3D91">48,7 M sur les listes communales (municipales 2026)</span><span style="--c:#0F6B63">1,7 M sur les listes consulaires</span></div><p>Les 48,7 millions du premier chiffre incluent 358 000 Européens, qui ne voteront pas à la présidentielle. Pour 2027, le nombre d’inscrits sera arrêté à la clôture des listes en mars 2027. À titre de repère, ils étaient 48 752 339 pour la présidentielle de 2022.</p><h4>Comment la liste évolue</h4><p>Entre mai 2024 et février 2026, 5,7 millions d’inscriptions ou réinscriptions ont été enregistrées, dont 1,5 million de jeunes atteignant l’âge de voter, face à 4,8 millions de radiations, dont près d’un million pour décès. Résultat : environ 850 000 électeurs de plus.</p><p class="src">Sources : Insee (corps électoral 2026 et inscrits sur les listes électorales), info.gouv.fr, Service-Public.</p>';
}
function backFaq(){
  var q=[
   ["Avant de voter",[
    ["Ai-je besoin de ma carte d’électeur ?","<p>Non. La carte électorale n’est pas obligatoire pour voter. Il est seulement recommandé de la présenter, car cela facilite le travail du bureau.</p><p>En revanche, une pièce d’identité est à présenter : l’original, pas une photo ni une photocopie.</p>"],
    ["Quelles pièces d’identité sont acceptées ?","<p>Principalement la carte nationale d’identité et le passeport. La liste complète, avec les cas de documents récemment périmés, figure sur Service-Public.</p>"],
    ["Où suis-je inscrit ? Quel est mon bureau de vote ?","<p>Utilisez le téléservice « Interroger sa situation électorale » sur service-public.gouv.fr. Il donne votre commune, l’adresse de votre bureau et votre numéro national d’électeur. Pensez à saisir tous vos prénoms, dans l’ordre de l’état civil.</p>"],
    ["Où trouver mon numéro d’électeur ?","<p>Sur votre carte électorale, ou sur le même téléservice. Il sert surtout à établir une procuration.</p>"],
    ["J’ai perdu ma carte ou je ne l’ai jamais reçue.","<p>Ce n’est pas grave. Vous pouvez voter avec votre seule pièce d’identité. Si votre carte n’a pas été distribuée, elle est conservée au bureau de vote et vous pouvez la récupérer le jour du scrutin. Vous pouvez aussi télécharger une attestation d’inscription sur le téléservice.</p>"]
   ]],
   ["S’inscrire",[
    ["Comment et jusqu’à quand s’inscrire ?","<p>En ligne sur service-public.gouv.fr, ou en mairie, avec une pièce d’identité et un justificatif de domicile de moins de 3 mois. L’inscription est gratuite. Pour la présidentielle, la date limite est le <b>vendredi 12 mars 2027</b>.</p>"],
    ["Je suis inscrit d’office, dois-je vérifier ?","<p>Oui, c’est conseillé. Les jeunes de 18 ans sont en principe inscrits automatiquement, mais une vérification en ligne évite les mauvaises surprises.</p>"],
    ["J’ai déménagé, que faire ?","<p>Il faut demander votre inscription dans votre nouvelle commune. Vous pouvez le faire en ligne, quelle que soit la commune de France.</p>"],
    ["Je vis à l’étranger.","<p>Vous pouvez vous inscrire sur une liste consulaire, ou sur la liste d’une commune française. Vous pouvez voter à l’ambassade ou au consulat, ou donner procuration à un électeur inscrit sur la même liste consulaire.</p>"]
   ]],
   ["Si je ne peux pas voter le jour J",[
    ["Comment voter par procuration ?","<p>Vous confiez votre vote à un électeur inscrit en France, le mandataire. Trois voies :</p><ul><li>100 % en ligne sur maprocuration.gouv.fr, si vous avez une identité numérique certifiée France Identité ;</li><li>en ligne, puis validation dans un commissariat, une gendarmerie ou un consulat ;</li><li>avec le formulaire papier Cerfa n° 14943*03.</li></ul><p>Aucun justificatif d’absence n’est demandé. Une procuration peut être établie jusqu’à la veille du vote, mais mieux vaut s’y prendre à l’avance.</p>"],
    ["Que doit faire la personne qui vote à ma place ?","<p>Rien avant le scrutin. Le jour du vote, elle se présente avec sa propre pièce d’identité, sans votre carte électorale ni aucun document vous concernant. Vous recevez un courriel quand la procuration est validée.</p>"],
    ["Peut-on voter dans un autre bureau, ou par correspondance ?","<p>Il n’existe pas de dérogation de bureau : on vote dans le bureau où l’on est inscrit. Si l’on ne peut pas s’y rendre, la procuration est la solution. Le vote par internet ou par courrier n’existe pas pour la présidentielle en France.</p>"],
    ["Comment annuler ou vérifier une procuration ?","<p>Vous pouvez la résilier en ligne, puis faire valider cette résiliation devant une autorité habilitée. Le téléservice « Interroger sa situation électorale » liste les procurations données et reçues.</p>"]
   ]],
   ["Le jour du scrutin",[
    ["Quand et à quelle heure vote-t-on ?","<p>Les dimanches 18 avril et 2 mai 2027. Les bureaux ouvrent à 8 h et ferment à 19 h, parfois à 20 h dans les grandes villes sur décision du préfet. En outre-mer et pour les Français de l’étranger, certains scrutins ont lieu le samedi.</p>"],
    ["Que devient un vote blanc ?","<p>Il est compté à part, mais ne compte pas dans les suffrages exprimés. Au second tour de 2022, il y a eu 2 233 904 bulletins blancs.</p>"]
   ]]
  ];
  return '<div class="faq">'+q.map(function(g){return '<div class="grp">'+esc(g[0])+'</div>'+g[1].map(function(x){return '<details><summary>'+esc(x[0])+'</summary><div class="ans">'+x[1]+'</div></details>'}).join("")}).join("")+'</div><p class="src" style="margin-top:12px">Sources : info.gouv.fr (« Comment voter à la présidentielle 2027 ? »), Service-Public, Justice.fr, ministère de l’Intérieur, Insee. Vérifiez toujours les démarches sur service-public.gouv.fr avant le scrutin.</p>';
}

function backRef(){
  var R=[
   ["28 sept. 1958","Adopter la Constitution de la Ve République",85.1,"oui","Non compté dans les neuf référendums, car il fonde le régime."],
   ["8 janv. 1961","Autodétermination de l’Algérie",75,"oui","Le peuple approuve le principe de laisser les Algériens décider de leur avenir."],
   ["8 avr. 1962","Accords d’Évian, fin de la guerre d’Algérie",90.8,"oui","Ils ouvrent la voie à l’indépendance de l’Algérie."],
   ["28 oct. 1962","Élection du président au suffrage universel direct",62.2,"oui","Le président devient l’élu de tous les citoyens."],
   ["27 avr. 1969","Régionalisation et réforme du Sénat",47.6,"non","Les « non » l’emportent avec 52,41 %. De Gaulle démissionne."],
   ["23 avr. 1972","Élargissement de la Communauté européenne",67.7,"oui","Entrée du Royaume-Uni, de l’Irlande, du Danemark et de la Norvège."],
   ["6 nov. 1988","Statut de la Nouvelle-Calédonie",80,"oui","Accords de Matignon. Participation de seulement 26 %."],
   ["20 sept. 1992","Traité de Maastricht (Union européenne)",51,"oui","Résultat très serré."],
   ["24 sept. 2000","Mandat présidentiel ramené à cinq ans",73.2,"oui","Le quinquennat remplace le septennat."],
   ["29 mai 2005","Traité établissant une Constitution pour l’Europe",45.3,"non","La France rejette le traité, avec une participation de 69,37 %."]
  ];
  var rows=R.map(function(r){
    var yes=r[3]==="oui",c=yes?"#0F6B63":"#B3141F";
    var big=yes?r[2]:100-r[2];
    return '<div class="ref" style="--c:'+c+'"><div class="top"><b>'+esc(r[0])+'</b><span class="res '+(yes?"yes":"no")+'">'+(yes?"Oui ":"Non ")+String(big.toFixed(1)).replace(".",",")+' %</span></div><div class="subj">'+esc(r[1])+'</div><div class="meter" role="img" aria-label="'+(yes?"Oui ":"Non ")+big.toFixed(1)+' pour cent des suffrages exprimés"><i style="width:'+r[2]+'%"></i><u></u></div><div class="why">'+esc(r[4])+'</div></div>';
  }).join("");
  return '<p>Un <b>référendum</b> demande directement aux citoyens de répondre par oui ou non à une question ou à un texte de loi. Sous la Ve République, le résultat a en général une portée décisionnelle.</p><div class="stats"><div class="stat"><b>9</b>référendums nationaux depuis 1958</div><div class="stat"><b>7</b>« oui »</div><div class="stat"><b>2</b>« non » (1969 et 2005)</div></div><h4>Les trois voies prévues par la Constitution</h4><ul><li><b>Article 11</b> : le référendum législatif, sur un projet de loi, à l’initiative du président, sur proposition du gouvernement ou des deux assemblées.</li><li><b>Article 89</b> : le référendum constituant, pour réviser la Constitution.</li><li><b>Article 72</b> : le référendum local, dans les collectivités.</li></ul><p>Depuis 2008, un <b>référendum d’initiative partagée</b> (RIP) peut être lancé par un cinquième des parlementaires, soutenu par un dixième des électeurs inscrits. Il se distingue d’un référendum d’initiative citoyenne.</p><h4>Les référendums, du plus ancien au plus récent</h4><p class="note">La barre verticale marque 50 %. La barre colorée montre la part des « oui ».</p>'+rows+'<p class="note" style="margin-top:12px">Le rejet du traité de 2005 n’a entraîné la démission ni du gouvernement ni du président. Le dernier référendum national date donc de 2005.</p><p class="src">Sources : Vie-publique, Sénat, Larousse, Slate. Les scores de 1992, 2000 et 2005 sont à recouper avec le tableau du Conseil constitutionnel ; les autres sont arrondis.</p>';
}

function back493(){
  var T=[["Michel Rocard",28,"1988–1991, gouvernement minoritaire"],["Élisabeth Borne",11,"au 17 mars 2023, d’autres recours ont suivi"],["Jacques Chirac",8,"1986–1988"],["Raymond Barre",8,"1976–1981"],["Manuel Valls",6,"2014–2016"],["Sébastien Lecornu",3,"budget 2026, janvier 2026"]];
  var bars=T.map(function(t){return '<div class="hbar"><span>'+esc(t[0])+'</span><span class="bar" title="'+esc(t[2])+'"><i style="width:'+(t[1]/28*100).toFixed(1)+'%"></i></span><b>'+t[1]+(t[0]==="Élisabeth Borne"?"+":"")+'</b></div>'}).join("");
  return '<p>Le <b>49.3</b> désigne l’alinéa 3 de l’article 49 de la Constitution. Il permet au Premier ministre de faire adopter un texte <b>sans vote</b> de l’Assemblée nationale, en engageant la responsabilité de son gouvernement.</p><div class="stats"><div class="stat"><b>100+</b>recours depuis 1958</div><div class="stat"><b>28</b>record : Michel Rocard, 1988–1991</div><div class="stat"><b>1</b>seul gouvernement renversé après un 49.3 : Barnier, 2024</div></div><h4>Comment ça marche</h4><ol><li>Le Conseil des ministres délibère, puis le Premier ministre engage la responsabilité du gouvernement sur un texte, devant l’Assemblée nationale. Le Sénat ne peut pas renverser le gouvernement, donc l’article ne s’y applique pas.</li><li>Le texte est considéré comme adopté, sans vote, <b>sauf</b> si une motion de censure est déposée et votée.</li><li>Une motion de censure doit réunir la majorité absolue des députés : 289 voix en février 2026. Seuls les députés favorables à la censure votent. Les abstentions comptent pour le gouvernement.</li><li>Si la motion est adoptée, le texte est rejeté et le Premier ministre doit remettre la démission de son gouvernement au président.</li></ol><p>Depuis la révision de 2008, le 49.3 est limité aux lois de finances et de financement de la sécurité sociale, plus un autre texte par session.</p><h4>Les plus gros utilisateurs</h4>'+bars+'<p class="note">Au total, le 100e recours date de mars 2023 (réforme des retraites, Élisabeth Borne).</p><h4>Deux moments à retenir</h4><div class="row"><div class="n" style="width:104px;flex:none">4 oct. 1962</div><div>Le gouvernement de Georges Pompidou est renversé par une motion de censure déposée spontanément par les députés. Ce n’était pas un 49.3.</div></div><div class="row"><div class="n" style="width:104px;flex:none">2–4 déc. 2024</div><div>Michel Barnier engage le 49.3 sur le budget de la Sécurité sociale. La motion du Nouveau Front populaire est adoptée par 331 voix : c’est la première censure après un 49.3 sous la Ve République.</div></div><div class="row"><div class="n" style="width:104px;flex:none">Janv. 2026</div><div>Sébastien Lecornu utilise trois fois le 49.3 sur le budget 2026 (20, 23 et 30 janvier). Les motions de censure échouent : celle de la gauche hors PS recueille 260 voix sur 289 nécessaires. Le budget est adopté le 2 février.</div></div><p class="src" style="margin-top:12px">Sources : Vie-publique, Assemblée nationale, Public Sénat, LCP, Le Temps, Europe 1, Statista. Le nombre exact de recours et le détail de la limite de 2008 sont à recouper.</p>';
}

function qaHTML(intro,items,src){
  return (intro?'<p>'+intro+'</p>':'')+'<div class="faq">'+items.map(function(x){return '<details><summary>'+esc(x[0])+'</summary><div class="ans">'+x[1]+'</div></details>'}).join("")+'</div><p class="src" style="margin-top:12px">'+src+'</p>';
}
function backCC(){
  return qaHTML("Le Conseil constitutionnel est surnommé « les Sages ». Il joue un rôle clé avant, pendant et après la présidentielle.",[
   ["C’est quoi, à quoi ça sert ?","<p>C’est le gardien de la Constitution : il vérifie que les lois votées la respectent. Il est aussi le juge des grandes élections : présidentielle, référendum, législatives et sénatoriales.</p>"],
   ["Qui y siège ?","<p>Neuf membres, nommés pour neuf ans, sans renouvellement possible : trois par le président de la République, trois par le président du Sénat, trois par le président de l’Assemblée nationale. Le Conseil se renouvelle par tiers tous les trois ans.</p><p>S’y ajoutent les anciens présidents de la République, membres de droit à vie, s’ils souhaitent siéger.</p>"],
   ["Qui le préside aujourd’hui ?","<p>Richard Ferrand, nommé par Emmanuel Macron et en fonction depuis le 8 mars 2025. Il a succédé à Laurent Fabius. Sa nomination a été validée par le Parlement à une voix près, et elle a été critiquée. En cas d’égalité des voix, c’est le président qui tranche.</p>"],
   ["Qui peut saisir le Conseil ?","<p>Le président de la République, le Premier ministre, les présidents de l’Assemblée et du Sénat, ou soixante députés ou sénateurs. Depuis 2010, un citoyen peut aussi soulever une question prioritaire de constitutionnalité devant un tribunal.</p>"],
   ["Que fait-il pendant la présidentielle ?","<p>Il reçoit et contrôle les 500 parrainages, publie la liste officielle des candidats, veille à la régularité du scrutin et proclame le résultat. C’est lui qui proclame le président élu.</p>"],
   ["Les Sages sont-ils indépendants ?","<p>Le mandat unique de neuf ans et le renouvellement par tiers doivent garantir l’indépendance. Les membres sont tenus au secret des délibérations. Mais plusieurs membres ont un passé politique, et cela nourrit régulièrement des critiques.</p>"]
  ],"Sources : Vie-publique, info.gouv.fr, LCP, Slate, Public Sénat. L’égalité des voix et la QPC sont données de mémoire et à recouper.");
}
function backMotion(){
  return qaHTML("La motion de censure est l’arme des députés pour essayer de faire tomber le gouvernement.",[
   ["C’est quoi une motion de censure ?","<p>Un texte déposé à l’Assemblée nationale par des députés, qui, s’il est adopté, oblige le gouvernement à démissionner. Elle ne peut être déposée que pendant une session parlementaire.</p>"],
   ["Quels sont les deux types ?","<ul><li>La motion <b>spontanée</b> (article 49, alinéa 2), à l’initiative des députés, pour exprimer leur désaccord avec la politique du gouvernement.</li><li>La motion <b>provoquée</b> (article 49, alinéa 3), déposée en réaction à un 49.3.</li></ul>"],
   ["Combien de signatures faut-il ?","<p>Un dixième des députés, soit 58. Pour la motion spontanée, un député ne peut en signer qu’une par session ordinaire, si elle est rejetée. Pour les motions provoquées par un 49.3, il n’y a pas de limite.</p>"],
   ["Quelle majorité faut-il pour la voter ?","<p>La majorité absolue des membres de l’Assemblée, soit <b>289 voix sur 577</b> quand tous les sièges sont pourvus. Seuls les députés favorables à la censure votent. Les abstentions et les absents sont donc comptés comme soutenant le gouvernement.</p>"],
   ["Quand a lieu le vote ?","<p>Environ 48 heures après le dépôt. Après un 49.3, les motions doivent être déposées dans les 24 heures.</p>"],
   ["Que se passe-t-il si elle est adoptée ?","<p>Le Premier ministre remet la démission de son gouvernement au président de la République (article 50). Le président nomme ensuite un nouveau Premier ministre.</p>"],
   ["Combien de gouvernements ont été renversés ?","<p>Deux. Plus de 100 motions ont été déposées depuis 1958 (chiffre de 2018), mais une seule avait été adoptée jusqu’en 2024 : le 4 octobre 1962 contre Georges Pompidou, par 280 voix. Le général de Gaulle avait alors dissous l’Assemblée.</p><p>Le 4 décembre 2024, 331 députés ont censuré le gouvernement de Michel Barnier, une première après un 49.3.</p>"],
   ["Et sous Sébastien Lecornu ?","<p>Plusieurs motions ont été déposées, notamment après les 49.3 sur le budget 2026. Aucune n’a obtenu la majorité absolue : celle de la gauche hors PS a recueilli 260 voix sur 289 nécessaires.</p>"]
  ],"Sources : Vie-publique, Sénat, Public Sénat, LCP, Le Temps, Universalis. Le nombre de signataires par session est à recouper.");
}
function backPres(){
  return qaHTML("Le président est au sommet des institutions de la Ve République, mais il ne fait pas tout.",[
   ["Quel est son rôle ?","<p>Il est chef de l’État et chef des armées. Il veille au respect de la Constitution, assure par son arbitrage le fonctionnement régulier des pouvoirs publics, et il est garant de l’indépendance nationale et de l’intégrité du territoire.</p>"],
   ["Quels sont ses pouvoirs propres ?","<p>Ceux qu’il exerce seul, sans signature d’un ministre : nommer le Premier ministre, dissoudre l’Assemblée nationale, saisir le Conseil constitutionnel, recourir à l’article 16 en cas de crise grave, ou proposer un référendum.</p><p>Les autres décisions doivent être contresignées par le Premier ministre et, le cas échéant, par les ministres concernés.</p>"],
   ["Qu’est-ce que le « domaine réservé » ?","<p>L’usage veut depuis 1959 que le président conduise la défense et la diplomatie. C’est lui qui décide d’une éventuelle frappe nucléaire.</p>"],
   ["Qui gouverne, le président ou le Premier ministre ?","<p>Les deux, en théorie : le gouvernement détermine et conduit la politique de la Nation. En pratique, le président domine quand il dispose d’une majorité à l’Assemblée. Sinon, notamment en cohabitation, son rôle est amoindri et le Premier ministre peut s’opposer à lui, par exemple sur des opérations militaires.</p>"],
   ["Peut-il faire ou refuser une loi ?","<p>Il ne vote pas la loi, c’est le Parlement qui la vote. Il la promulgue ensuite, et il peut demander au Parlement un nouvel examen.</p>"],
   ["Peut-il gracier ?","<p>Oui, c’est le droit de grâce, mais depuis 2008 uniquement à titre individuel, plus de grâce collective.</p>"],
   ["Combien de temps dure son mandat ?","<p>Cinq ans, par élection au suffrage universel direct, et deux mandats consécutifs au maximum.</p>"],
   ["Peut-on le destituer ?","<p>Oui, par le Parlement réuni en Haute Cour, en cas de manquement à ses devoirs manifestement incompatible avec l’exercice de son mandat. La procédure n’a jamais abouti.</p>"]
  ],"Sources : Vie-publique, Élysée, Public Sénat. La destitution et la promulgation sont données de mémoire et à recouper.");
}
function backLoi(){
  return qaHTML("Les lois sont votées par le Parlement, qui compte deux chambres : l’Assemblée nationale et le Sénat.",[
   ["Qui vote les lois ?","<p>Les 577 députés de l’Assemblée nationale, élus directement par les citoyens, et les 348 sénateurs, élus indirectement. Les deux chambres doivent s’accorder sur un même texte.</p>"],
   ["Qui propose une loi ?","<p>Le gouvernement, avec un projet de loi, ou les parlementaires, avec une proposition de loi.</p>"],
   ["Comment un texte circule-t-il ?","<p>Il est examiné en commission puis en séance, dans une chambre, puis dans l’autre. Ces allers-retours s’appellent la <b>navette parlementaire</b>. En cas de désaccord persistant, une commission mixte paritaire de députés et de sénateurs cherche un texte commun.</p>"],
   ["Qui a le dernier mot ?","<p>L’Assemblée nationale, en cas de désaccord au terme de la navette. Le gouvernement peut aussi, au bout du compte, engager sa responsabilité avec le 49.3.</p>"],
   ["Comment élit-on les sénateurs ?","<p>Pas directement. Ils sont élus pour six ans par environ 162 000 grands électeurs, dont 95 % de délégués de conseillers municipaux. Le vote est obligatoire pour ces grands électeurs. Il faut avoir au moins 24 ans pour être candidat.</p>"],
   ["Quand le Sénat est-il renouvelé ?","<p>Par moitié tous les trois ans. Le 27 septembre 2026, 178 sièges sur 348 étaient à pourvoir.</p>"],
   ["Une loi votée est-elle forcément appliquée ?","<p>Non : avant sa promulgation, soixante députés ou soixante sénateurs peuvent saisir le Conseil constitutionnel, qui peut censurer tout ou partie du texte.</p>"]
  ],"Sources : Vie-publique, Sénat, Public Sénat, info.gouv.fr. Le détail de la commission mixte paritaire est à recouper.");
}
function backElection(){
  return qaHTML("Les questions que l’on se pose avant de choisir un président.",[
   ["Comment le président est-il élu ?","<p>Au suffrage universel direct, pour cinq ans, en deux tours. Un candidat élu dès le premier tour doit avoir la majorité absolue des suffrages exprimés. Sinon, les deux candidats arrivés en tête s’affrontent deux semaines plus tard.</p>"],
   ["Pourquoi deux tours ?","<p>Pour que le président soit élu avec plus de la moitié des voix exprimées. Le premier tour sert à choisir parmi de nombreux candidats, le second à trancher entre deux.</p>"],
   ["Combien de fois peut-on être élu ?","<p>Deux fois de suite au maximum depuis la révision de 2008. C’est pourquoi Emmanuel Macron ne peut pas se représenter en 2027.</p>"],
   ["Qui peut être candidat ?","<p>Il faut être de nationalité française, majeur, inscrit sur les listes électorales, réunir 500 parrainages d’élus et déposer des déclarations de patrimoine et d’intérêts. Le Conseil constitutionnel contrôle le dossier.</p>"],
   ["Qui proclame le résultat ?","<p>Le Conseil constitutionnel, qui proclame élu le chef de l’État.</p>"],
   ["Que se passe-t-il si le président meurt ou démissionne ?","<p>Le président du Sénat assure l’intérim, comme en 1969 et en 1974. Une élection doit avoir lieu entre 20 et 35 jours après la constatation de la vacance.</p>"],
   ["Quand le nouveau président prend-il ses fonctions ?","<p>À la fin du mandat de son prédécesseur : les 13 ou 14 mai 2027. Il peut ensuite nommer un Premier ministre et dissoudre l’Assemblée s’il le souhaite.</p>"]
  ],"Sources : Vie-publique, info.gouv.fr, Service-Public. Les conditions de candidature sont à recouper sur la page officielle du Conseil constitutionnel.");
}

var FLIPS=[
 {id:"republique",fig:"1958",figl:"naissance de la Ve République",title:"La Ve République, c’était quoi ?",teaser:"La Constitution en bref, ses articles clés et ses grandes dates.",accent:"#13203B",back:backRep},
 {id:"electeurs",fig:"50 M",figl:"électeurs inscrits",title:"Qui peut voter en France ?",teaser:"Les 4 conditions, et combien de personnes cela représente.",accent:"#0F6B63",back:backVoter},
 {id:"faq",fig:"15",figl:"questions d’électeur",title:"FAQ : voter, concrètement",teaser:"Carte, inscription, procuration, bureau de vote, vote blanc.",accent:"#B3141F",back:backFaq},
 {id:"referendums",fig:"9",figl:"référendums depuis 1958",title:"Les référendums",teaser:"Ce que c’est, et les neuf scrutins : sujets et résultats.",accent:"#7A5C00",back:backRef},
 {id:"493",fig:"49.3",figl:"adopter une loi sans vote",title:"Le 49.3, c’est quoi ?",teaser:"Comment fonctionne l’article, qui l’a utilisé, et la censure de 2024.",accent:"#B3141F",back:back493},
 {id:"cc",fig:"9",figl:"Sages",title:"Le Conseil constitutionnel",teaser:"Qui y siège, ce qu’il contrôle et son rôle pendant la présidentielle.",accent:"#13203B",back:backCC},
 {id:"motion",fig:"289",figl:"voix pour censurer",title:"La motion de censure",teaser:"Comment les députés peuvent renverser le gouvernement.",accent:"#B3141F",back:backMotion},
 {id:"president",fig:"5 ans",figl:"mandat présidentiel",title:"Que peut faire le président ?",teaser:"Pouvoirs propres, pouvoirs partagés, et ce qu’il ne peut pas faire.",accent:"#0B3D91",back:backPres},
 {id:"loi",fig:"577 + 348",figl:"députés et sénateurs",title:"Comment une loi est votée",teaser:"Assemblée, Sénat, navette et dernier mot.",accent:"#5B3F8C",back:backLoi},
 {id:"election",fig:"2 tours",figl:"pour élire le président",title:"Comment on élit le président",teaser:"Tours, candidats, proclamation, intérim.",accent:"#0F6B63",back:backElection},
 {id:"presidents",fig:"8",figl:"présidents + 2 intérims",title:"Les présidents de la Ve République",teaser:"De Gaulle à Macron : qui, quand, pour combien de temps.",accent:"#0B3D91",back:backPresidents},
 {id:"gouvernements",fig:"48",figl:"gouvernements",title:"Les gouvernements",teaser:"Premier ministre, dates et nombre de membres, depuis 1959.",accent:"#5B3F8C",back:backGovs},
 {id:"assemblee",fig:String(NDEP),figl:"députés en fonction",title:"L’Assemblée nationale aujourd’hui",teaser:"11 groupes, aucune majorité : la composition en un cercle.",accent:"#D9381E",back:backAssembly,wire:["#d-asm",ASSEMBLY]},
 {id:"candidats",fig:String(CANDS.length),figl:"candidatures annoncées",title:"Les courants politiques des candidats",teaser:"Du plus à gauche au plus à droite, avec tous les noms.",accent:"#2F6FD0",back:backCands,wire:["#d-cand",null]},
 {id:"dates",fig:"18 avril",figl:"puis 2 mai",title:"Pourquoi ces deux dates ?",teaser:"La règle des 20 à 35 jours avant la fin du mandat.",accent:"#9B1C1C",back:backWhy},
 {id:"parrainages",fig:"500",figl:"parrainages d’élus",title:"Être candidat : les parrainages",teaser:"Qui signe, comment, et jusqu’à quand.",accent:"#0F6B63",back:backParr},
 {id:"legislatives",fig:"Aucune",figl:"législative programmée",title:"Dissolution et législatives",teaser:"Pourquoi il n’y en a pas en 2027, et quand il pourrait y en avoir.",accent:"#7A5C00",back:backDiss},
 {id:"cohabitations",fig:"3",figl:"cohabitations",title:"Les cohabitations",teaser:"Quand le président et son Premier ministre sont adversaires.",accent:"#5B3F8C",back:backCoh},
 {id:"2022",fig:"58,55 %",figl:"Macron au second tour 2022",title:"Les résultats de 2022",teaser:"Les 12 candidats du premier tour et le duel final.",accent:"#13203B",back:backRes},
 {id:"histoire",fig:"1962",figl:"suffrage universel",title:"Petite histoire de l’élection",teaser:"De 1958 au quinquennat : comment on élit le président.",accent:"#A4401F",back:backHist}
];

/* ---------- Création des cartes ---------- */
var grid=$("#flips"),cards=[];
FLIPS.forEach(function(f){
  var el=document.createElement("article");el.className="flip";el.id="flip-"+f.id;el.style.setProperty("--a",f.accent);
  el.innerHTML='<div class="flip-inner"><div class="face front"><button type="button" class="front-btn" aria-expanded="false" aria-controls="back-'+f.id+'"><span class="fig">'+esc(f.fig)+'</span><span class="figl">'+esc(f.figl)+'</span><span class="ft">'+esc(f.title)+'</span><span class="fteaser">'+esc(f.teaser)+'</span><span class="fhint">Retourner la carte</span></button></div><div class="face back" id="back-'+f.id+'" role="region" aria-label="'+esc(f.title)+'"><div class="bh"><h3>'+esc(f.title)+'</h3><button type="button" class="close">Retour</button></div><div class="bb">'+f.back()+'</div></div></div>';
  grid.appendChild(el);
  var front=el.querySelector(".front"),back=el.querySelector(".back"),fb=el.querySelector(".front-btn"),cl=el.querySelector(".close");
  back.inert=true;back.setAttribute("aria-hidden","true");
  if(f.wire){
    var root=el.querySelector(f.wire[0]);
    var items=f.wire[1]||COURANTS.map(function(c){return {name:c.name,color:c.color,v:CANDS.filter(function(x){return x[2]===c.k}).length}});
    wireDonut(root,items);
  }
  var obj={el:el,front:front,back:back,fb:fb,cl:cl};cards.push(obj);
  fb.addEventListener("click",function(){flip(obj,true)});
  cl.addEventListener("click",function(){flip(obj,false)});
});
function flip(o,open){
  if(open)cards.forEach(function(c){if(c!==o&&c.el.classList.contains("is-flipped"))flip(c,false,true)});
  o.el.classList.toggle("is-flipped",open);
  o.fb.setAttribute("aria-expanded",open?"true":"false");
  o.front.inert=open;o.back.inert=!open;
  o.front.setAttribute("aria-hidden",open?"true":"false");o.back.setAttribute("aria-hidden",open?"false":"true");
  if(arguments[2])return;
  setTimeout(function(){
    if(open){try{o.el.scrollIntoView({block:"nearest",behavior:"smooth"})}catch(e){}o.cl.focus({preventScroll:true})}
    else{o.fb.focus({preventScroll:true})}
  },open?320:80);
}
document.addEventListener("keydown",function(e){
  if(e.key==="Escape"){cards.forEach(function(c){if(c.el.classList.contains("is-flipped"))flip(c,false)})}
});

/* ---------- Sources ---------- */
$("#sources").innerHTML='<span>Sources :</span>'+SRC.map(function(s){return '<a href="'+s[1]+'" target="_blank" rel="noopener">'+esc(s[0])+'</a>'}).join("");

/* ---------- Bandeau de mise à jour (lit maj.json, mis à jour chaque matin) ---------- */
fetch("maj.json",{cache:"no-store"}).then(function(r){return r.ok?r.json():null}).then(function(m){
  if(!m||!m.date)return;
  var d=new Date(m.date);if(isNaN(d))return;
  var t=$("#maj");
  t.setAttribute("datetime",m.date);
  t.textContent=d.toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long",year:"numeric",timeZone:"Europe/Paris"})+", "+d.toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit",timeZone:"Europe/Paris"}).replace(":"," h ");
  if(m.changes&&m.changes.length){$("#changes").innerHTML=m.changes.length===1?esc(m.changes[0]):"<ul>"+m.changes.map(function(c){return "<li>"+esc(c)+"</li>"}).join("")+"</ul>"}
}).catch(function(){});
})();
