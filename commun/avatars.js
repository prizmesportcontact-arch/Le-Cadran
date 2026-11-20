"use strict";
/* =====================================================================
   Avatars à composer soi-même (le « vestiaire ») : peau, coiffure et sa couleur,
   yeux, bouche, accessoire, tenue et sa couleur, fond.
   Fichier autonome, utilisé par tous les jeux et par l'accueil.
   Un avatar : { c, p, h, hc, y, b, a, t, f }
     c = couleur de la tenue (c'est aussi la couleur du joueur dans les parties)
   Les anciens avatars { c, v } (12 personnages) restent acceptés et sont convertis.
   ===================================================================== */
const Avatar = (() => {
  const I = "#120B1F";
  const COUL = ["#E8344E", "#1F8FE0", "#3DDC97", "#FFD23A", "#6B3FE0", "#FF8A3D", "#FF6FB0", "#2A3060"];
  const COUL_NOMS = ["Rouge", "Bleu", "Vert", "Jaune", "Violet", "Orange", "Rose", "Nuit"];
  const PEAUX = ["#F9D7B5", "#F1C29A", "#D9A06E", "#B37446", "#8A5431", "#5E3A22"];
  const PEAUX_NOMS = ["Très claire", "Claire", "Mate", "Hâlée", "Foncée", "Très foncée"];
  const CH_COUL = ["#2A1B12", "#6B3E22", "#E9B949", "#C2410C", "#F2F2F2", "#6B3FE0", "#3DDC97", "#FF6FB0"];
  const CH_NOMS = ["Brun foncé", "Châtain", "Blond", "Roux", "Blanc", "Violet", "Vert", "Rose"];
  const FONDS = ["#5DB8FF", "#FF8A9A", "#8FF5BE", "#FFE57A", "#B39BFF", "#FFB070", "#FFB3D9", "#C7CDE6"];
  const FONDS_NOMS = ["Bleu", "Rouge", "Vert", "Jaune", "Violet", "Orange", "Rose", "Gris"];
  const CHEVEUX = ["Court", "Mèche", "Longs", "Crête", "Bouclés", "Chignon", "Queue de cheval", "Chauve"];
  const YEUX = ["Ronds", "Joyeux", "Grands", "Endormis", "Clin d'œil", "Déterminés"];
  const BOUCHES = ["Sourire", "Grand rire", "Neutre", "Langue", "Surpris", "En coin"];
  const ACCS = ["Rien", "Lunettes", "Lunettes de soleil", "Couronne", "Casquette", "Casque audio", "Bandeau", "Cache-œil"];
  const TENUES = ["T-shirt", "Sweat", "Chemise", "Maillot"];
  // nombre de choix pour chaque partie
  const MAX = { c: COUL.length, p: PEAUX.length, h: CHEVEUX.length, hc: CH_COUL.length, y: YEUX.length, b: BOUCHES.length, a: ACCS.length, t: TENUES.length, f: FONDS.length };
  const CHAMPS = Object.keys(MAX);
  // les 12 anciens personnages, refaits avec les nouvelles pièces
  const ANCIENS = [
    { p: 1, h: 1, hc: 1, y: 0, b: 0, a: 0, t: 0 }, { p: 0, h: 2, hc: 3, y: 2, b: 1, a: 0, t: 1 }, { p: 2, h: 3, hc: 6, y: 5, b: 5, a: 0, t: 0 },
    { p: 4, h: 0, hc: 0, y: 0, b: 0, a: 1, t: 2 }, { p: 0, h: 2, hc: 2, y: 2, b: 0, a: 3, t: 2 }, { p: 3, h: 0, hc: 0, y: 0, b: 5, a: 7, t: 3 },
    { p: 5, h: 6, hc: 0, y: 5, b: 1, a: 4, t: 3 }, { p: 2, h: 7, hc: 0, y: 5, b: 2, a: 6, t: 1 }, { p: 1, h: 0, hc: 1, y: 1, b: 1, a: 5, t: 0 },
    { p: 0, h: 4, hc: 4, y: 3, b: 0, a: 1, t: 1 }, { p: 3, h: 5, hc: 5, y: 4, b: 3, a: 2, t: 0 }, { p: 1, h: 4, hc: 3, y: 1, b: 3, a: 0, t: 1 }
  ];
  const entier = (v, n) => Number.isInteger(v) && v >= 0 && v < n;
  // Rend un avatar complet et sûr, quel que soit ce qu'on reçoit (ancien format, champ manquant…)
  function normal(av) {
    if (!av || typeof av !== "object") return null;
    if (!entier(av.c, MAX.c)) return null;
    if (av.h === undefined && entier(av.v, ANCIENS.length)) return Object.assign({ c: av.c, f: av.c }, ANCIENS[av.v]);
    const r = { c: av.c };
    for (const k of CHAMPS) { if (k === "c") continue; if (!entier(av[k], MAX[k])) return null; r[k] = av[k]; }
    return r;
  }
  const valide = av => !!normal(av);

  /* ---------- Dessin, dans un carré de 100×100 ---------- */
  const E = (cx, cy, rx, ry) => `M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0z`;
  const P = (d, f, w, st, o) => `<path d="${d}" fill="${f || "none"}" stroke="${st === undefined ? I : st}" stroke-width="${w === undefined ? 2.6 : w}"${o !== undefined ? ` opacity="${o}"` : ""} stroke-linecap="round" stroke-linejoin="round"/>`;
  const sombre = (h, k) => "#" + [1, 3, 5].map(i => Math.round(parseInt(h.slice(i, i + 2), 16) * k).toString(16).padStart(2, "0")).join("");
  function corps(a) {
    const p = PEAUX[a.p], h = CH_COUL[a.hc], t = COUL[a.c]; let s = "";
    if (a.h === 2) s += P("M26 46C22 22 38 15 50 15S78 22 74 46L78 82C70 86 62 82 60 76H40C38 82 30 86 22 82Z", h);
    if (a.h === 6) s += P("M68 30C86 30 88 54 79 70C78 58 75 47 68 41Z", h);
    if (a.t === 1) s += P("M28 84C28 70 39 66 50 66S72 70 72 84Z", sombre(t, .7));
    s += P("M43 60h14v16h-14z", p);
    s += P("M12 102C14 82 30 75 50 75S86 82 88 102Z", t);
    s += P("M50 75C66 75 86 82 88 102H50Z", "#000", 0, "none", .15);
    if (a.t === 0) s += P("M42 76q8 8 16 0", "none", 2.4);
    if (a.t === 1) s += P("M45 80v12M55 80v12", "none", 2.4, "#FFF4E2");
    if (a.t === 2) s += P("M40 75L50 86L45 89L36 79Z", "#FFF4E2", 2.2) + P("M60 75L50 86L55 89L64 79Z", "#FFF4E2", 2.2) + P(E(50, 94, 1.6, 1.6), I, 0, "none");
    if (a.t === 3) s += P("M42 76q8 8 16 0", "none", 2.4) + P("M22 90h56", "none", 4, "#FFF4E2");
    s += P(E(28, 46, 4.5, 5.5), p) + P(E(72, 46, 4.5, 5.5), p) + P(E(50, 44, 22, 24), p, 2.8);
    s += P("M50 20a22 24 0 0 1 0 48a15 24 0 0 0 0-48z", "#000", 0, "none", .12);
    s += P(E(37, 54, 4, 2.4), "#FF6F91", 0, "none", .45) + P(E(63, 54, 4, 2.4), "#FF6F91", 0, "none", .45);
    s += a.y === 5 ? P("M35 37l10 3.5M65 37l-10 3.5", "none", 2.8) : P("M36 38q5-3 9 0M55 38q5-3 9 0", "none", 2.2);
    const rond = x => P(E(x, 46, 3, 4), I, 0, "none") + P(E(x + 1, 44.4, 1.1, 1.1), "#fff", 0, "none");
    if (a.y === 0 || a.y === 5) s += rond(41) + rond(59);
    if (a.y === 1) s += P("M37 48q4-6 8 0M55 48q4-6 8 0", "none", 2.8);
    if (a.y === 2) { [41, 59].forEach(x => { s += P(E(x, 46, 4.6, 5.6), "#fff", 2.2) + P(E(x + .5, 47, 2.6, 3), I, 0, "none") + P(E(x + 1.4, 45.4, 1, 1), "#fff", 0, "none"); }); s += P("M35 41l-2-2M65 41l2-2", "none", 1.8); }
    if (a.y === 3) s += P("M37 47q4 3 8 0M55 47q4 3 8 0", "none", 2.8);
    if (a.y === 4) s += rond(41) + P("M55 47q4-5 8 0", "none", 2.8);
    if (a.b === 0) s += P("M43 56q7 6 14 0", "none", 2.6);
    if (a.b === 1) s += P("M42 55q8 11 16 0z", "#7A1F2B", 2.4);
    if (a.b === 2) s += P("M44 58h12", "none", 2.6);
    if (a.b === 3) s += P("M47 58.5q3 7 6 0", "#FF6F91", 2) + P("M43 56q7 5 14 0", "none", 2.6);
    if (a.b === 4) s += P(E(50, 58, 3.2, 4), "#7A1F2B", 2.4);
    if (a.b === 5) s += P("M44 58q8 2 12-4", "none", 2.6);
    const coiffe = "M28 40C28 24 38 19 50 19S72 24 72 40C66 30 58 27 50 27S34 30 28 40Z";
    if (a.h === 0) s += P("M28 42C27 24 38 18 50 18S73 24 72 42C69 33 63 29 56 28C50 31 40 32 32 30C30 33 29 37 28 42Z", h);
    if (a.h === 1) s += P("M27 42C25 22 40 15 54 17C66 18 74 27 73 42C70 34 64 30 56 29C50 36 38 38 27 42Z", h);
    if (a.h === 2) s += P("M28 40C29 24 39 20 50 20S71 24 72 40C66 32 58 29 50 29S34 32 28 40Z", h);
    if (a.h === 3) s += P("M31 34q19-12 38 0", "none", 5, h, .4) + P("M44 25L40 5L47 13L50 1L53 13L60 5L56 25Z", h);
    if (a.h === 4) [[30, 37, 7], [35, 27, 8], [46, 21, 9], [58, 21, 9], [67, 28, 8], [71, 38, 6]].forEach(b => { s += P(E(b[0], b[1], b[2], b[2]), h, 2.2); });
    if (a.h === 5) s += P(E(50, 13, 9, 8), h) + P(coiffe, h);
    if (a.h === 6) s += P(coiffe, h);
    if (a.h === 7) s += P(E(43, 27, 6, 2.6), "#fff", 0, "none", .45);
    if (a.h !== 7 && a.h !== 4) s += P("M38 24q6-3 13-2", "none", 2, "#fff", .35);
    if (a.a === 1) s += P(E(41, 46, 7, 7), "#fff", 0, "none", .25) + P(E(59, 46, 7, 7), "#fff", 0, "none", .25) + P(E(41, 46, 7, 7), "none", 2.4) + P(E(59, 46, 7, 7), "none", 2.4) + P("M48 46h4M34 45L28 43M66 45L72 43", "none", 2.2);
    if (a.a === 2) s += P("M32 41h16v5q0 7-8 7t-8-7z", I, 2) + P("M52 41h16v5q0 7-8 7t-8-7z", I, 2) + P("M48 42h4M32 42L27 40M68 42L73 40", "none", 2.4) + P("M35 44l5-1M55 44l5-1", "none", 1.6, "#fff", .6);
    if (a.a === 3) s += P("M33 24L31 7L41 15L50 3L59 15L69 7L67 24Z", "#FFD23A", 2.4) + P(E(50, 17, 2.6, 2.6), "#E8344E", 1.6) + P("M36 20h28", "none", 1.6, "#fff", .5);
    if (a.a === 4) s += P("M27 36C27 19 38 14 50 14S73 19 73 36Z", "#E8344E") + P("M27 36H9C11 30 18 29 28 31Z", "#A2243A") + P(E(50, 14, 2.2, 2.2), "#FFF4E2", 1.6) + P("M36 22q8-5 16-4", "none", 2, "#fff", .4);
    if (a.a === 5) s += P("M26 44C23 14 77 14 74 44", "none", 6) + P("M26 44C23 14 77 14 74 44", "none", 3, "#2A3060") + P(E(25, 48, 6, 9), "#E8344E", 2.4) + P(E(75, 48, 6, 9), "#E8344E", 2.4);
    if (a.a === 6) s += P("M27 31h46v8h-46z", "#E8344E", 2.2) + P("M72 32l13-4-3 7 6 4-15-2z", "#E8344E", 2);
    if (a.a === 7) s += P("M28 37L73 54", "none", 2.2) + P(E(59, 46, 6.4, 6), I, 2);
    return s;
  }
  let nClip = 0;
  // Médaillon complet en 100×100 : fond, buste découpé dans le cercle, contour.
  function medaillon(av) {
    const a = normal(av) || auto(0), id = "avc" + (++nClip);
    return `<defs><clipPath id="${id}"><circle cx="50" cy="50" r="46"/></clipPath></defs><circle cx="50" cy="50" r="46" fill="${FONDS[a.f]}"/>` +
      `<path d="M12 40A40 40 0 0 1 34 10" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".45"/>` +
      `<g clip-path="url(#${id})">${corps(a)}</g><circle cx="50" cy="50" r="46" fill="none" stroke="${I}" stroke-width="5"/>`;
  }
  // Dessin dans un carré de 40×40, sans balise <svg> : à glisser dans un autre dessin.
  const dessin = av => `<g transform="scale(.4)">${medaillon(av)}</g>`;
  const svg = (av, taille, extra) => `<svg class="avatar" viewBox="0 0 100 100" width="${taille || 28}" height="${taille || 28}" aria-hidden="true"${extra || ""}>${medaillon(av)}</svg>`;
  // Dans un dessin SVG : centré en (x, y), de la taille voulue.
  const groupe = (av, x, y, taille) => { const k = taille / 100; return `<g transform="translate(${(x - taille / 2).toFixed(1)} ${(y - taille / 2).toFixed(1)}) scale(${k.toFixed(3)})">${medaillon(av)}</g>`; };

  const hasard = () => { const r = {}; CHAMPS.forEach(k => { r[k] = Math.floor(Math.random() * MAX[k]); }); if (r.a > 0 && Math.random() < .35) r.a = 0; return r; };
  function lire() {
    try { const v = normal(JSON.parse(localStorage.getItem("jeux-avatar") || "null")); if (v) return v; } catch (e) {}
    const v = hasard(); ecrire(v); return v;
  }
  function ecrire(av) { try { localStorage.setItem("jeux-avatar", JSON.stringify(av)); } catch (e) {} }

  /* ---------- Le vestiaire : choisir chaque partie de son avatar ---------- */
  const ONGLETS = [
    { id: "p", nom: "Peau", noms: PEAUX_NOMS },
    { id: "h", nom: "Cheveux", noms: CHEVEUX, coul: "hc", couls: CH_COUL, coulNoms: CH_NOMS },
    { id: "y", nom: "Yeux", noms: YEUX },
    { id: "b", nom: "Bouche", noms: BOUCHES },
    { id: "a", nom: "Objet", noms: ACCS },
    { id: "t", nom: "Tenue", noms: TENUES, coul: "c", couls: COUL, coulNoms: COUL_NOMS },
    { id: "f", nom: "Fond", noms: FONDS_NOMS }
  ];
  function choisisseur(el, surChange) {
    let av = lire(), onglet = "h";
    el.classList.add("vestiaire");
    const changer = nv => { av = nv; ecrire(av); dessiner(); surChange && surChange(av); };
    function dessiner() {
      const o = ONGLETS.find(x => x.id === onglet);
      el.innerHTML = `<div class="vs-scene"><div class="vs-halo"></div><div class="vs-perso">${svg(av, 150)}</div><div class="vs-socle"></div>
          <button type="button" class="vs-hasard" aria-label="Avatar au hasard"><svg viewBox="0 0 28 28" aria-hidden="true"><rect x="3" y="3" width="22" height="22" rx="6" fill="#FFF4E2" stroke="#120B1F" stroke-width="2.5"/><circle cx="9" cy="9" r="2.2" fill="#120B1F"/><circle cx="19" cy="19" r="2.2" fill="#120B1F"/><circle cx="14" cy="14" r="2.2" fill="#120B1F"/><circle cx="19" cy="9" r="2.2" fill="#120B1F"/><circle cx="9" cy="19" r="2.2" fill="#120B1F"/></svg></button></div>
        <div class="vs-onglets" role="tablist" aria-label="Parties de ton avatar">${ONGLETS.map(x => `<button type="button" role="tab" class="vs-onglet" aria-selected="${x.id === onglet}" data-o="${x.id}">${x.nom}</button>`).join("")}</div>
        <div class="vs-panneau">
          <div class="vs-grille" role="radiogroup" aria-label="${o.nom}">${o.noms.map((n, i) => `<button type="button" class="vs-vignette" role="radio" aria-checked="${av[o.id] === i}" aria-label="${n}" data-v="${i}">${svg(Object.assign({}, av, { [o.id]: i }), 56)}<span>${n}</span></button>`).join("")}</div>
          ${o.coul ? `<div class="vs-couleurs" role="radiogroup" aria-label="Couleur">${o.couls.map((c, i) => `<button type="button" class="vs-coul" role="radio" aria-checked="${av[o.coul] === i}" aria-label="${o.coulNoms[i]}" data-c="${i}" style="background:${c}"></button>`).join("")}</div>` : ""}
        </div>`;
      el.querySelectorAll("[data-o]").forEach(b => b.onclick = () => { onglet = b.dataset.o; dessiner(); if (typeof sons !== "undefined" && sons.clic) sons.clic(); });
      el.querySelectorAll("[data-v]").forEach(b => b.onclick = () => changer(Object.assign({}, av, { [o.id]: +b.dataset.v })));
      el.querySelectorAll("[data-c]").forEach(b => b.onclick = () => changer(Object.assign({}, av, { [o.coul]: +b.dataset.c })));
      el.querySelector(".vs-hasard").onclick = () => changer(hasard());
    }
    dessiner();
    return () => av;
  }
  // Couleurs des joueurs d'une partie : celle de leur avatar, ou une autre libre si deux ont la même.
  function couleurs(joueurs) {
    const prises = new Set(), res = {};
    joueurs.forEach(j => {
      const a = normal(j.av); let c = a ? COUL[a.c] : null;
      if (!c || prises.has(c)) c = COUL.find(x => !prises.has(x)) || "#fff";
      prises.add(c); res[j.id] = c;
    });
    return res;
  }
  // Avatar automatique pour les joueurs du mode local (tous différents).
  function auto(k) {
    const b = ANCIENS[(k * 5) % ANCIENS.length];
    return Object.assign({ c: k % COUL.length, f: (k + 3) % FONDS.length }, b);
  }
  // Avatar d'un joueur, avec la couleur qu'il a dans la partie (pour que tout le monde soit différent).
  const avec = (av, couleur) => { const a = normal(av) || auto(0), i = COUL.indexOf(couleur); return i < 0 ? a : Object.assign({}, a, { c: i }); };
  return { COUL, valide, normal, dessin, svg, groupe, lire, ecrire, choisisseur, couleurs, auto, avec, n: ANCIENS.length };
})();
