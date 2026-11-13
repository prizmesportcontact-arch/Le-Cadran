"use strict";
/* =====================================================================
   Avatars : 12 personnages de BD en buste, dans une couleur au choix (8 teintes).
   Fichier autonome, utilisé par tous les jeux et par l'accueil.
   ===================================================================== */
const Avatar = (() => {
  const COUL = ["#19B5F0", "#FF2D2D", "#FFE600", "#00C46A", "#9B5CFF", "#FF8A00", "#FF4FB0", "#C69A6B"];
  // Personnages de BD en buste : chacun a sa tête, la couleur choisie colore le fond et le haut.
  const NOMS = ["Le héros", "La rockeuse", "Le punk", "L'intello", "La reine", "Le pirate", "La sportive", "Le ninja", "L'astronaute", "Le sorcier", "Le robot", "Le chat"];
  const N = "#111";
  const fonce = (h, k) => "#" + [1, 3, 5].map(i => Math.round(parseInt(h.slice(i, i + 2), 16) * k).toString(16).padStart(2, "0")).join("");
  // morceaux réutilisés
  const tete = (peau, extra) => `<ellipse cx="12.2" cy="19.6" rx="2.2" ry="2.5" fill="${peau}" stroke="${N}" stroke-width="1.6"/><ellipse cx="27.8" cy="19.6" rx="2.2" ry="2.5" fill="${peau}" stroke="${N}" stroke-width="1.6"/>` +
    `<ellipse cx="20" cy="18.5" rx="8" ry="9" fill="${peau}" stroke="${N}" stroke-width="1.8"/>` +
    `<path d="M20 9.5A8 9 0 0 1 20 27.5A5.6 9 0 0 0 20 9.5z" fill="#000" opacity=".13"/>` + (extra || "");
  const cou = peau => `<path d="M17.2 23.5h5.6v4.5h-5.6z" fill="${peau}" stroke="${N}" stroke-width="1.6"/>`;
  const haut = c => `<path d="M7.5 31.5C9 26.6 13.6 25.4 20 25.4S31 26.6 32.5 31.5A17 17 0 0 1 7.5 31.5z" fill="${c}" stroke="${N}" stroke-width="1.8" stroke-linejoin="round"/>`;
  const col = `<path d="M17 25.6 20 29l3-3.4" fill="none" stroke="${N}" stroke-width="1.5" stroke-linejoin="round"/>`;
  const oeil = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="1.25" ry="1.65" fill="${N}"/><circle cx="${x + .45}" cy="${y - .6}" r=".5" fill="#fff"/>`;
  const yeux = (y = 19) => oeil(16.6, y) + oeil(23.4, y);
  const sourire = (c = N) => `<path d="M17 23.2q3 2.6 6 0" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>`;
  const joues = `<ellipse cx="14.6" cy="22.4" rx="1.6" ry="1" fill="#FF6F91" opacity=".45"/><ellipse cx="25.4" cy="22.4" rx="1.6" ry="1" fill="#FF6F91" opacity=".45"/>`;
  const sourcils = (d = "M14.8 15.6q1.8-1 3.4 0M21.8 15.6q1.8-1 3.4 0") => `<path d="${d}" fill="none" stroke="${N}" stroke-width="1.3" stroke-linecap="round"/>`;
  const PERSOS = [
    // 0 le héros : mèche brune
    c => haut(fonce(c, .62)) + col + cou("#F5C9A0") + tete("#F5C9A0") +
      `<path d="M11.7 17.5C10.6 10.6 14.6 7.6 20.4 7.6S29.6 10.4 28.4 17.5C27.4 14.2 25.6 12.7 23 12.4 21 14.6 16.8 15.2 13.9 14.4 12.9 15.2 12.2 16.2 11.7 17.5z" fill="#5A3A22" stroke="${N}" stroke-width="1.6" stroke-linejoin="round"/><path d="M19 9.6q3 .2 5.5 2" fill="none" stroke="#8A5E3B" stroke-width="1.1" stroke-linecap="round"/>` +
      sourcils() + yeux() + sourire() + joues,
    // 1 la rockeuse : longs cheveux rouges
    c => `<path d="M10.6 18C9.4 8.8 14.8 6.6 20 6.6S30.6 8.8 29.4 18L31.4 30.6C27.8 31.6 25 30.4 23.6 28.2H16.4C15 30.4 12.2 31.6 8.6 30.6z" fill="#A8172E" stroke="${N}" stroke-width="1.6" stroke-linejoin="round"/>` +
      haut(fonce(c, .62)) + cou("#F2D0B5") + tete("#F2D0B5") +
      `<path d="M11.8 16.4C11.8 10.2 15.8 8.2 20 8.2S28.2 10.2 28.2 16.4C25.8 13.6 22.6 12.6 19.4 13 17 13.4 14.2 14.6 11.8 16.4z" fill="#A8172E" stroke="${N}" stroke-width="1.6" stroke-linejoin="round"/><path d="M14 11.4q4-2.4 9 -1.6" fill="none" stroke="#FF6B7D" stroke-width="1.1" stroke-linecap="round"/>` +
      `<path d="M15 17.4l-1-.8M25 17.4l1-.8" stroke="${N}" stroke-width="1" stroke-linecap="round"/>` + yeux() + `<path d="M17.6 23.2q2.4 1.9 4.8 0" fill="#E0314F" stroke="${N}" stroke-width="1.2" stroke-linejoin="round"/>` + joues,
    // 2 le punk : crête verte et boucle d'oreille
    c => haut(fonce(c, .62)) + `<path d="M15 25.8l-1.8 4.6M25 25.8l1.8 4.6" stroke="#C9CED6" stroke-width="1.4"/>` + cou("#E8B48F") + tete("#E8B48F", `<path d="M13.4 13.2q6.6-4 13.2 0" fill="none" stroke="#3A3A3A" stroke-width="2.4" opacity=".35"/>`) +
      `<path d="M17.2 11.4 15.6 2.6 18.6 6.2 20.2 .8 21.8 6.2 25 2.8 23 11.4z" fill="#2BD45F" stroke="${N}" stroke-width="1.6" stroke-linejoin="round"/>` +
      `<circle cx="12.2" cy="22.6" r="1.1" fill="none" stroke="#FFD23F" stroke-width="1"/>` +
      sourcils("M14.6 15.2l3.6 1.3M25.4 15.2l-3.6 1.3") + yeux(19.2) + `<path d="M17.4 23.6q2.6 1 5.4-1" fill="none" stroke="${N}" stroke-width="1.5" stroke-linecap="round"/>`,
    // 3 l'intello : lunettes rondes
    c => haut(fonce(c, .62)) + col + cou("#8D5A3B") + tete("#8D5A3B") +
      `<path d="M11.8 16.8C11 9.4 15 7.4 20 7.4S29 9.4 28.2 16.8C27.2 13.6 25.8 12.4 23.6 11.8L14 13.4C12.9 14.4 12.2 15.4 11.8 16.8z" fill="#1E1E1E" stroke="${N}" stroke-width="1.6" stroke-linejoin="round"/><path d="M22.5 8.2 21 12.2" stroke="#4A4A4A" stroke-width="1"/>` +
      yeux() + `<circle cx="16.6" cy="19" r="3" fill="#fff" fill-opacity=".22" stroke="${N}" stroke-width="1.3"/><circle cx="23.4" cy="19" r="3" fill="#fff" fill-opacity=".22" stroke="${N}" stroke-width="1.3"/><path d="M19.6 18.6h.8M13.6 18.4 11.6 17.8M26.4 18.4l2-.6" stroke="${N}" stroke-width="1.2"/>` + sourire(),
    // 4 la reine : cheveux blonds et couronne
    c => `<path d="M11 19C9.6 11 14 7.8 20 7.8S30.4 11 29 19L29.6 26.6C27 27.6 25 27 24 25.4H16C15 27 13 27.6 10.4 26.6z" fill="#F2C14E" stroke="${N}" stroke-width="1.6" stroke-linejoin="round"/>` +
      haut(fonce(c, .62)) + `<circle cx="20" cy="27.6" r="1.3" fill="#FFD23F" stroke="${N}" stroke-width="1"/>` + cou("#F6D3B8") + tete("#F6D3B8") +
      `<path d="M11.9 17C12 11.4 15.2 9.6 20 9.6S28 11.4 28.1 17C26.6 14 24 12.6 20 12.4 16 12.6 13.4 14 11.9 17z" fill="#F2C14E" stroke="${N}" stroke-width="1.6" stroke-linejoin="round"/>` +
      `<path d="M14.4 10.4 13.6 4.2 17 7 20 2.6 23 7 26.4 4.2 25.6 10.4z" fill="#FFD23F" stroke="${N}" stroke-width="1.5" stroke-linejoin="round"/><circle cx="20" cy="7.8" r="1.1" fill="#FF2D2D" stroke="${N}" stroke-width=".8"/>` +
      `<path d="M14.6 17.6l-1-.7M15.6 17l-.5-.9M25.4 17.6l1-.7M24.4 17l.5-.9" stroke="${N}" stroke-width=".9" stroke-linecap="round"/>` + yeux() + `<path d="M17.8 23.2q2.2 1.7 4.4 0" fill="#E0314F" stroke="${N}" stroke-width="1.2" stroke-linejoin="round"/>` + joues,
    // 5 le pirate : bandana, cache-œil, barbe
    c => haut(fonce(c, .62)) + `<path d="M13.4 25.8h13.2" stroke="#fff" stroke-width="1.2" stroke-dasharray="2 1.6"/>` + cou("#C98B62") + tete("#C98B62") +
      `<path d="M12.6 21.4C13.6 28.4 26.4 28.4 27.4 21.4 24.6 25.4 15.4 25.4 12.6 21.4z" fill="#4A2E1A" stroke="${N}" stroke-width="1.3" stroke-linejoin="round"/>` +
      `<path d="M11.6 15.8C11.4 9.4 15.4 7.4 20 7.4S28.6 9.4 28.4 15.8z" fill="#E63946" stroke="${N}" stroke-width="1.6" stroke-linejoin="round"/><path d="M28 12.6l4.6-2.2-.6 3.8 2.4 1.8-4.4.4z" fill="#E63946" stroke="${N}" stroke-width="1.3" stroke-linejoin="round"/><circle cx="16" cy="11.6" r=".7" fill="#fff"/><circle cx="20.4" cy="10.2" r=".7" fill="#fff"/><circle cx="24.4" cy="12" r=".7" fill="#fff"/>` +
      oeil(16.6, 19) + `<path d="M12.4 16.6 27.6 21" stroke="${N}" stroke-width="1"/><ellipse cx="23.6" cy="19.2" rx="2.4" ry="2.2" fill="${N}"/>` +
      `<path d="M17 23q3 2.4 6 0" fill="#fff" stroke="${N}" stroke-width="1.3" stroke-linejoin="round"/>`,
    // 6 la sportive : casquette et queue de cheval
    c => `<path d="M27 13C33.4 12.6 34.6 19.6 31.4 25 30.6 20.6 29.2 17.6 27 16.4z" fill="#1E1E1E" stroke="${N}" stroke-width="1.5" stroke-linejoin="round"/>` +
      haut(fonce(c, .62)) + `<path d="M20 25.4v6" stroke="#fff" stroke-width="1.2"/>` + cou("#6B4128") + tete("#6B4128") +
      `<path d="M11.6 15.4C11.4 9 15.4 7 20 7S28.6 9 28.4 15.4z" fill="#FFFFFF" stroke="${N}" stroke-width="1.6" stroke-linejoin="round"/><path d="M11.8 15.4H4.6C5.6 13.2 8 12.8 11.9 12.9z" fill="${fonce(c, .62)}" stroke="${N}" stroke-width="1.5" stroke-linejoin="round"/><circle cx="20" cy="7.4" r=".9" fill="${N}"/><path d="M16.4 8.2C15.2 10 14.8 12.4 14.8 15.4M23.6 8.2c1.2 1.8 1.6 4.2 1.6 7.2" fill="none" stroke="${fonce(c, .9)}" stroke-width="1.6"/>` +
      sourcils("M14.8 16.2q1.8-.6 3.4 0M21.8 16.2q1.8-.6 3.4 0") + yeux(19.2) + `<path d="M17 23q3 2.8 6 0z" fill="#fff" stroke="${N}" stroke-width="1.3" stroke-linejoin="round"/>`,
    // 7 le ninja : cagoule et bandeau rouge
    c => haut("#22222E") + `<path d="M16 25.6 20 30l4-4.4" fill="none" stroke="${fonce(c, 1)}" stroke-width="1.5"/>` + cou("#22222E") +
      `<ellipse cx="20" cy="18.5" rx="8.6" ry="9.6" fill="#22222E" stroke="${N}" stroke-width="1.8"/>` +
      `<rect x="12.4" y="16.2" width="15.2" height="5.2" rx="2.6" fill="#E8B48F" stroke="${N}" stroke-width="1.2"/>` +
      `<path d="M11.8 13.2h16.4v2.4H11.8z" fill="#E63946" stroke="${N}" stroke-width="1.2"/><path d="M28 14.4l5.4-1.8-1.6 3.4 2.6 2.4-6-1.6z" fill="#E63946" stroke="${N}" stroke-width="1.2" stroke-linejoin="round"/>` +
      `<path d="M15 18.2l3.4.8M25 18.2l-3.4.8" stroke="${N}" stroke-width="1.2" stroke-linecap="round"/>` + oeil(16.8, 19.4).replace(/ry="1.65"/, 'ry="1.2"') + oeil(23.2, 19.4).replace(/ry="1.65"/, 'ry="1.2"'),
    // 8 l'astronaute : casque bulle
    c => haut("#E9EEF2") + `<rect x="14.6" y="27.4" width="4.6" height="3" rx=".6" fill="${c}" stroke="${N}" stroke-width="1"/><circle cx="24" cy="29" r="1.2" fill="#FF2D2D" stroke="${N}" stroke-width=".8"/>` +
      cou("#F5C9A0") + tete("#F5C9A0") + `<path d="M12 16C11.6 10.6 15.2 8.6 20 8.6S28.4 10.6 28 16C26.4 13 23 12 20 12.2 17 12 13.6 13 12 16z" fill="#7A4A2A" stroke="${N}" stroke-width="1.5" stroke-linejoin="round"/>` +
      sourcils() + yeux() + `<path d="M17 23q3 2.8 6 0z" fill="#fff" stroke="${N}" stroke-width="1.3" stroke-linejoin="round"/>` + joues +
      `<circle cx="20" cy="17.6" r="11.4" fill="#9FDCFF" fill-opacity=".28" stroke="${N}" stroke-width="1.8"/><path d="M12.6 12.4a9 9 0 0 1 6-4.6" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="15.4" r=".9" fill="#fff"/>` +
      `<path d="M11 26.6h18v2.6H11z" fill="#C9D3DC" stroke="${N}" stroke-width="1.4"/>`,
    // 9 le sorcier : chapeau pointu et barbe blanche
    c => haut(fonce(c, .62)) + `<path d="M12 28.6l1.4.6M27.4 28.4l-1.6.8" stroke="#FFE600" stroke-width="1.2" stroke-linecap="round"/>` + cou("#F5C9A0") + tete("#F5C9A0") +
      `<path d="M12.4 20.4C11.6 29.6 15.6 33.6 20 34.6 24.4 33.6 28.4 29.6 27.6 20.4 25.2 24 14.8 24 12.4 20.4z" fill="#F4F4F4" stroke="${N}" stroke-width="1.5" stroke-linejoin="round"/><path d="M16 22.4q2-1.4 4 0 2-1.4 4 0-2 1.6-4 .4-2 1.2-4-.4z" fill="#E6E6E6" stroke="${N}" stroke-width="1.1" stroke-linejoin="round"/>` +
      sourcils("M14.4 16q2-1.4 3.8-.2M21.8 15.8q2-1.2 3.8.2") + yeux(18.6) +
      `<path d="M14 12.2 21.6 .6C22.6 3 25 7.6 27.6 11.8z" fill="#6C3FD1" stroke="${N}" stroke-width="1.6" stroke-linejoin="round"/><ellipse cx="20" cy="12.6" rx="11.4" ry="2.4" fill="#6C3FD1" stroke="${N}" stroke-width="1.6"/><path d="M21.2 6.4l.6 1.3 1.4.2-1 1 .2 1.4-1.2-.7-1.3.7.3-1.4-1-1 1.4-.2z" fill="#FFE600"/>`,
    // 10 le robot : tête de métal et yeux lumineux
    c => haut(fonce(c, .62)) + `<rect x="15" y="27" width="10" height="3.6" rx="1" fill="#C9D3DC" stroke="${N}" stroke-width="1.2"/><circle cx="17.6" cy="28.8" r=".7" fill="#FF2D2D"/><circle cx="20" cy="28.8" r=".7" fill="#00C46A"/>` +
      `<path d="M17.2 23.5h5.6v4h-5.6z" fill="#8C98A4" stroke="${N}" stroke-width="1.4"/><path d="M20 9V4.6" stroke="${N}" stroke-width="1.5"/><circle cx="20" cy="3.8" r="1.7" fill="#FF2D2D" stroke="${N}" stroke-width="1.2"/>` +
      `<rect x="9.6" y="15.6" width="3" height="6" rx="1" fill="#8C98A4" stroke="${N}" stroke-width="1.3"/><rect x="27.4" y="15.6" width="3" height="6" rx="1" fill="#8C98A4" stroke="${N}" stroke-width="1.3"/>` +
      `<rect x="11.6" y="9" width="16.8" height="16" rx="3" fill="#C9D3DC" stroke="${N}" stroke-width="1.8"/><path d="M24.4 9.6h2.4a1.6 1.6 0 0 1 1.6 1.6v12.4a1.6 1.6 0 0 1-1.6 1.6h-2.4z" fill="#000" opacity=".12"/>` +
      `<rect x="13.6" y="13" width="12.8" height="9" rx="1.6" fill="#1B2430" stroke="${N}" stroke-width="1.2"/><rect x="15.2" y="15.2" width="3.2" height="2.4" rx=".6" fill="#3BE8FF"/><rect x="21.6" y="15.2" width="3.2" height="2.4" rx=".6" fill="#3BE8FF"/><path d="M16.4 19.8h7.2" stroke="#3BE8FF" stroke-width="1.1" stroke-dasharray="1.2 .8"/>` +
      `<circle cx="13.2" cy="10.6" r=".55" fill="${N}"/><circle cx="26.8" cy="10.6" r=".55" fill="${N}"/>`,
    // 11 le chat : oreilles, rayures, moustaches
    c => haut(fonce(c, .62)) + `<path d="M17.4 25.8 20 28.4l2.6-2.6" fill="#FFE600" stroke="${N}" stroke-width="1.2" stroke-linejoin="round"/>` + cou("#F79B3B") +
      `<path d="M12.4 13.6 11.6 4.6 18 10.2zM27.6 13.6l.8-9-6.4 5.6z" fill="#F79B3B" stroke="${N}" stroke-width="1.6" stroke-linejoin="round"/><path d="M13.4 11.6 13 7.4l3 2.6zM26.6 11.6l.4-4.2-3 2.6z" fill="#FF9FB6"/>` +
      `<ellipse cx="20" cy="18.6" rx="8.6" ry="8.6" fill="#F79B3B" stroke="${N}" stroke-width="1.8"/><path d="M20 10A8.6 8.6 0 0 1 20 27.2 6 8.6 0 0 0 20 10z" fill="#000" opacity=".12"/>` +
      `<path d="M18.2 10.4l.6 2.6M20 10v3M21.8 10.4l-.6 2.6" stroke="#B85E12" stroke-width="1.2" stroke-linecap="round"/>` +
      `<ellipse cx="20" cy="22.6" rx="4.6" ry="3.2" fill="#FFF3E2" stroke="${N}" stroke-width="1.1"/><path d="M18.9 20.6h2.2L20 21.8z" fill="#FF6F91" stroke="${N}" stroke-width=".8" stroke-linejoin="round"/><path d="M20 21.8v1.2M20 23q-1.4 1.4-2.6.4M20 23q1.4 1.4 2.6.4" fill="none" stroke="${N}" stroke-width="1" stroke-linecap="round"/>` +
      `<path d="M14.6 22.2l-4-.8M14.6 23.6l-4 .6M25.4 22.2l4-.8M25.4 23.6l4 .6" stroke="${N}" stroke-width=".8" stroke-linecap="round"/>` +
      `<ellipse cx="16.4" cy="18.2" rx="1.6" ry="2" fill="#2E7D32" stroke="${N}" stroke-width="1"/><ellipse cx="23.6" cy="18.2" rx="1.6" ry="2" fill="#2E7D32" stroke="${N}" stroke-width="1"/><ellipse cx="16.4" cy="18.2" rx=".5" ry="1.5" fill="${N}"/><ellipse cx="23.6" cy="18.2" rx=".5" ry="1.5" fill="${N}"/><circle cx="16.9" cy="17.4" r=".45" fill="#fff"/><circle cx="24.1" cy="17.4" r=".45" fill="#fff"/>`
  ];
  const DETAILS = PERSOS;
  const valide = av => av && Number.isInteger(av.c) && Number.isInteger(av.v) && av.c >= 0 && av.c < COUL.length && av.v >= 0 && av.v < DETAILS.length;
  // Dessin dans un carré de 40×40, sans balise <svg> : à glisser dans un autre dessin.
  function dessin(av) {
    if (!valide(av)) av = { c: 0, v: 0 };
    const c = COUL[av.c];
    // médaillon de couleur, trame de points dans l'angle, reflet, puis le personnage en buste
    return `<circle cx="20" cy="20" r="17" fill="${c}"/>` +
      `<g fill="#000" opacity=".14"><circle cx="27" cy="7.5" r=".9"/><circle cx="30.5" cy="10" r=".9"/><circle cx="33" cy="13.6" r=".9"/><circle cx="24" cy="5.6" r=".7"/><circle cx="29.6" cy="5.8" r=".5"/><circle cx="33.4" cy="9.4" r=".5"/><circle cx="34.4" cy="17.6" r=".7"/></g>` +
      `<path d="M5.6 16.4A15 15 0 0 1 13.4 5.4" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" opacity=".55"/>` +
      `<circle cx="20" cy="20" r="17" fill="none" stroke="#111" stroke-width="2.2"/>` + PERSOS[av.v](c);
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
      el.innerHTML = `<div class="av-apercu">${svg(av, 76)}</div>
        <div class="av-choix">
          <div class="av-couleurs" role="radiogroup" aria-label="Couleur de ton avatar">${COUL.map((c, i) => `<button type="button" class="av-coul" role="radio" aria-checked="${i === av.c}" aria-label="Couleur ${i + 1}" data-c="${i}" style="background:${c}"></button>`).join("")}</div>
          <div class="av-tetes" role="radiogroup" aria-label="Tête de ton avatar">${DETAILS.map((_, i) => `<button type="button" class="av-tete" role="radio" aria-checked="${i === av.v}" aria-label="${NOMS[i]}" data-v="${i}">${svg({ c: av.c, v: i }, 40)}</button>`).join("")}</div>
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
