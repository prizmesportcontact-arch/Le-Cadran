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
  vote: '<path d="M4 13.5h16v7H4z"/><path d="M8 13.5 12 4l5 2-3.5 7.5"/>'
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
}

/* ---------- Écrans, alertes, animations ---------- */
let ecranActuel = "";
const ecouteursEcran = [];
function ecran(nom) {
  ecranActuel = nom;
  document.querySelectorAll(".screen").forEach(s => s.classList.toggle("on", s.id === "s-" + nom));
  ecouteursEcran.forEach(f => f(nom));
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

/* ---------- Fenêtres (règles, confirmation) ---------- */
let focusAvant = null;
function ouvrir(id) { focusAvant = document.activeElement; $(id).hidden = false; sons.clic(); const b = $(id).querySelector("button"); if (b) b.focus(); }
function fermer(id) { $(id).hidden = true; if (focusAvant && focusAvant.focus) focusAvant.focus(); }
function copier(texte, bouton, ok) {
  const lab = bouton.lastChild, avant = lab.textContent;
  const fini = () => { lab.textContent = ok; setTimeout(() => { lab.textContent = avant; }, 1600); sons.clic(); };
  try { navigator.clipboard.writeText(texte).then(fini, fini); } catch (e) { fini(); }
}
// Branche l'en-tête standard (règles, son, quitter) si la page en a un.
const Entete = { quitter: null, texteQuitter: () => "La partie en cours sera perdue.", ecransQuitter: [] };
function brancherEntete() {
  if ($("son")) { majSon(); $("son").onclick = () => { sonActif = !sonActif; memo.ecrire("cadran-son", sonActif ? "1" : "0"); majSon(); sons.clic(); }; }
  if ($("aide")) $("aide").onclick = () => ouvrir("m-regles");
  if ($("fermer-regles")) $("fermer-regles").onclick = () => { sons.clic(); fermer("m-regles"); };
  if ($("sortir")) {
    $("sortir").onclick = () => { $("quitter-texte").textContent = Entete.texteQuitter(); ouvrir("m-quitter"); };
    $("quitter-non").onclick = () => { sons.clic(); fermer("m-quitter"); };
    $("quitter-oui").onclick = () => { sons.clic(); $("m-quitter").hidden = true; Entete.quitter && Entete.quitter(); };
    ecouteursEcran.push(nom => {
      const jeu = Entete.ecransQuitter.includes(nom);
      $("sortir").style.display = jeu ? "" : "none";
      if ($("maison")) $("maison").style.display = jeu ? "none" : ""; // en partie, la croix remplace la maison
    });
  }
  document.querySelectorAll(".modale").forEach(m => m.addEventListener("click", e => { if (e.target === m) fermer(m.id); }));
  addEventListener("keydown", e => { if (e.key === "Escape") document.querySelectorAll(".modale:not([hidden])").forEach(m => fermer(m.id)); });
  const logo = document.querySelector("h1");
  if (logo) logo.addEventListener("click", () => { logo.style.transform = "rotate(-3deg) scale(1.08)"; setTimeout(() => { logo.style.transform = ""; }, 150); });
}

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
const NOMS_JEUX = { cadran: "Le Cadran", imposteur: "L'Imposteur", "plus-ou-moins": "Plus ou moins" };

const Salon = {
  client: null, canal: null, code: "", nom: "", role: "", jeu: "", max: 8, t: 0,
  id: (() => { try { let v = sessionStorage.getItem("jeux-id"); if (!v) { v = Math.random().toString(36).slice(2, 10); sessionStorage.setItem("jeux-id", v); } return v; } catch (e) { return Math.random().toString(36).slice(2, 10); } })(),
  gens: [], cles: new Set(), dernier: {}, minuteur: null,
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
  ouvrir(code, role, nom) {
    this.quitter(true);
    this.code = code; this.role = role; this.nom = nom; this.t = Date.now(); this.gens = []; this.cles = new Set(); this.dernier = {};
    this.client = this.client || new window.RealtimeClient(SUPA_URL, { params: { apikey: SUPA_CLE, eventsPerSecond: 12 }, accessToken: async () => SUPA_CLE });
    const canal = this.client.channel("jeux-" + code, { config: { broadcast: { self: false }, presence: { key: this.id } } });
    this.canal = canal;
    canal.on("broadcast", { event: "m" }, ({ payload }) => { if (this.canal === canal && payload && typeof payload.t === "string") this.surMessage(payload); })
      .on("presence", { event: "sync" }, () => { if (this.canal === canal) this.majPresence(); })
      .subscribe(etat => {
        if (this.canal !== canal) return;
        if (etat === "SUBSCRIBED") {
          this.suivre();
          if (role === "invite") { clearTimeout(this.minuteur); this.minuteur = setTimeout(() => { if (this.canal === canal && !this.gens.some(g => g.role !== "invite")) this.erreur("Aucun salon ouvert avec le code " + code + "."); }, 4500); }
        } else if (etat === "CHANNEL_ERROR" || etat === "TIMED_OUT") {
          if (!this.gens.length) this.erreur("Connexion impossible pour le moment. Réessaie dans un instant.");
        }
      });
    this.surCode(code);
  },
  suivre() { try { this.canal.track({ nom: this.nom, role: this.role, t: this.t, jeu: this.jeu }); } catch (e) {} },
  quitter(silencieux) {
    clearTimeout(this.minuteur);
    if (this.canal && this.client) { const c = this.canal, client = this.client; client.removeChannel(c).catch(() => {}).finally(() => { if (!this.canal && client.getChannels().length === 0) client.disconnect(); }); }
    this.canal = null; this.gens = []; this.cles = new Set(); this.dernier = {};
    if (!silencieux) this.role = "";
  },
  erreur(msg) { this.quitter(); this.surErreur(msg); },
  envoyer(m, important) {
    if (!this.canal) return;
    if (important) { if (this.remise.includes(m.t)) this.dernier = {}; this.dernier[m.t] = m; }
    try { this.canal.send({ type: "broadcast", event: "m", payload: m }); } catch (e) {}
  },
  majPresence() {
    const etat = this.canal.presenceState(), tous = [];
    Object.keys(etat).forEach(cle => (etat[cle] || []).forEach(m => tous.push({ cle, nom: String(m.nom || "?").slice(0, 14), role: m.role, t: m.t, jeu: m.jeu })));
    const tri = l => l.sort((a, b) => a.t - b.t || (a.cle < b.cle ? -1 : 1));
    const chefs = tri(tous.filter(g => g.role === "hote" || g.role === "ecran")), invites = tri(tous.filter(g => g.role === "invite"));
    const chef = chefs[0] || null;
    if (this.autorite() && chef && chef.cle !== this.id) { this.ouvrir(nouveauCode(), this.role, this.nom); return; } // code déjà pris
    if (this.role === "invite" && chef && chef.jeu && chef.jeu !== this.jeu) { location.href = RACINE + chef.jeu + "/#" + this.code; return; }
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
    if (nouveaux.length) { // rattrapage : on renvoie l'état utile à ceux qui arrivent
      sons.arrivee();
      this.ordre.forEach(t => { if (this.dernier[t]) this.envoyer(this.dernier[t]); });
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
addEventListener("pagehide", () => { if (Salon.canal) { try { Salon.canal.untrack(); } catch (e) {} } });
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
    if (options.couleur) { const i = document.createElement("i"); i.style.background = options.couleur(g); li.append(i); }
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
<header>
  <h1>${o.titre}</h1>
  <nav class="nav" aria-label="Menu">
    <a class="btn icone" id="maison" href="${RACINE}" aria-label="Tous les jeux">${ico("maison")}</a>
    <button class="btn icone" id="aide" type="button" aria-label="Règles du jeu">${ico("aide")}</button>
    <button class="btn icone" id="son" type="button" aria-pressed="true" aria-label="Son activé">${ico("son")}</button>
    <button class="btn icone" id="sortir" type="button" aria-label="Quitter la partie" style="display:none">${ico("quitter")}</button>
  </nav>
</header>
<section class="screen" id="s-modes">
  <div class="case jaune couverture">${o.couverture}</div>
  <button class="btn plat" id="voir-regles" type="button">${ico("aide")}Les règles en 30 secondes</button>
  <div class="modes bas">
    <button class="btn jaune" id="go-local" type="button">${ico("tel")}<span>SUR CET APPAREIL<small>${o.texteLocal}</small></span></button>
    <button class="btn" id="go-ligne" type="button">${ico("gens")}<span>EN LIGNE<small>Chacun sur son téléphone, avec un code de salon.</small></span></button>
    <button class="btn plat" id="go-salon" type="button" style="min-height:64px;font-size:16px">${ico("tele")}<span>SALON GRAND ÉCRAN<small>Cet écran (télé, ordi) affiche le jeu. Tout le monde joue sur son téléphone.</small></span></button>
  </div>
</section>
<section class="screen" id="s-ligne">
  <h2>Jouer en ligne</h2>
  <div><label for="pseudo">Ton pseudo</label><input type="text" id="pseudo" maxlength="14" autocomplete="off" placeholder="Pseudo"></div>
  <button class="btn" id="creer" type="button">${ico("plus")}CRÉER UN SALON</button>
  <div class="case" style="display:flex;flex-direction:column;gap:10px">
    <label for="code-saisi" style="margin:0">Ou entre le code d'un salon</label>
    <input type="text" id="code-saisi" class="champ-code" maxlength="4" autocomplete="off" autocapitalize="characters" placeholder="ABCD">
    <button class="btn jaune" id="rejoindre" type="button">${ico("suite")}REJOINDRE</button>
  </div>
  <p class="bandeau alerte" id="err-ligne" role="alert" style="display:none"></p>
  <div class="bas"><button class="btn plat" id="retour-ligne" type="button">${ico("retour")}Retour</button></div>
</section>
<section class="screen" id="s-salon">
  <h2 id="titre-salon">Le salon</h2>
  <div class="case jaune" id="bloc-code">
    <div class="salon-tele">
      <div class="qr" id="qr" style="display:none"></div>
      <div>
        <div class="petit">Code du salon</div>
        <div class="code" id="code-salon"></div>
        <p class="adresse" id="adresse" style="display:none"></p>
      </div>
    </div>
    <div class="rang-btn" id="boutons-copier" style="margin-top:12px">
      <button class="btn plat" id="copier-code" type="button">${ico("copier")}Copier le code</button>
      <button class="btn plat" id="copier-lien" type="button">${ico("lien")}Copier le lien</button>
    </div>
  </div>
  <div><label>Dans le salon</label><ul class="gens" id="gens-salon"></ul><p class="petit" id="etat-salon" role="status" style="margin-top:8px"></p></div>
  <div id="place-reglages"></div>
  <div class="case" id="resume-invite" style="display:none"></div>
  <p class="bandeau alerte" id="err-salon" role="alert" style="display:none"></p>
  <div class="bas">
    <button class="btn" id="lancer" type="button">${ico("suite")}LANCER LA PARTIE</button>
    <button class="btn plat" id="quitter-salon" type="button">${ico("quitter")}Quitter le salon</button>
  </div>
</section>`);
    document.body.insertAdjacentHTML("beforeend", `
<div class="modale" id="m-regles" hidden role="dialog" aria-modal="true" aria-labelledby="t-regles">
  <div class="case"><h3 id="t-regles">Les règles</h3>${o.regles}<button class="btn" id="fermer-regles" type="button">C'EST PARTI !</button></div>
</div>
<div class="modale" id="m-quitter" hidden role="dialog" aria-modal="true" aria-labelledby="t-quitter">
  <div class="case jaune"><h3 id="t-quitter">Quitter la partie ?</h3><p id="quitter-texte"></p>
    <div class="rang-btn"><button class="btn" id="quitter-oui" type="button">OUI</button><button class="btn plat" id="quitter-non" type="button">Non, je reste</button></div>
  </div>
</div>`);
    if ($("reglages-jeu")) $("place-reglages").append($("reglages-jeu"));
    Entete.ecransQuitter = ["salon"].concat(o.ecransJeu || []);
    Entete.texteQuitter = () => Salon.actif() ? "Tu vas quitter le salon " + Salon.code + "." + (Salon.autorite() ? " Comme c'est toi qui l'as créé, la partie s'arrêtera pour tout le monde." : "") : "La partie en cours sera perdue.";
    Entete.quitter = () => this.sortir();
    brancherEntete();
    $("voir-regles").onclick = () => ouvrir("m-regles");
    $("go-local").onclick = () => { sons.clic(); o.surLocal(); };
    $("go-ligne").onclick = () => { sons.clic(); chargerTempsReel().catch(() => {}); $("pseudo").value = $("pseudo").value || pseudo.lire(); alerte("err-ligne"); ecran("ligne"); };
    $("go-salon").onclick = () => this.creer("ecran");
    $("creer").onclick = () => this.creer("hote");
    $("rejoindre").onclick = () => this.rejoindre();
    $("code-saisi").addEventListener("keydown", e => { if (e.key === "Enter") this.rejoindre(); });
    $("retour-ligne").onclick = () => { sons.clic(); ecran("modes"); };
    $("quitter-salon").onclick = () => { sons.clic(); this.sortir(); };
    $("copier-code").onclick = e => copier(Salon.code, e.currentTarget, "Copié !");
    $("copier-lien").onclick = e => copier(Salon.lien(), e.currentTarget, "Lien copié !");
    $("lancer").onclick = () => this.lancer();
    Salon.ordre = ["salon", "reglages"].concat(o.ordre || []);
    Salon.remise = ["salon"].concat(o.remise || []);
    Salon.surCode = code => { $("code-salon").textContent = code; if (Salon.role === "ecran") { $("adresse").textContent = RACINE.replace(/^https?:\/\//, "") + " → code " + code; dessinerQR($("qr"), Salon.lien()); } };
    Salon.surErreur = msg => { document.body.classList.remove("tele"); o.surArret && o.surArret(); ecran("ligne"); alerte("err-ligne", msg); };
    Salon.surMessage = m => this.recevoir(m);
    Salon.surGens = (nouveaux, partis) => this.majGens(nouveaux, partis);
    ecran("modes");
    this.lienInvitation();
  },
  async creer(role) {
    let nom = "Écran";
    if (role === "hote") { nom = $("pseudo").value.trim(); if (!nom) { alerte("err-ligne", "Choisis d'abord un pseudo."); return; } pseudo.ecrire(nom); }
    sons.clic();
    try { await Salon.creer(this.o.jeu, nom, role, this.o.max); }
    catch (e) { ecran("ligne"); alerte("err-ligne", "Le mode en ligne n'a pas pu se charger. Vérifie ta connexion et réessaie."); return; }
    document.body.classList.toggle("tele", role === "ecran");
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
    $("titre-salon").textContent = tele ? "Salon grand écran" : chef ? "Ton salon" : "Salon rejoint !";
    $("qr").style.display = tele ? "" : "none"; $("adresse").style.display = tele ? "" : "none";
    $("boutons-copier").style.display = chef ? "" : "none";
    $("place-reglages").style.display = chef ? "" : "none";
    $("lancer").style.display = chef ? "" : "none";
    $("resume-invite").style.display = chef ? "none" : "";
    if (!chef) $("resume-invite").textContent = texteInvite || $("resume-invite").textContent || "L'hôte règle la partie…";
    alerte("err-salon"); this.majListe(); this.envoyerReglages(); ecran("salon");
  },
  sortir() { Salon.quitter(); document.body.classList.remove("tele"); this.o.surArret && this.o.surArret(); ecran("modes"); },
  majListe() {
    const joueurs = Salon.joueurs().length, min = this.o.min;
    dessinerGens($("gens-salon"), Salon.gens.length ? Salon.gens : [{ cle: Salon.id, nom: Salon.nom, role: Salon.role }]);
    $("etat-salon").textContent = joueurs + " joueur" + (joueurs > 1 ? "s" : "") + " (de " + min + " à " + this.o.max + ")." + (joueurs < min ? " Il en manque " + (min - joueurs) + " pour lancer." : "");
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
    if (m.t === "salon") { if (!Salon.autorite()) { this.o.surRetourSalon && this.o.surRetourSalon(); this.ouvrirSalon(); } return; }
    this.o.surMessage(m);
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
