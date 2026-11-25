/* Données qui changent : chronologie, dates clés, candidats, Assemblée, sources.
   Fichier modifié par la mise à jour quotidienne. Le reste du site est dans app.js. */
var META={
  assemblyDate:"25 novembre 2026",
  candDate:"22 novembre",
  candSource:"Poligraph au 22 novembre 2026 (franceinfo en compte 38 au 24 novembre)"
};
var TAGS={cand:["Candidature","#A4401F"],inst:["Institutionnel","#0B3D91"],parti:["Primaire / parti","#5B3F8C"],parr:["Parrainages","#0F6B63"],scrutin:["Scrutin","#9B1C1C"],leg:["Dissolution / législatives","#7A5C00"]};
var M=function(l){return {t:"m",label:l}};
var E=function(date,k,title,detail,o){return {t:"e",date:date,k:k,title:title,detail:detail,major:!!(o&&o.major),re:!!(o&&o.re)}};
var EVENTS=[
M("Septembre 2026"),
E("6 sept.","cand","Fabien Roussel (PCF)","Sa candidature est validée par le Parti communiste français.",{re:1}),
E("17 sept.","cand","Éric Zemmour (Reconquête)","Deuxième candidature à la présidentielle, après les 7 % de 2022.",{re:1}),
E("19 sept.","cand","Nicolas Dupont-Aignan (Debout la France)","Déclaration de candidature.",{re:1}),
E("24 sept.","leg","Macron écarte une nouvelle dissolution","Le chef de l’État estime qu’une dissolution à sept mois du scrutin bloquerait le prochain président. Des conseillers l’avaient évoquée dans la presse."),
E("24 sept.","cand","Olivier Becht (sans étiquette)","Annonce de candidature.",{re:1}),
M("Octobre 2026"),
E("5 oct.","parti","Primaire « Choisir 2027 » : clôture des inscriptions","Vote électronique réservé aux inscrits au 5 octobre (PS, Place publique, GRS)."),
E("8 oct.","cand","Gilles Platret (divers droite)","Lancement à Chalon-sur-Saône ; d’autres sources le classent encore parmi les pressentis.",{re:1}),
E("11 oct.","parti","Raphaël Glucksmann désigné par la primaire de la gauche sociale-démocrate","Il l’emporte dès le premier tour avec 66,17 %, devant Olivier Faure (14,46 %) et Ségolène Royal (7,62 %). Emmanuel Maurel et Jérôme Guedj sont autour de 6 %.",{major:1}),
E("14 oct.","cand","Natacha Polony","Annonce de candidature.",{re:1}),
M("Novembre 2026"),
E("7 nov.","cand","Jean-Luc Mélenchon : meeting du Bourget","Sa quatrième candidature consécutive avait été confirmée fin mai.",{re:1}),
E("9 nov.","cand","Teddy Riner (sans étiquette)","Annonce de candidature.",{re:1}),
E("17 nov.","parti","Droite et centre : accord de principe sur une primaire en janvier","Entre Bruno Retailleau (LR) et Gabriel Attal (Renaissance). Pas de date précise à ce stade.",{re:1}),
E("18 nov.","cand","Édouard Philippe présente son programme","Le candidat d’Horizons, soutenu par Gérald Darmanin depuis le 30 août."),
E("20 nov.","cand","Dominique de Villepin","Candidature selon Poligraph ; une autre source le décrit encore comme pressenti.",{re:1}),
E("21 nov.","cand","François Ruffin se retire","Il renonce à se présenter."),
E("22–24 nov.","cand","Entre 32 et 38 candidatures annoncées","32 selon Poligraph (22 nov.), 38 selon franceinfo (24 nov.). Seules celles qui réunissent 500 parrainages iront au bout : 12 candidats en 2022."),
{t:"today"},
M("Décembre 2026"),
E("10–13 déc.","parti","Les Écologistes consultent leurs adhérents","Référendum interne sur la candidature de Marine Tondelier."),
E("Déc. – fév.","cand","Décision attendue de François Hollande","Elle a été repoussée : décembre selon une source, fin janvier ou début février selon une autre.",{re:1}),
M("Janvier 2027"),
E("Janvier","parti","Primaire à droite et au centre (date non fixée)","Prévue par l’accord de principe du 17 novembre, à confirmer.",{re:1}),
E("Début janv.","inst","Marine Le Pen : échéance judiciaire possible","Condamnée en appel le 7 juillet 2026 à 15 mois ferme d’inéligibilité, déjà purgés, elle est éligible. Selon La Libre, une décision de la Cour de cassation tomberait début janvier au plus tard.",{re:1}),
M("Février 2027"),
E("7 fév. au plus tard","inst","Décret de convocation des électeurs","Publié au moins dix semaines avant le premier tour. Il ouvre la période de recueil des parrainages.",{major:1}),
M("Mars 2027"),
E("12 mars · 18 h","parr","Fin des 500 parrainages","Dernier jour de réception au Conseil constitutionnel : 500 présentations d’élus, un seul candidat par élu, envoi par courrier avec signature manuscrite. Les déclarations de patrimoine et d’intérêts sont dues le même jour.",{major:1}),
E("12 mars","inst","Dernier jour pour s’inscrire sur les listes électorales","En ligne ou en mairie. Des cas particuliers permettent de s’inscrire jusqu’au dixième jour avant le premier tour."),
E("16 mars","inst","Liste officielle des candidats","Publication prévue au Journal officiel par le Conseil constitutionnel ; la limite légale est le 26 mars."),
M("Avril 2027"),
E("5 avril","scrutin","Début de la campagne officielle","Deux semaines avant le premier tour."),
E("16 avril","scrutin","Fin de la campagne du premier tour","À minuit, la veille du scrutin pour la métropole."),
E("17 avril","scrutin","Vote en outre-mer (samedi)","Guadeloupe, Martinique, Guyane, Saint-Pierre-et-Miquelon, Saint-Barthélemy, Saint-Martin, Polynésie française."),
E("18 avril","scrutin","PREMIER TOUR","Bureaux ouverts de 8 h à 19 h, jusqu’à 20 h sur décision préfectorale.",{major:1}),
E("19 avril","scrutin","Campagne officielle du second tour","Elle dure deux semaines."),
M("Mai 2027"),
E("1er mai","scrutin","Vote en outre-mer (samedi)","Mêmes territoires qu’au premier tour."),
E("2 mai","scrutin","SECOND TOUR","Les deux candidats arrivés en tête s’affrontent.",{major:1}),
E("12 mai au plus tard","inst","Proclamation des résultats","Par le Conseil constitutionnel."),
E("13–14 mai","inst","Fin du mandat de Macron, prise de fonctions du nouveau président","Toute l’Europe donne le 13 mai, Maire info le 14 mai, jour anniversaire de l’entrée en fonctions de 2017.",{major:1}),
E("Dès le 14 mai","leg","Le nouveau président peut dissoudre l’Assemblée","Article 12 : après consultation du Premier ministre et des présidents des deux assemblées. Élections 20 à 40 jours après la dissolution.",{major:1}),
M("Juin 2027"),
E("4–25 juin","leg","Législatives anticipées, seulement en cas de dissolution","Si la dissolution tombe le 15 mai, le scrutin aurait lieu entre le 4 et le 25 juin ; premier tour possible les dimanches 6, 13 ou 20 juin.",{major:1})
];

