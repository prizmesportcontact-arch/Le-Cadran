"use strict";
/* =====================================================================
   Avatars : une petite tête de BD (12 dessins) dans une couleur (8 teintes).
   Fichier autonome, utilisé par tous les jeux et par l'accueil.
   ===================================================================== */
const Avatar = (() => {
  const COUL = ["#19B5F0", "#FF2D2D", "#FFE600", "#00C46A", "#9B5CFF", "#FF8A00", "#FF4FB0", "#C69A6B"];
  const NOMS = ["Sourire", "Surpris", "Lunettes noires", "Intello", "Grrr", "Content", "Casquette", "Couronne", "Moustache", "Diablotin", "Clin d'œil", "Casque"];
  const yeux = '<circle cx="14.5" cy="18" r="2.2" fill="#111"/><circle cx="25.5" cy="18" r="2.2" fill="#111"/>';
  const sourire = '<path d="M13.5 25.5c3.5 4 9.5 4 13 0" fill="none" stroke="#111" stroke-width="2.6" stroke-linecap="round"/>';
  const DETAILS = [
    yeux + sourire,
    yeux + '<ellipse cx="20" cy="27" rx="3.4" ry="4" fill="#111"/>',
    '<path d="M9 15.5h22v2.5c0 2.6-2.2 4.5-4.8 4.5h-1.6c-2.1 0-3.6-1.6-3.6-3.6 0 2-1.5 3.6-3.6 3.6h-1.6C11.2 22.5 9 20.6 9 18z" fill="#111"/><path d="M15 27.5c3 1.6 7 1.2 10-1.5" fill="none" stroke="#111" stroke-width="2.6" stroke-linecap="round"/>',
    '<circle cx="14.5" cy="18" r="4.2" fill="#fff" stroke="#111" stroke-width="2.2"/><circle cx="25.5" cy="18" r="4.2" fill="#fff" stroke="#111" stroke-width="2.2"/><path d="M18.7 18h2.6" stroke="#111" stroke-width="2.2"/><circle cx="14.5" cy="18.4" r="1.5" fill="#111"/><circle cx="25.5" cy="18.4" r="1.5" fill="#111"/><path d="M16 27h8" stroke="#111" stroke-width="2.6" stroke-linecap="round"/>',
    '<path d="M10.5 13.5l7 3M29.5 13.5l-7 3" stroke="#111" stroke-width="2.8" stroke-linecap="round"/>' + yeux + '<rect x="13" y="24" width="14" height="6" rx="1.5" fill="#fff" stroke="#111" stroke-width="2.2"/><path d="M17.7 24v6M22.3 24v6" stroke="#111" stroke-width="1.6"/>',
    '<path d="M11.5 19c1.5-2.4 4.5-2.4 6 0M22.5 19c1.5-2.4 4.5-2.4 6 0" fill="none" stroke="#111" stroke-width="2.4" stroke-linecap="round"/><circle cx="11" cy="23.5" r="2.4" fill="#FF6F91" opacity=".8"/><circle cx="29" cy="23.5" r="2.4" fill="#FF6F91" opacity=".8"/>' + sourire,
    '<path d="M5.5 15c0-8 6.5-12 14.5-12s14.5 4 14.5 12z" fill="#111"/><path d="M20 15H38" stroke="#111" stroke-width="3.4" stroke-linecap="round"/>' + yeux.replace(/18"/g, '20"') + sourire,
    '<path d="M10 9 13 2l4 5 3-6 3 6 4-5 3 7z" fill="#FFE600" stroke="#111" stroke-width="2" stroke-linejoin="round"/>' + yeux + sourire,
    yeux + '<path d="M11 25c3-3 6-2.5 9-.5 3-2 6-2.5 9 .5-3 3-6 2.5-9 .5-3 2-6 2.5-9-.5z" fill="#111"/>',
    '<path d="M9 9 6 1.5l8.5 5M31 9l3-7.5-8.5 5" fill="#FF2D2D" stroke="#111" stroke-width="2.2" stroke-linejoin="round"/><path d="M11.5 15.5l6 2.5M28.5 15.5l-6 2.5" stroke="#111" stroke-width="2.6" stroke-linecap="round"/>' + yeux.replace(/18"/g, '20"') + '<path d="M13 25.5c4 4.5 10 4.5 14 0z" fill="#fff" stroke="#111" stroke-width="2.2" stroke-linejoin="round"/>',
    '<circle cx="14.5" cy="18" r="2.2" fill="#111"/><path d="M22.5 18.5c1.2-1.6 4-1.6 5.2 0" fill="none" stroke="#111" stroke-width="2.4" stroke-linecap="round"/><path d="M12 6.5c2.5-2 5.5-2 8 0-2 2.6-6 2.6-8 0zM20 6.5c2.5-2 5.5-2 8 0-2 2.6-6 2.6-8 0z" fill="#FF2D2D" stroke="#111" stroke-width="1.8"/>' + sourire,
    '<path d="M6 21c0-9.5 6-15 14-15s14 5.5 14 15" fill="none" stroke="#111" stroke-width="3.2"/><rect x="2.5" y="17" width="6" height="10" rx="2" fill="#111"/><rect x="31.5" y="17" width="6" height="10" rx="2" fill="#111"/>' + yeux + sourire
  ];
  const valide = av => av && Number.isInteger(av.c) && Number.isInteger(av.v) && av.c >= 0 && av.c < COUL.length && av.v >= 0 && av.v < DETAILS.length;
  // Dessin dans un carré de 40×40, sans balise <svg> : à glisser dans un autre dessin.
  function dessin(av) {
    if (!valide(av)) av = { c: 0, v: 0 };
    return `<circle cx="20" cy="21" r="16" fill="${COUL[av.c]}" stroke="#111" stroke-width="3"/>${DETAILS[av.v]}`;
  }
  const svg = (av, taille, extra) => `<svg class="avatar" viewBox="0 0 40 40" width="${taille || 28}" height="${taille || 28}" aria-hidden="true"${extra || ""}>${dessin(av)}</svg>`;
  // Dans un dessin SVG : centré en (x, y), de la taille voulue.
  const groupe = (av, x, y, taille) => { const k = taille / 40; return `<g transform="translate(${(x - taille / 2).toFixed(1)} ${(y - taille / 2).toFixed(1)}) scale(${k.toFixed(3)})">${dessin(av)}</g>`; };
  function lire() {
    try { const v = JSON.parse(localStorage.getItem("jeux-avatar") || "null"); if (valide(v)) return v; } catch (e) {}
    const v = { c: Math.floor(Math.random() * COUL.length), v: Math.floor(Math.random() * DETAILS.length) };
    ecrire(v); return v;
  }
  function ecrire(av) { try { localStorage.setItem("jeux-avatar", JSON.stringify(av)); } catch (e) {} }
  // Choix de l'avatar : une rangée de couleurs et une grille de têtes.
  function choisisseur(el, surChange) {
    let av = lire(); el.classList.add("avatar-choix");
    function dessiner() {
      el.innerHTML = `<div class="av-apercu">${svg(av, 64)}</div>
        <div class="av-choix">
          <div class="av-couleurs" role="radiogroup" aria-label="Couleur de ton avatar">${COUL.map((c, i) => `<button type="button" class="av-coul" role="radio" aria-checked="${i === av.c}" aria-label="Couleur ${i + 1}" data-c="${i}" style="background:${c}"></button>`).join("")}</div>
          <div class="av-tetes" role="radiogroup" aria-label="Tête de ton avatar">${DETAILS.map((_, i) => `<button type="button" class="av-tete" role="radio" aria-checked="${i === av.v}" aria-label="${NOMS[i]}" data-v="${i}">${svg({ c: av.c, v: i }, 30)}</button>`).join("")}</div>
        </div>`;
      el.querySelectorAll("[data-c]").forEach(b => b.onclick = () => { av = { c: +b.dataset.c, v: av.v }; ecrire(av); dessiner(); surChange && surChange(av); });
      el.querySelectorAll("[data-v]").forEach(b => b.onclick = () => { av = { c: av.c, v: +b.dataset.v }; ecrire(av); dessiner(); surChange && surChange(av); });
    }
    dessiner();
    return () => av;
  }
  // Couleurs des joueurs d'une partie : celle de leur avatar, ou une autre libre si deux ont la même.
  function couleurs(joueurs) {
    const prises = new Set(), res = {};
    joueurs.forEach(j => {
      let c = valide(j.av) ? COUL[j.av.c] : null;
      if (!c || prises.has(c)) c = COUL.find(x => !prises.has(x)) || "#fff";
      prises.add(c); res[j.id] = c;
    });
    return res;
  }
  // Avatar automatique pour les joueurs du mode local (tous différents).
  const auto = k => ({ c: k % COUL.length, v: (k * 5) % DETAILS.length });
  return { COUL, valide, dessin, svg, groupe, lire, ecrire, choisisseur, couleurs, auto, n: DETAILS.length };
})();
