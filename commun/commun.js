"use strict";
/* =====================================================================
   Socle commun des jeux : outils, icônes, sons, fenêtres et salon en ligne.
   Chaque jeu charge ce fichier puis écrit sa propre logique.
   ===================================================================== */
const RACINE = new URL("../", document.currentScript.src).href;
const $ = id => document.getElementById(id);
const memo = {
  lire(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } },
  ecrire(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
};
const melange = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const hasard = a => a[Math.floor(Math.random() * a.length)];
const echapper = t => String(t).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const normaliser = t => String(t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
const reduit = matchMedia("(prefers-reduced-motion: reduce)").matches;
const pseudo = {
  lire() { return memo.lire("jeux-pseudo", memo.lire("cadran-pseudo", "")); },
  ecrire(n) { memo.ecrire("jeux-pseudo", n); memo.ecrire("cadran-pseudo", n); }
};

/* ---------- Icônes (dessinées au trait, façon BD) ---------- */
const ICONES = {
  son: '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>',
  muet: '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M17 9.5l5 5M22 9.5l-5 5"/>',
  aide: '<circle cx="12" cy="12" r="9.5"/><path d="M9.2 9.3a2.9 2.9 0 1 1 4 2.7c-.8.4-1.2 1-1.2 1.9v.6"/><path d="M12 17.6v.1"/>',
  quitter: '<path d="M6 6l12 12M18 6L6 18"/>',
  retour: '<path d="M20 12H5M11 5l-7 7 7 7"/>',
  maison: '<path d="M3.5 11 12 4l8.5 7"/><path d="M6 9.5V20h4.5v-5.5h3V20H18V9.5"/>',
  gens: '<circle cx="8.5" cy="8" r="3.2"/><path d="M2.5 20c0-3.6 2.7-6 6-6s6 2.4 6 6"/><circle cx="17" cy="9" r="2.6"/><path d="M15.5 14.4c3.3-.6 6 1.6 6 5.6"/>',
  tel: '<rect x="6.5" y="2.5" width="11" height="19" rx="2"/><path d="M10.5 18.2h3"/>',
  tele: '<rect x="2.5" y="4.5" width="19" height="12.5" rx="1.5"/><path d="M8 21h8M12 17v4"/>',
  copier: '<rect x="8.5" y="8.5" width="12" height="12" rx="1.5"/><path d="M15.5 8.5V5a1.5 1.5 0 0 0-1.5-1.5H5A1.5 1.5 0 0 0 3.5 5v9A1.5 1.5 0 0 0 5 15.5h3.5"/>',
  lien: '<path d="M10 14a4.5 4.5 0 0 0 6.4 0l3.2-3.2a4.5 4.5 0 0 0-6.4-6.4L12 5.6"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3.2 3.2a4.5 4.5 0 0 0 6.4 6.4l1.2-1.2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  envoyer: '<path d="M3.5 11.5 20.5 4l-5.5 16-3.5-6.5z"/><path d="M11.5 13.5 20.5 4"/>',
  oeil: '<path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  rejouer: '<path d="M20 12a8 8 0 1 1-2.6-5.9"/><path d="M20.5 3.5v5h-5"/>',
  reglages: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2.3"/><circle cx="10" cy="17" r="2.3"/>',
  suite: '<path d="M4 12h15M13 5l7 7-7 7"/>',
  masque: '<path d="M3 8.5c3-2 6-2 9 0 3-2 6-2 9 0 0 5-2.5 8-5 8-1.6 0-2.6-1.3-4-1.3S9.6 16.5 8 16.5c-2.5 0-5-3-5-8z"/><path d="M6.5 10.5c1 .8 2 .8 3 0M14.5 10.5c1 .8 2 .8 3 0"/>',
  regle: '<rect x="2.5" y="8" width="19" height="8" rx="1"/><path d="M6 8v3M9.5 8v2M13 8v3M16.5 8v2"/>',
  vote: '<path d="M4 13.5h16v7H4z"/><path d="M8 13.5 12 4l5 2-3.5 7.5"/>',
  musique: '<path d="M9 18V5l11-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>',
  menu: '<path d="M4 6.5h16M4 12h16M4 17.5h16"/>',
  partager: '<path d="M12 3.5v12M7.5 8 12 3.5 16.5 8"/><path d="M5 12.5v6.5a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5v-6.5"/>',
  chevron: '<path d="M9 5l7 7-7 7"/>',
  chrono: '<circle cx="12" cy="13.5" r="8"/><path d="M12 9.5v4l2.5 2M9.5 2.5h5"/>'
};
document.body.insertAdjacentHTML("afterbegin", '<svg width="0" height="0" style="position:absolute" aria-hidden="true">' +
  Object.entries(ICONES).map(([n, d]) => `<symbol id="i-${n}" viewBox="0 0 24 24">${d}</symbol>`).join("") + "</svg>");
const ico = n => `<svg class="ico" aria-hidden="true"><use href="#i-${n}"/></svg>`;

/* ---------- Sons légers (fabriqués à la volée, aucun fichier) ---------- */
let audio = null, sonActif = memo.lire("cadran-son", "1") === "1";
function note(freq, duree, type, volume, quand) {
  if (!sonActif) return;
  try {
    audio = audio || new (window.AudioContext || window.webkitAudioContext)();
    if (audio.state === "suspended") audio.resume();
    const t = audio.currentTime + (quand || 0), o = audio.createOscillator(), g = audio.createGain();
    o.type = type || "sine"; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(volume || 0.06, t); g.gain.exponentialRampToValueAtTime(0.0001, t + duree);
    o.connect(g); g.connect(audio.destination); o.start(t); o.stop(t + duree + 0.02);
  } catch (e) {}
}
const sons = {
  clic() { note(520, 0.06, "triangle", 0.05); },
  tic(i) { note(700 + (i % 4) * 90, 0.035, "square", 0.03); },
  arrivee() { note(660, 0.1, "triangle", 0.06); note(990, 0.2, "triangle", 0.06, 0.1); },
  bon() { note(659, 0.14, "triangle", 0.07); note(784, 0.14, "triangle", 0.07, 0.12); note(1047, 0.32, "triangle", 0.07, 0.24); },
  moyen() { note(659, 0.14, "triangle", 0.07); note(880, 0.28, "triangle", 0.07, 0.13); },
  rate() { note(196, 0.3, "sine", 0.07); note(165, 0.4, "sine", 0.07, 0.18); },
  tambour() { for (let i = 0; i < 8; i++) note(110 + i * 6, 0.07, "triangle", 0.05, i * 0.09); },
  fin() { [523, 659, 784, 1047].forEach((f, i) => note(f, 0.3, "triangle", 0.06, i * 0.13)); }
};
function majSon() {
  const b = $("son"); if (!b) return;
  b.setAttribute("aria-pressed", sonActif); b.setAttribute("aria-label", sonActif ? "Son activé" : "Son coupé");
  b.querySelector("use").setAttribute("href", sonActif ? "#i-son" : "#i-muet");
  const t = b.querySelector(".lib"); if (t) t.textContent = sonActif ? "Son : activé" : "Son : coupé";
}

/* ---------- Écrans, alertes, animations ---------- */
let ecranActuel = "";
const ecouteursEcran = [];
function ecran(nom) {
  ecranActuel = nom;
  document.querySelectorAll(".screen").forEach(s => s.classList.toggle("on", s.id === "s-" + nom));
  ecouteursEcran.forEach(f => f(nom));
  if (typeof Eveil !== "undefined") Eveil.regler(Entete.ecransQuitter.includes(nom));
  window.scrollTo(0, 0);
}
function alerte(id, texte) {
  const e = $(id); if (!e) return;
  const avant = e.textContent;
  e.textContent = texte || ""; e.style.display = texte ? "" : "none";
  if (texte && texte !== avant) rejouerAnim(e, "secoue");
}
function rejouerAnim(el, cls) { if (!el) return; el.classList.remove(cls); void el.getBoundingClientRect(); el.classList.add(cls); }
// Petit chiffre qui défile comme un rouleau avant de s'arrêter sur la bonne valeur.
function rouleau(el, valeurs, fin, garde, apres) {
  if (reduit) { el.textContent = fin; apres && apres(); return; }
  const delais = [40, 40, 45, 45, 50, 55, 65, 75, 90, 110, 135, 165, 200];
  let i = Math.floor(Math.random() * valeurs.length), e = 0;
  (function suivant() {
    if (garde && !garde()) return;
    if (e < delais.length) { el.textContent = valeurs[i++ % valeurs.length]; rejouerAnim(el, "tic"); sons.tic(e); setTimeout(suivant, delais[e++]); }
    else { el.textContent = fin; rejouerAnim(el, "tic"); apres && apres(); }
  })();
}
function compteur(el, de, a) {
  if (reduit || de >= a) { el.textContent = a; return; }
  let v = de;
  (function pas() { v++; el.textContent = v; rejouerAnim(el, "roule"); if (v < a) setTimeout(pas, 150); })();
}

/* ---------- Chrono : une mèche qui se consume ---------- */
const Chrono = {
  el: null, fin: 0, total: 0, minu: null, surFin: null, dernier: -1,
  monter(el) { this.el = el; el.className = "chrono"; el.innerHTML = '<div class="chrono-meche"><div class="chrono-feu"></div></div><b class="chrono-n"></b>'; el.style.display = "none"; },
  lancer(sec, surFin) {
    this.arreter();
    if (!sec || !this.el) return;
    this.total = sec * 1000; this.fin = Date.now() + this.total; this.surFin = surFin; this.dernier = -1;
    this.el.style.display = ""; this.el.classList.remove("urgent");
    this.minu = setInterval(() => this.tic(), 100); this.tic();
  },
  tic() {
    const reste = Math.max(0, this.fin - Date.now()), s = Math.ceil(reste / 1000);
    this.el.querySelector(".chrono-feu").style.width = (reste / this.total * 100).toFixed(1) + "%";
    this.el.querySelector(".chrono-n").textContent = s;
    if (s !== this.dernier) { this.dernier = s; if (s <= 5 && s > 0) { this.el.classList.add("urgent"); sons.tic(s); } }
    if (reste <= 0) { const f = this.surFin; this.arreter(true); f && f(); }
  },
  arreter(garder) { clearInterval(this.minu); this.minu = null; this.surFin = null; if (this.el && !garder) this.el.style.display = "none"; }
};

/* ---------- Moments forts de la fin de partie ---------- */
// badges : [{ titre, qui, detail, av }]
function dessinerBadges(el, badges) {
  el.textContent = "";
  badges.filter(Boolean).forEach((b, i) => {
    const d = document.createElement("div"); d.className = "badge case" + (i % 2 ? "" : " jaune");
    d.style.setProperty("--r", (i % 2 ? 1.2 : -1.2) + "deg");
    d.innerHTML = `<span class="badge-titre">${echapper(b.titre)}</span><span class="badge-qui">${b.av ? Avatar.svg(b.av, 30) : ""}${echapper(b.qui || "")}</span><span class="badge-detail">${echapper(b.detail || "")}</span>`;
    el.append(d);
  });
  el.style.display = el.children.length ? "" : "none";
}

/* ---------- Fenêtres (règles, confirmation) ---------- */
let focusAvant = null;
function ouvrir(id) { focusAvant = document.activeElement; $(id).hidden = false; sons.clic(); const b = $(id).querySelector("button"); if (b) b.focus(); }
function fermer(id) { $(id).hidden = true; if (focusAvant && focusAvant.focus) focusAvant.focus(); }
function copier(texte, bouton, ok) {
  const lab = bouton.lastChild, avant = lab.textContent;
  const fini = () => { lab.textContent = ok; setTimeout(() => { lab.textContent = avant; }, 1600); sons.clic(); };
  try { navigator.clipboard.writeText(texte).then(fini, fini); } catch (e) { fini(); }
}
// Inviter : la feuille de partage du téléphone (SMS, WhatsApp…), sinon le lien est copié.
function inviter(titre, lien, code, bouton) {
  sons.clic();
  if (navigator.share && matchMedia("(pointer:coarse)").matches) { navigator.share({ title: titre, text: "Rejoins mon salon " + code + " :", url: lien }).catch(() => {}); return; }
  copier(lien, bouton, "Lien copié !");
}
// En-tête : à gauche un bouton « retour » qui s'adapte à l'écran (maison, flèche ou croix),
// à droite le menu ☰ (règles, son, musique, tous les jeux, quitter).
// retours : { écran: fonction } pour une flèche ; un écran de ecransQuitter donne la croix ; sinon la maison.
const Entete = { quitter: null, texteQuitter: () => "La partie en cours sera perdue.", ecransQuitter: [], retours: {} };
function demanderQuitter() { $("quitter-texte").textContent = Entete.texteQuitter(); ouvrir("m-quitter"); }
function majRetour(nom) {
  const b = $("retour"); if (!b) return;
  const quitte = Entete.ecransQuitter.includes(nom), f = Entete.retours[nom];
  const icone = quitte ? "quitter" : f ? "retour" : "maison";
  b.querySelector("use").setAttribute("href", "#i-" + icone);
  b.setAttribute("aria-label", quitte ? "Quitter" : f ? "Retour" : "Tous les jeux");
  b.onclick = () => { sons.clic(); if (quitte) demanderQuitter(); else if (f) f(); else location.href = RACINE; };
  if ($("sortir")) $("sortir").style.display = quitte ? "" : "none";
}
function brancherEntete() {
  if ($("son")) { majSon(); $("son").onclick = () => { sonActif = !sonActif; memo.ecrire("cadran-son", sonActif ? "1" : "0"); majSon(); sons.clic(); }; }
  const dansMenu = f => () => { if ($("m-menu") && !$("m-menu").hidden) $("m-menu").hidden = true; f(); };
  if ($("aide")) $("aide").onclick = dansMenu(() => ouvrir("m-regles"));
  if ($("fermer-regles")) $("fermer-regles").onclick = () => { sons.clic(); fermer("m-regles"); };
  if ($("ouvrir-menu")) $("ouvrir-menu").onclick = () => ouvrir("m-menu");
  if ($("fermer-menu")) $("fermer-menu").onclick = () => { sons.clic(); fermer("m-menu"); };
  if ($("sortir")) {
    $("sortir").onclick = dansMenu(demanderQuitter);
    $("quitter-non").onclick = () => { sons.clic(); fermer("m-quitter"); };
    $("quitter-oui").onclick = () => { sons.clic(); $("m-quitter").hidden = true; Entete.quitter && Entete.quitter(); };
  }
  ecouteursEcran.push(majRetour);
  document.querySelectorAll(".modale").forEach(m => m.addEventListener("click", e => { if (e.target === m) fermer(m.id); }));
  addEventListener("keydown", e => { if (e.key === "Escape") document.querySelectorAll(".modale:not([hidden])").forEach(m => fermer(m.id)); });
  const logo = document.querySelector("h1");
  if (logo) logo.addEventListener("click", () => { logo.style.transform = "rotate(-3deg) scale(1.08)"; setTimeout(() => { logo.style.transform = ""; }, 150); });
}
// Le menu ☰ (même contenu dans tous les jeux)
const MENU_HTML = () => `
<div class="modale feuille" id="m-menu" hidden role="dialog" aria-modal="true" aria-label="Menu">
  <div class="case menu">
    <button class="item" id="aide" type="button">${ico("aide")}<span class="lib">Règles du jeu</span></button>
    <button class="item" id="son" type="button" aria-pressed="true">${ico("son")}<span class="lib">Son : activé</span></button>
    <button class="item" id="musique" type="button" aria-pressed="false" style="display:none">${ico("musique")}<span class="lib">Musique : coupée</span></button>
    <a class="item" id="maison" href="${RACINE}">${ico("maison")}<span class="lib">Tous les jeux</span></a>
    <button class="item rouge" id="sortir" type="button" style="display:none">${ico("quitter")}<span class="lib">Quitter la partie</span></button>
    <button class="btn plat" id="fermer-menu" type="button">Fermer</button>
  </div>
</div>`;
function majMusique(on) { const b = $("musique"); if (!b) return; b.setAttribute("aria-pressed", on); const t = b.querySelector(".lib"); if (t) t.textContent = on ? "Musique : activée" : "Musique : coupée"; }

/* ---------- Chargements à la demande ---------- */
const charges = {};
function charger(fichier, globale) {
  if (window[globale]) return Promise.resolve();
  if (!charges[fichier]) charges[fichier] = new Promise((ok, ko) => {
    const sc = document.createElement("script");
    sc.src = RACINE + fichier; sc.async = true;
    sc.onload = ok; sc.onerror = () => { delete charges[fichier]; sc.remove(); ko(); };
    document.head.append(sc);
  });
  return charges[fichier];
}
const chargerTempsReel = () => charger("realtime.min.js?v=2", "RealtimeClient");
async function dessinerQR(el, texte) {
  try {
    await charger("qrcode.min.js?v=1", "qrcode");
    const q = window.qrcode(0, "M"); q.addData(texte); q.make();
    el.innerHTML = q.createSvgTag({ cellSize: 6, margin: 2, scalable: true });
  } catch (e) { el.textContent = ""; }
}

/* =====================================================================
   SALON EN LIGNE (Supabase temps réel, rien n'est stocké)
   Rôles : "hote" = crée le salon et joue ; "ecran" = crée le salon et
   affiche seulement (télé, ordi) ; "invite" = rejoint avec le code.
   Celui qui a créé le salon (hôte ou écran) décide du déroulé.
   ===================================================================== */
const SUPA_URL = "wss://cbbnrdfvaaikawszaysu.supabase.co/realtime/v1";
const SUPA_CLE = "sb_publishable_rfB8KSptjcdTpp8QxvST9A_UlpQ8rW0";
const LETTRES = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const nouveauCode = () => Array.from({ length: 4 }, () => LETTRES[Math.floor(Math.random() * LETTRES.length)]).join("");
const NOMS_JEUX = { cadran: "Le Cadran", imposteur: "L'Imposteur", "plus-ou-moins": "Plus ou moins", gribouillage: "Le Gribouillage" };

const Salon = {
  client: null, canal: null, code: "", nom: "", role: "", jeu: "", max: 8, t: 0,
  id: (() => { try { let v = sessionStorage.getItem("jeux-id"); if (!v) { v = Math.random().toString(36).slice(2, 10); sessionStorage.setItem("jeux-id", v); } return v; } catch (e) { return Math.random().toString(36).slice(2, 10); } })(),
  gens: [], cles: new Set(), dernier: {}, minuteur: null, av: null, avaitChef: false, minuFermeture: null,
  ordre: [], // types de messages à renvoyer, dans l'ordre, à quelqu'un qui arrive
  remise: [], // types qui effacent les anciens messages gardés (nouvelle partie, retour au salon)
  surMessage: () => {}, surGens: () => {}, surErreur: () => {}, surCode: () => {},
  actif() { return !!this.canal; },
  autorite() { return this.role === "hote" || this.role === "ecran"; },
  joueurs() { return this.gens.filter(g => g.role !== "ecran"); },
  present(id) { return this.gens.some(g => g.cle === id); },
  lien() { return RACINE + this.jeu + "/#" + this.code; },
  async creer(jeu, nom, role, max) { await chargerTempsReel(); this.jeu = jeu; this.max = max; this.ouvrir(nouveauCode(), role, nom); },
  async rejoindre(jeu, nom, code, max) { await chargerTempsReel(); this.jeu = jeu; this.max = max; this.ouvrir(code, "invite", nom); },
  ouvrir(code, role, nom, t) {
    this.quitter(true);
    this.code = code; this.role = role; this.nom = nom; this.t = t || Date.now(); this.gens = []; this.cles = new Set(); this.dernier = {};
    this.av = typeof Avatar !== "undefined" ? Avatar.lire() : null; this.avaitChef = false;
    this.client = this.client || new window.RealtimeClient(SUPA_URL, { params: { apikey: SUPA_CLE, eventsPerSecond: 12 }, accessToken: async () => SUPA_CLE });
    const canal = this.client.channel("jeux-" + code, { config: { broadcast: { self: false }, presence: { key: this.id } } });
    this.canal = canal;
    canal.on("broadcast", { event: "m" }, ({ payload }) => {
      if (this.canal !== canal || !payload || typeof payload.t !== "string") return;
      if (payload.t === "rattrapage?") { if (this.autorite()) this.rattraper(); return; } // quelqu'un revient après avoir rechargé sa page
      this.surMessage(payload);
    })
      .on("presence", { event: "sync" }, () => { if (this.canal === canal) this.majPresence(); })
      .subscribe(etat => {
        if (this.canal !== canal) return;
        if (etat === "SUBSCRIBED") {
          this.suivre();
          if (this.reprise) { // retour après un rechargement de la page (ou un changement de jeu)
            setTimeout(() => { this.reprise = false; }, 16000);
            if (role === "invite") setTimeout(() => { if (this.canal === canal) this.envoyer({ t: "rattrapage?" }); }, 600);
            else setTimeout(() => { if (this.canal === canal) this.rattraper(); }, 600);
          }
          if (role === "invite") { clearTimeout(this.minuteur); this.minuteur = setTimeout(() => { if (this.canal === canal && !this.gens.some(g => g.role !== "invite")) this.erreur("Aucun salon ouvert avec le code " + code + "."); }, this.reprise ? 15000 : 4500); }
        } else if (etat === "CHANNEL_ERROR" || etat === "TIMED_OUT") {
          if (!this.gens.length) this.erreur("Connexion impossible pour le moment. Réessaie dans un instant.");
        }
      });
    this.surCode(code);
  },
  // Renvoie à tout le monde l'état utile de la partie (pour ceux qui arrivent ou reviennent).
  rattraper() { this.ordre.forEach(t => { if (this.dernier[t]) this.envoyer(this.dernier[t]); }); this.surRattrapage(); },
  surRattrapage: () => {},
  suivre() { try { this.canal.track({ nom: this.nom, role: this.role, t: this.t, jeu: this.jeu, av: this.av }); } catch (e) {} },
  quitter(silencieux) {
    clearTimeout(this.minuteur); clearTimeout(this.minuFermeture); this.minuFermeture = null;
    if (this.canal && this.client) { const c = this.canal, client = this.client; client.removeChannel(c).catch(() => {}).finally(() => { if (!this.canal && client.getChannels().length === 0) client.disconnect(); }); }
    this.canal = null; this.gens = []; this.cles = new Set(); this.dernier = {};
    if (!silencieux) { this.role = ""; Reprise.effacer(); }
  },
  erreur(msg) { this.quitter(); this.surErreur(msg); },
  envoyer(m, important) {
    if (!this.canal) return;
    if (important) { if (this.remise.includes(m.t)) this.dernier = {}; this.dernier[m.t] = m; }
    try { this.canal.send({ type: "broadcast", event: "m", payload: m }); } catch (e) {}
  },
  majPresence() {
    const etat = this.canal.presenceState(), tous = [];
    Object.keys(etat).forEach(cle => (etat[cle] || []).forEach(m => tous.push({ cle, nom: String(m.nom || "?").slice(0, 14), role: m.role, t: m.t, jeu: m.jeu, av: typeof Avatar !== "undefined" && Avatar.valide(m.av) ? m.av : null })));
    const tri = l => l.sort((a, b) => a.t - b.t || (a.cle < b.cle ? -1 : 1));
    const chefs = tri(tous.filter(g => g.role === "hote" || g.role === "ecran")), invites = tri(tous.filter(g => g.role === "invite"));
    const chef = chefs[0] || null;
    if (this.autorite() && chef && chef.cle !== this.id) { this.ouvrir(nouveauCode(), this.role, this.nom); return; } // code déjà pris
    if (this.role === "invite" && chef && chef.jeu && chef.jeu !== this.jeu && chef.jeu !== "salon" && this.jeu !== "salon" && !this.reprise) { location.href = RACINE + chef.jeu + "/#" + this.code; return; }
    if (this.role === "invite" && this.jeu === "salon" && chef && chef.jeu && chef.jeu !== "salon" && !this.reprise) { allerVers(chef.jeu); return; }
    const places = chef && chef.role === "ecran" ? this.max : this.max - 1;
    if (this.role === "invite" && invites.findIndex(g => g.cle === this.id) >= places) { this.erreur("Ce salon est complet : " + this.max + " joueurs maximum."); return; }
    // même pseudo qu'un joueur arrivé avant : seul le dernier arrivé ajoute un numéro (sinon ils se renommeraient en boucle)
    const avantMoi = g => g.t < this.t || (g.t === this.t && g.cle < this.id);
    if (this.role === "invite" && tous.some(g => g.cle !== this.id && g.nom.toLowerCase() === this.nom.toLowerCase() && avantMoi(g))) {
      const pris = new Set(tous.filter(g => g.cle !== this.id).map(g => g.nom.toLowerCase())), base = this.nom.replace(/ \d+$/, "").slice(0, 11);
      let k = 2; while (pris.has((base + " " + k).toLowerCase())) k++;
      this.nom = base + " " + k; this.suivre();
    }
    this.gens = (chef ? [chef] : []).concat(invites.slice(0, places));
    const avant = this.cles, nouveaux = this.gens.filter(g => g.cle !== this.id && !avant.has(g.cle));
    const partis = [...avant].filter(c => !this.gens.some(g => g.cle === c));
    this.cles = new Set(this.gens.map(g => g.cle));
    if (chef) clearTimeout(this.minuteur);
    // celui qui a créé le salon est parti : on lui laisse quelques secondes pour revenir, puis le salon ferme pour tout le monde
    if (this.role === "invite") {
      if (chef) { this.avaitChef = true; clearTimeout(this.minuFermeture); this.minuFermeture = null; }
      else if (this.avaitChef && !this.minuFermeture) this.minuFermeture = setTimeout(() => { this.minuFermeture = null; if (!this.gens.some(g => g.role !== "invite")) this.erreur("Le salon est fermé : celui qui l'a créé est parti."); }, 8000);
    }
    if (nouveaux.length) { // rattrapage : on renvoie l'état utile à ceux qui arrivent
      sons.arrivee();
      this.rattraper();
    }
    this.surGens(nouveaux, partis);
  },
  // Pour la page d'accueil : trouver à quel jeu appartient un code, sans entrer dans le salon.
  async decouvrir(code) {
    await chargerTempsReel();
    this.client = this.client || new window.RealtimeClient(SUPA_URL, { params: { apikey: SUPA_CLE, eventsPerSecond: 12 }, accessToken: async () => SUPA_CLE });
    return new Promise(ok => {
      const canal = this.client.channel("jeux-" + code, { config: { presence: { key: "x" + this.id } } });
      let fini = false;
      const finir = jeu => { if (fini) return; fini = true; clearTimeout(minu); this.client.removeChannel(canal).catch(() => {}); ok(jeu); };
      const minu = setTimeout(() => finir(null), 4500);
      canal.on("presence", { event: "sync" }, () => {
        const etat = canal.presenceState();
        Object.keys(etat).forEach(c => (etat[c] || []).forEach(m => { if ((m.role === "hote" || m.role === "ecran") && m.jeu) finir(m.jeu); }));
      }).subscribe();
    });
  }
};
// Reprise : si la page est rechargée en plein salon, on garde de quoi y revenir (dans cet onglet seulement).
const Reprise = {
  cle: "jeux-reprise", bloque: false,
  sauver() {
    if (this.bloque || !Salon.canal || !Salon.role) return;
    const chef = Salon.autorite(), o = typeof Lobby !== "undefined" && Lobby.o;
    const r = { jeu: Salon.jeu, code: Salon.code, role: Salon.role, nom: Salon.nom, t: Salon.t, quand: Date.now() };
    if (chef && o) { r.dernier = Salon.dernier; try { r.etat = o.etat ? o.etat() : null; } catch (e) { r.etat = null; } r.enPartie = !!(o.enPartie && o.enPartie()); }
    try { sessionStorage.setItem(this.cle, JSON.stringify(r)); } catch (e) {}
  },
  lire() { try { const r = JSON.parse(sessionStorage.getItem(this.cle) || "null"); return r && Date.now() - r.quand < 30 * 60e3 ? r : null; } catch (e) { return null; } },
  effacer() { try { sessionStorage.removeItem(this.cle); } catch (e) {} }
};
// Changer de jeu sans quitter le salon : tout le monde part vers le même jeu, avec le même code et le même rôle.
// "salon" = le salon de l'accueil, où l'on choisit le jeu.
function allerVers(jeu) {
  const r = { jeu, code: Salon.code, role: Salon.role, nom: Salon.nom, t: Salon.t, quand: Date.now() };
  try {
    if (jeu === "cadran") sessionStorage.setItem("cadran-reprise", JSON.stringify({ code: r.code, role: r.role, nom: r.nom, t: r.t, quand: r.quand, P: { phase: "", mode: "ligne", moi: r.role === "invite" ? 1 : 0, ecran: r.role === "ecran", format: "duo" } }));
    else sessionStorage.setItem(Reprise.cle, JSON.stringify(r));
  } catch (e) {}
  Reprise.bloque = true;
  location.href = RACINE + (jeu === "salon" ? "" : jeu + "/");
}
addEventListener("pagehide", () => { Reprise.sauver(); if (Salon.canal) { try { Salon.canal.untrack(); } catch (e) {} } });
addEventListener("pageshow", e => { if (e.persisted && Salon.canal) Salon.suivre(); });

// Liste des participants (salle d'attente ou bandeau de jeu).
function dessinerGens(ul, liste, options) {
  options = options || {};
  ul.textContent = "";
  liste.forEach(g => {
    const li = document.createElement("li"), sm = document.createElement("small");
    if (options.classe) { const c = options.classe(g); if (c) li.className = c; }
    sm.textContent = options.etiquette ? options.etiquette(g) : (g.role === "ecran" ? "Écran du salon" : g.role === "hote" ? "Hôte" : "Joueur") + (g.cle === Salon.id ? " · toi" : "");
    li.append(sm);
    const av = options.avatar ? options.avatar(g) : g.av;
    if (av && typeof Avatar !== "undefined") li.insertAdjacentHTML("beforeend", Avatar.svg(av, 24, ' style="vertical-align:-6px;margin-right:6px"'));
    else if (options.couleur) { const i = document.createElement("i"); i.style.background = options.couleur(g); li.append(i); }
    li.append(document.createTextNode(g.nom));
    if (options.score) { const em = document.createElement("em"); em.textContent = options.score(g); li.append(em); }
    ul.append(li);
  });
  if (options.vides) for (let i = liste.length; i < options.vides; i++) { const li = document.createElement("li"), sm = document.createElement("small"); li.className = "vide"; sm.textContent = "Place libre"; li.append(sm, document.createTextNode("En attente…")); ul.append(li); }
}
const COULEURS = ["#19B5F0", "#9B5CFF", "#00C46A", "#FF4FB0", "#FF8A00", "#FFFFFF", "#FFE600", "#7A4A2B"];

/* =====================================================================
   SALLE D'ATTENTE COMMUNE
   En-tête, choix du mode (appareil / en ligne / salon grand écran),
   création ou entrée dans un salon, liste des joueurs, lancement.
   Chaque jeu fournit ses réglages et ses callbacks.
   ===================================================================== */
const Lobby = {
  o: null,
  monter(o) {
    this.o = o;
    const app = $("app");
    app.insertAdjacentHTML("afterbegin", `
<header class="entete">
  <button class="btn icone" id="retour" type="button" aria-label="Tous les jeux">${ico("maison")}</button>
  <h1>${o.titre}</h1>
  <button class="btn icone" id="ouvrir-menu" type="button" aria-label="Menu">${ico("menu")}</button>
</header>
<section class="screen" id="s-modes">
  <div class="case jaune couverture">${o.couverture}
    <button class="lien-regles" id="voir-regles" type="button">${ico("aide")}Lire les règles</button>
  </div>
  <h3 class="intertitre">Comment vous jouez ?</h3>
  <div class="modes">
    <button class="mode" id="go-local" type="button"><span class="mode-ico jaune">${ico("tel")}</span><span class="mode-txt"><b>Un seul téléphone</b><small>${o.texteLocal}</small></span>${ico("chevron")}</button>
    <button class="mode" id="go-ligne" type="button"><span class="mode-ico rouge">${ico("gens")}</span><span class="mode-txt"><b>Chacun son téléphone</b><small>On se retrouve avec un code.</small></span>${ico("chevron")}</button>
    <button class="mode" id="go-salon" type="button"><span class="mode-ico noir">${ico("tele")}</span><span class="mode-txt"><b>Télé + téléphones</b><small>La télé affiche le jeu, les téléphones jouent.</small></span>${ico("chevron")}</button>
  </div>
  <div class="case code-rapide">
    <label for="code-rapide">On t'a donné un code ?</label>
    <div class="rangee"><input type="text" id="code-rapide" class="champ-code" maxlength="4" autocomplete="off" autocapitalize="characters" placeholder="ABCD"><button class="btn jaune" id="go-code" type="button" aria-label="Rejoindre">${ico("suite")}</button></div>
  </div>
</section>
<section class="screen" id="s-ligne">
  <h2>Chacun son téléphone</h2>
  <div class="case identite">
    <div><label for="pseudo">Ton pseudo</label><input type="text" id="pseudo" maxlength="14" autocomplete="off" placeholder="Pseudo"></div>
    <div><label>Ton avatar</label><div id="choix-avatar"></div></div>
  </div>
  <p class="bandeau alerte" id="err-ligne" role="alert" style="display:none"></p>
  <button class="btn" id="creer" type="button">${ico("plus")}CRÉER UN SALON</button>
  <div class="ou"><span>ou</span></div>
  <div class="rangee">
    <input type="text" id="code-saisi" class="champ-code" maxlength="4" autocomplete="off" autocapitalize="characters" placeholder="ABCD" aria-label="Code du salon">
    <button class="btn jaune" id="rejoindre" type="button">REJOINDRE</button>
  </div>
</section>
<section class="screen" id="s-salon">
  <div class="case jaune bloc-code" id="bloc-code">
    <div class="qr" id="qr" style="display:none"></div>
    <div class="code-zone">
      <div class="petit" id="titre-salon">Code du salon</div>
      <div class="code" id="code-salon"></div>
      <p class="adresse" id="adresse" style="display:none"></p>
    </div>
    <button class="btn plat" id="inviter" type="button">${ico("partager")}<span>Inviter</span></button>
  </div>
  <div>
    <h3 class="intertitre">Dans le salon <span class="compte" id="etat-salon" role="status"></span></h3>
    <ul class="gens grille" id="gens-salon"></ul>
  </div>
  <div id="place-reglages"></div>
  <div class="case" id="resume-invite" style="display:none"></div>
  <div class="barre-bas">
    <p class="bandeau alerte" id="err-salon" role="alert" style="display:none"></p>
    <button class="btn" id="lancer" type="button">${ico("suite")}LANCER LA PARTIE</button>
    <button class="btn plat" id="changer-jeu" type="button">${ico("maison")}Changer de jeu</button>
    <p class="bandeau centre" id="attente-hote" style="display:none"></p>
  </div>
</section>`);
    document.body.insertAdjacentHTML("beforeend", MENU_HTML() + `
<div class="modale" id="m-regles" hidden role="dialog" aria-modal="true" aria-labelledby="t-regles">
  <div class="case"><h3 id="t-regles">Les règles</h3>${o.regles}<button class="btn" id="fermer-regles" type="button">C'EST PARTI !</button></div>
</div>
<div class="modale" id="m-quitter" hidden role="dialog" aria-modal="true" aria-labelledby="t-quitter">
  <div class="case jaune"><h3 id="t-quitter">Quitter ?</h3><p id="quitter-texte"></p>
    <div class="rang-btn"><button class="btn" id="quitter-oui" type="button">OUI</button><button class="btn plat" id="quitter-non" type="button">Non, je reste</button></div>
  </div>
</div>`);
    if ($("reglages-jeu")) $("place-reglages").append($("reglages-jeu"));
    Entete.ecransQuitter = ["salon"].concat(o.ecransJeu || []);
    const versModes = () => ecran("modes");
    Entete.retours = Object.assign({ ligne: versModes, local: versModes }, o.retours || {});
    Entete.texteQuitter = () => Salon.actif() ? "Tu vas quitter le salon " + Salon.code + "." + (Salon.autorite() ? " Comme c'est toi qui l'as créé, la partie s'arrêtera pour tout le monde." : "") : "La partie en cours sera perdue.";
    Entete.quitter = () => this.sortir();
    brancherEntete();
    $("voir-regles").onclick = () => ouvrir("m-regles");
    if (typeof Avatar !== "undefined") Avatar.choisisseur($("choix-avatar"), av => { Salon.av = av; });
    $("musique").onclick = () => { majMusique(Musique.basculer()); };
    $("go-local").onclick = () => { sons.clic(); o.surLocal(); };
    $("go-ligne").onclick = () => { sons.clic(); chargerTempsReel().catch(() => {}); $("pseudo").value = $("pseudo").value || pseudo.lire(); alerte("err-ligne"); ecran("ligne"); };
    $("go-salon").onclick = () => this.creer("ecran");
    const codeRapide = () => {
      const code = $("code-rapide").value.trim().toUpperCase();
      if (!/^[A-Z]{4}$/.test(code)) { $("code-rapide").focus(); rejouerAnim($("code-rapide"), "secoue"); return; }
      sons.clic(); $("code-saisi").value = code; $("pseudo").value = $("pseudo").value || pseudo.lire(); alerte("err-ligne"); ecran("ligne");
      if ($("pseudo").value) this.rejoindre(); else { alerte("err-ligne", "Choisis un pseudo, puis appuie sur REJOINDRE."); $("pseudo").focus(); }
    };
    $("go-code").onclick = codeRapide;
    $("code-rapide").addEventListener("keydown", e => { if (e.key === "Enter") codeRapide(); });
    $("creer").onclick = () => this.creer("hote");
    $("rejoindre").onclick = () => this.rejoindre();
    $("code-saisi").addEventListener("keydown", e => { if (e.key === "Enter") this.rejoindre(); });
    $("changer-jeu").onclick = () => { sons.clic(); Salon.envoyer({ t: "aller", jeu: "salon" }); setTimeout(() => allerVers("salon"), 350); };
    $("inviter").onclick = e => inviter(this.o.titreJeu || document.title, Salon.lien(), Salon.code, e.currentTarget);
    $("lancer").onclick = () => this.lancer();
    Salon.ordre = ["salon", "reglages"].concat(o.ordre || []);
    Salon.remise = ["salon"].concat(o.remise || []);
    Salon.surCode = code => { $("code-salon").textContent = code; if (Salon.role === "ecran") { $("adresse").textContent = RACINE.replace(/^https?:\/\//, "") + " → code " + code; dessinerQR($("qr"), Salon.lien()); } };
    Salon.surErreur = msg => { this.arret(); $("pseudo").value = $("pseudo").value || pseudo.lire(); ecran("ligne"); alerte("err-ligne", msg); };
    Salon.surMessage = m => this.recevoir(m);
    Salon.surGens = (nouveaux, partis) => this.majGens(nouveaux, partis);
    Salon.surRattrapage = () => { o.surRattrapage && o.surRattrapage(); };
    ecran("modes");
    if (!this.reprendre()) this.lienInvitation();
  },
  async creer(role) {
    let nom = "Écran";
    if (role === "hote") { nom = $("pseudo").value.trim(); if (!nom) { alerte("err-ligne", "Choisis d'abord un pseudo."); return; } pseudo.ecrire(nom); }
    sons.clic();
    try { await Salon.creer(this.o.jeu, nom, role, this.o.max); }
    catch (e) { ecran("ligne"); alerte("err-ligne", "Le mode en ligne n'a pas pu se charger. Vérifie ta connexion et réessaie."); return; }
    document.body.classList.toggle("tele", role === "ecran");
    $("musique").style.display = role === "ecran" ? "" : "none";
    if (role === "ecran" && Musique.voulue()) { Musique.demarrer(); majMusique(true); }
    this.ouvrirSalon();
  },
  async rejoindre() {
    const nom = $("pseudo").value.trim();
    if (!nom) { alerte("err-ligne", "Choisis d'abord un pseudo."); $("pseudo").focus(); return; }
    const code = $("code-saisi").value.trim().toUpperCase();
    if (!/^[A-Z]{4}$/.test(code)) { alerte("err-ligne", "Le code d'un salon fait 4 lettres."); return; }
    pseudo.ecrire(nom); sons.clic(); alerte("err-ligne", "Connexion au salon " + code + "…");
    try { await Salon.rejoindre(this.o.jeu, nom, code, this.o.max); }
    catch (e) { alerte("err-ligne", "Le mode en ligne n'a pas pu se charger. Vérifie ta connexion et réessaie."); }
  },
  ouvrirSalon(texteInvite) {
    const chef = Salon.autorite(), tele = Salon.role === "ecran";
    $("titre-salon").textContent = tele ? "Scannez ou tapez le code" : "Code du salon";
    $("qr").style.display = tele ? "" : "none"; $("adresse").style.display = tele ? "" : "none";
    $("inviter").style.display = tele ? "none" : "";
    $("place-reglages").style.display = chef ? "" : "none";
    $("lancer").style.display = chef ? "" : "none"; $("changer-jeu").style.display = chef ? "" : "none";
    $("attente-hote").style.display = chef ? "none" : "";
    $("resume-invite").style.display = chef ? "none" : "";
    if (!chef) $("resume-invite").textContent = texteInvite || $("resume-invite").textContent || "L'hôte règle la partie…";
    alerte("err-salon"); this.majListe(); this.envoyerReglages(); ecran("salon");
  },
  sortir() { Salon.quitter(); this.arret(); ecran("modes"); },
  arret() { document.body.classList.remove("tele"); Musique.arreter(); majMusique(false); $("musique").style.display = "none"; this.o.surArret && this.o.surArret(); },
  majListe() {
    const joueurs = Salon.joueurs().length, min = this.o.min, chefG = Salon.gens.find(g => g.role !== "invite");
    $("attente-hote").textContent = chefG && chefG.role === "hote" ? "En attente de " + chefG.nom + "…" : "La partie se lance depuis la télé…";
    dessinerGens($("gens-salon"), Salon.gens.length ? Salon.gens : [{ cle: Salon.id, nom: Salon.nom, role: Salon.role, av: Salon.role === "ecran" ? null : Salon.av }], { avatar: g => g.role === "ecran" ? null : g.av });
    $("etat-salon").textContent = joueurs + " / " + this.o.max + (joueurs < min ? " · encore " + (min - joueurs) + " pour lancer" : "");
  },
  majGens(nouveaux, partis) {
    if (Salon.role === "invite" && ecranActuel === "ligne" && Salon.gens.some(g => g.role !== "invite")) { alerte("err-ligne"); this.ouvrirSalon(); }
    this.majListe();
    if (Salon.autorite() && nouveaux.length) this.envoyerReglages();
    this.o.surGens && this.o.surGens(nouveaux, partis);
  },
  // Les réglages de l'hôte s'affichent en direct chez les invités.
  envoyerReglages() { if (Salon.autorite() && Salon.actif() && !(this.o.enPartie && this.o.enPartie())) Salon.envoyer({ t: "reglages", texte: this.o.resume() }, true); },
  lancer() {
    const n = Salon.joueurs().length;
    if (n < this.o.min) { alerte("err-salon", "Il faut au moins " + this.o.min + " joueurs (vous êtes " + n + "). Donne le code " + Salon.code + " aux autres."); return; }
    alerte("err-salon"); sons.clic(); this.o.surLancer();
  },
  retourSalon() { Salon.envoyer({ t: "salon" }, true); this.ouvrirSalon(); },
  spectateur() { this.ouvrirSalon(); $("resume-invite").textContent = "Une partie est en cours. Tu joueras à la prochaine !"; },
  recevoir(m) {
    if (m.t === "reglages") { if (!Salon.autorite() && typeof m.texte === "string") { $("resume-invite").textContent = m.texte; if (ecranActuel === "ligne") this.ouvrirSalon(m.texte); } return; }
    if (m.t === "aller" && typeof m.jeu === "string") { if (!Salon.autorite()) allerVers(m.jeu); return; }
    if (m.t === "salon") { if (!Salon.autorite()) { this.o.surRetourSalon && this.o.surRetourSalon(); this.ouvrirSalon(); } return; }
    this.o.surMessage(m);
  },
  // Page rechargée en plein salon : on y retourne avec le même rôle et le même pseudo.
  // Celui qui a créé le salon retrouve aussi la partie en cours (gardée juste avant le rechargement).
  reprendre() {
    const r = Reprise.lire(), h = /^#([A-Za-z]{4})$/.exec(location.hash);
    if (!r || r.jeu !== this.o.jeu || (h && h[1].toUpperCase() !== r.code)) return false;
    Reprise.effacer();
    try { history.replaceState(null, "", location.pathname); } catch (e) {}
    $("pseudo").value = r.role === "hote" || r.role === "invite" ? r.nom : $("pseudo").value; $("code-saisi").value = r.code;
    ecran("ligne"); alerte("err-ligne", "Connexion au salon " + r.code + "…");
    chargerTempsReel().then(() => {
      Salon.jeu = this.o.jeu; Salon.max = this.o.max; Salon.reprise = true;
      const chef = r.role !== "invite";
      if (chef && r.etat && this.o.restaurer) this.o.restaurer(r.etat);
      Salon.ouvrir(r.code, r.role, r.nom, r.t);
      if (!chef) return; // l'invité retrouve la partie grâce au rattrapage envoyé par le créateur
      Salon.dernier = r.dernier || {};
      if (r.role === "ecran") { document.body.classList.add("tele"); $("musique").style.display = ""; if (Musique.voulue()) { Musique.demarrer(); majMusique(true); } }
      alerte("err-ligne");
      if (r.enPartie && r.etat && this.o.reprendre) { try { this.o.reprendre(r.etat); return; } catch (e) { console.warn(e); } }
      this.ouvrirSalon();
    }).catch(() => alerte("err-ligne", "Le mode en ligne n'a pas pu se charger. Vérifie ta connexion et réessaie."));
    return true;
  },
  // Lien d'invitation (…/jeu/#ABCD) : on rejoint directement si le pseudo est connu.
  lienInvitation() {
    const m = /^#([A-Za-z]{4})$/.exec(location.hash);
    if (!m) return;
    try { history.replaceState(null, "", location.pathname); } catch (e) {}
    $("code-saisi").value = m[1].toUpperCase(); $("pseudo").value = pseudo.lire();
    ecran("ligne");
    if ($("pseudo").value) this.rejoindre(); else setTimeout(() => $("pseudo").focus(), 50);
  }
};