var KEYS=[["12 mars","Fin des parrainages, 18 h","#0F6B63"],["18 avril","Premier tour","#9B1C1C"],["2 mai","Second tour","#9B1C1C"],["13–14 mai","Passation de pouvoir","#0B3D91"],["4–25 juin","Législatives, si dissolution","#7A5C00"]];
var PRE=[["François Asselineau","UPR, 31 août 2023"],["Marine Le Pen","RN, lancée en 2023, confirmée le 7 juil. 2026 avec Jordan Bardella"],["Delphine Batho","Génération écologie, nov. 2025"],["Nathalie Arthaud","Lutte ouvrière, 8 déc. 2025"],["David Lisnard","Nouvelle Énergie, 31 mars ou 21 oct. 2026 selon les sources"],["Bruno Retailleau","LR, désigné mi-avril 2026"],["Florian Philippot","Les Patriotes, 9 mai 2026"],["Gabriel Attal","Renaissance, mai 2026"],["Jean-Luc Mélenchon","LFI, confirmé fin mai 2026"],["Karim Bouamrane","PS, 9 juin 2026"],["Bernard Cazeneuve","La Convention, 16 juil. 2026"],["Xavier Bertrand","Nous France, 26 août 2026"],["Édouard Philippe","Horizons, soutenu par Darmanin depuis le 30 août"]];
var ASSEMBLY=[
 {name:"GDR",full:"Gauche démocrate et républicaine",v:17,color:"#7F1D1D"},
 {name:"LFI-NFP",full:"La France insoumise - Nouveau Front populaire",v:70,color:"#D9381E"},
 {name:"EcoS",full:"Écologiste et social",v:39,color:"#2F9E5B"},
 {name:"SOC",full:"Socialistes et apparentés",v:67,color:"#F08CA0"},
 {name:"LIOT",full:"Libertés, indépendants, outre-mer et territoires",v:24,color:"#7FA39B"},
 {name:"EPR",full:"Ensemble pour la République",v:90,color:"#F2B90F"},
 {name:"Dem",full:"Les Démocrates",v:37,color:"#F28C28"},
 {name:"HOR",full:"Horizons & indépendants",v:35,color:"#7DB7EA"},
 {name:"DR",full:"Droite républicaine",v:46,color:"#2F6FD0"},
 {name:"UDR",full:"Union des droites pour la République",v:17,color:"#7C5CC4"},
 {name:"RN",full:"Rassemblement national",v:121,color:"#1B2B52"},
 {name:"Non-inscrits",full:"Députés sans groupe",v:11,color:"#A8A39A"},
 {name:"Sièges vacants",full:"Sièges sans député",v:3,color:"#DAD6CC"}
];

var COURANTS=[
 {k:"xg",name:"Extrême gauche",color:"#7F1D1D"},
 {k:"gr",name:"Gauche radicale",color:"#D9381E"},
 {k:"sd",name:"Gauche sociale-démocrate",color:"#F08CA0"},
 {k:"ec",name:"Écologistes",color:"#2F9E5B"},
 {k:"ce",name:"Centre",color:"#F2B90F"},
 {k:"dr",name:"Droite",color:"#2F6FD0"},
 {k:"so",name:"Droite souverainiste",color:"#7C5CC4"},
 {k:"xd",name:"Extrême droite",color:"#1B2B52"},
 {k:"dv",name:"Sans étiquette, divers, autres",color:"#A8A39A"}
];

var CANDS=[
 ["Nathalie Arthaud","Lutte ouvrière","xg"],["Anasse Kazib","Révolution permanente","xg"],["Selma Labib","NPA-Révolutionnaires","xg"],
 ["Jean-Luc Mélenchon","La France insoumise","gr"],["Fabien Roussel","Parti communiste français","gr"],
 ["Raphaël Glucksmann","Place publique","sd"],["Karim Bouamrane","Parti socialiste","sd"],["Bernard Cazeneuve","La Convention","sd"],["Fabien Verdier","Divers gauche","sd"],
 ["Marine Tondelier","Les Écologistes","ec"],["Delphine Batho","Génération écologie","ec"],
 ["Gabriel Attal","Renaissance","ce"],["Édouard Philippe","Horizons","ce"],["Olivier Becht","Sans étiquette","ce"],
 ["Bruno Retailleau","Les Républicains","dr"],["Xavier Bertrand","Nous France","dr"],["David Lisnard","Nouvelle Énergie","dr"],
 ["Nicolas Dupont-Aignan","Debout la France","so"],["Florian Philippot","Les Patriotes","so"],["François Asselineau","UPR","so"],
 ["Marine Le Pen","Rassemblement national","xd"],["Éric Zemmour","Reconquête","xd"],
 ["Dominique de Villepin","La France humaniste","dv"],["Natacha Polony","Nous sommes la France","dv"],["Teddy Riner","Sans étiquette","dv"],["Juan Branco","Les Ruches","dv"],["Clara Egger","Solution démocratique","dv"],["Mira Markovic","Parti animaliste","dv"],["Antoine Mikolajczak","Équinoxe","dv"],["Joël Chevé","La France Adulte","dv"],["Emmanuel Dubuisson","Étiquette non indiquée","dv"],["Rémi Revillon d’Apreval","Étiquette non indiquée","dv"]
];

var SRC=[["Conseil constitutionnel (info.gouv.fr)","https://www.info.gouv.fr/actualite/conseil-constitutionnel-tout-comprendre-sur-linstitution-des-sages"],["Vie-publique, motion de censure","https://www.vie-publique.fr/fiches/19523-quest-ce-quune-motion-de-censure-lassemblee-nationale"],["Sénat","https://www.senat.fr/role.html"],["Élysée, rôle du président","https://www.elysee.fr/la-presidence/le-role-du-president"],["Insee, corps électoral 2026","https://www.insee.fr/fr/statistiques/8888278"],["Service-Public, pièces d’identité","https://www.service-public.gouv.fr/particuliers/vosdroits/f1361"],["info.gouv.fr, comment voter","https://www.info.gouv.fr/actualite/comment-voter-a-la-presidentielle-2027"],["Vie-publique, référendums","https://www.vie-publique.fr/fiches/23970-les-referendums-de-la-ve-republique-et-leurs-resultats"],["Vie-publique, Constitution","https://www.vie-publique.fr/fiches/institutions-de-la-republique"],["info.gouv.fr","https://www.info.gouv.fr/actualite/election-presidentielle-2027"],["Service-Public","https://www.service-public.gouv.fr/particuliers/actualites/A15053"],["Toute l’Europe","https://www.touteleurope.eu/vie-politique-des-etats-membres/presidentielle-2027-calendrier-dates-inscription-candidats-vote/"],["Maire info","https://www.maire-info.com/election-presidentielle/parrainage-candidats-election-presidentielle-amf-demande-anonymat-article-31036"],["LCP","https://lcp.fr/actualites/presidentielle-2027-la-liste-des-candidats-declares-et-potentiels-444932"],["Public Sénat","https://www.publicsenat.fr/actualites/politique/nouvelle-dissolution-avant-la-presidentielle-2027-une-instrumentalisation-de-la-constitution-que-rien-ninterdit"],["Poligraph","https://poligraph.fr/elections/presidentielle-2027/candidats"],["Parlementeur","https://parlementeur.fr/assemblee/"],["Assemblée nationale","https://www2.assemblee-nationale.fr/17/les-groupes-politiques/modifications-a-la-composition-des-groupes/2026"],["Wikipédia, gouvernements de la Ve République","https://fr.wikipedia.org/wiki/Liste_des_gouvernements_de_la_France"]];
