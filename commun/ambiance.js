"use strict";
/* =====================================================================
   Ambiance : écran qui reste allumé, musique du salon, installation de l'appli.
   Fichier autonome, utilisé par tous les jeux.
   ===================================================================== */

// Garde l'écran allumé pendant une partie (sinon le téléphone se met en veille et coupe la connexion).
const Eveil = {
  verrou: null, voulu: false,
  async prendre() {
    this.voulu = true;
    if (this.verrou || !("wakeLock" in navigator) || document.visibilityState !== "visible") return;
    try { this.verrou = await navigator.wakeLock.request("screen"); this.verrou.addEventListener("release", () => { this.verrou = null; }); } catch (e) {}
  },
  lacher() { this.voulu = false; try { this.verrou && this.verrou.release(); } catch (e) {} this.verrou = null; },
  regler(oui) { oui ? this.prendre() : this.lacher(); }
};
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible" && Eveil.voulu) Eveil.prendre(); });

// Musique d'ambiance, fabriquée à la volée (aucun fichier à télécharger).
// Plusieurs ambiances qui s'enchaînent selon le moment :
//   salon   : douce, pendant qu'on s'installe
//   jeu     : plus rythmée, pendant la partie
//   tension : rapide et serrée, dans les dernières secondes du chrono
//   recap   : joyeuse, pour le classement de fin
const DO = 261.63, RE = 293.66, MI = 329.63, FA = 349.23, SOL = 392.0, LA = 440.0, SI = 493.88;
const Musique = {
  ctx: null, sortie: null, bruit: null, active: false, minuteur: null, pas: 0, prochain: 0,
  style: "salon", attente: null, tendu: false,
  STYLES: {
    salon: { bpm: 92, div: 2, parAccord: 8, accords: [[DO, MI, SOL], [LA / 2, DO, MI], [FA / 2, LA / 2, DO], [SOL / 2, SI / 2, RE]] },
    jeu: { bpm: 112, div: 2, parAccord: 8, accords: [[LA / 2, DO, MI], [FA / 2, LA / 2, DO], [DO, MI, SOL], [SOL / 2, SI / 2, RE]] },
    tension: { bpm: 150, div: 4, parAccord: 16, accords: [[LA / 2, DO, MI], [LA / 2, DO, MI], [207.65, SI / 2, MI], [207.65, SI / 2, MI]] },
    recap: { bpm: 104, div: 2, parAccord: 8, accords: [[FA / 2, LA / 2, DO], [SOL / 2, SI / 2, RE], [MI / 2, SOL / 2, SI / 2], [LA / 2, DO, MI]] }
  },
  // Préférence : musique voulue ou non (par défaut oui sur la télé et sur un seul téléphone).
  voulue() { try { return localStorage.getItem("jeux-musique") !== "0"; } catch (e) { return true; } },
  choisie() { try { return localStorage.getItem("jeux-musique") === "1"; } catch (e) { return false; } },
  memoriser(oui) { try { localStorage.setItem("jeux-musique", oui ? "1" : "0"); } catch (e) {} },
  demarrer() {
    if (this.active) return;
    try {
      this.ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (this.ctx.state === "suspended") this.ctx.resume();
      this.sortie = this.ctx.createGain(); this.sortie.gain.value = 0.0001;
      this.sortie.connect(this.ctx.destination);
      this.sortie.gain.exponentialRampToValueAtTime(0.5, this.ctx.currentTime + 2);
      if (!this.bruit) { // un petit souffle pour les charleys
        const n = this.ctx.sampleRate * 0.2, buf = this.ctx.createBuffer(1, n, this.ctx.sampleRate), d = buf.getChannelData(0);
        for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
        this.bruit = buf;
      }
    } catch (e) { return; }
    this.active = true; this.pas = 0; this.prochain = this.ctx.currentTime + 0.1;
    this.minuteur = setInterval(() => this.programmer(), 150);
  },
  arreter() {
    if (!this.active) return;
    this.active = false; clearInterval(this.minuteur);
    const s = this.sortie; try { s.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8); setTimeout(() => s.disconnect(), 1000); } catch (e) {}
  },
  basculer() { this.active ? this.arreter() : this.demarrer(); this.memoriser(this.active); return this.active; },
  // Change d'ambiance au début de la mesure suivante (pas de coupure en plein milieu).
  ambiance(nom) { if (this.STYLES[nom] && nom !== (this.attente || this.style)) this.attente = nom; },
  tension(oui) { if (oui === this.tendu) return; this.tendu = oui; this.ambiance(oui ? "tension" : this.avantTension || "jeu"); },
  selon(base) { this.avantTension = base; if (!this.tendu) this.ambiance(base); },
  note(f, t, d, type, v) {
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + Math.min(0.04, d / 3)); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g); g.connect(this.sortie); o.start(t); o.stop(t + d + 0.05);
  },
  charley(t, v) {
    const s = this.ctx.createBufferSource(), f = this.ctx.createBiquadFilter(), g = this.ctx.createGain();
    s.buffer = this.bruit; f.type = "highpass"; f.frequency.value = 7000;
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    s.connect(f); f.connect(g); g.connect(this.sortie); s.start(t); s.stop(t + 0.06);
  },
  grosseCaisse(t, v) {
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.frequency.setValueAtTime(130, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
    o.connect(g); g.connect(this.sortie); o.start(t); o.stop(t + 0.2);
  },
  programmer() {
    while (this.prochain < this.ctx.currentTime + 0.5) {
      let st = this.STYLES[this.style];
      if (this.attente && this.pas % st.parAccord === 0) { this.style = this.attente; this.attente = null; this.pas = 0; st = this.STYLES[this.style]; }
      const pasDuree = 60 / st.bpm / st.div, t = this.prochain, k = this.pas % st.parAccord;
      const a = st.accords[Math.floor(this.pas / st.parAccord) % st.accords.length];
      this["jouer_" + this.style](t, k, a, pasDuree);
      this.pas++; this.prochain += pasDuree;
    }
  },
  jouer_salon(t, k, a, d) { // nappe douce et arpège
    if (k === 0) { a.forEach(f => this.note(f / 2, t, d * 8, "triangle", 0.025)); this.note(a[0] / 4, t, d * 4, "sine", 0.05); }
    if (k === 4) this.note(a[0] / 4, t, d * 4, "sine", 0.04);
    const arp = [0, 1, 2, 1, 2, 0, 1, 2][k];
    if (k !== 3 && k !== 7) this.note(a[arp] * 2, t, d * 0.9, "sine", 0.018);
  },
  jouer_jeu(t, k, a, d) { // basse qui avance, charley, petit motif sautillant
    if (k === 0) a.forEach(f => this.note(f / 2, t, d * 8, "triangle", 0.018));
    if (k % 2 === 0) this.note(a[0] / 4, t, d * 1.6, "sine", 0.055);
    if (k % 2 === 1) this.charley(t, 0.012);
    if (k === 0 || k === 4) this.grosseCaisse(t, 0.05);
    const motif = [2, null, 1, 2, null, 0, 1, null][k];
    if (motif !== null) this.note(a[motif] * 2, t, d * 0.7, "square", 0.006);
  },
  jouer_tension(t, k, a, d) { // rapide, serré, ça monte
    if (k % 4 === 0) this.grosseCaisse(t, 0.07);
    this.charley(t, k % 2 ? 0.006 : 0.011);
    if (k % 2 === 0) this.note(a[0] / 4, t, d * 1.5, "sawtooth", 0.018);
    if (k === 0 || k === 6 || k === 12) a.forEach(f => this.note(f * 2, t, d * 1.2, "square", 0.006));
    if (k === 14) this.note(a[2] * 4, t, d * 1.5, "triangle", 0.012);
  },
  jouer_recap(t, k, a, d) { // joyeux, petites cloches
    if (k === 0) { a.forEach(f => this.note(f / 2, t, d * 8, "triangle", 0.024)); this.grosseCaisse(t, 0.04); }
    if (k % 2 === 0) this.note(a[0] / 4, t, d * 1.8, "sine", 0.05);
    if (k === 4) this.charley(t, 0.01);
    const cloche = [0, 2, 1, 2, 0, null, 2, 1][k];
    if (cloche !== null) this.note(a[cloche] * 4, t, d * 1.6, "triangle", 0.014);
  }
};

// Fonds animés : rayons qui tournent, trame qui glisse, petits dessins qui flottent.
// En plus : un voile rouge qui palpite dans les dernières secondes, des confettis à la fin.
const Fond = {
  monte: false,
  monter() {
    if (this.monte || !document.body) return; this.monte = true;
    const css = document.createElement("style");
    css.textContent = `
body::before{background-image:radial-gradient(ellipse at 50% 0%,rgba(255,255,255,.28),rgba(255,255,255,0) 60%)!important}
.fond{position:fixed;inset:0;z-index:-1;overflow:hidden;pointer-events:none}
.fond>*{position:absolute}
.fond-rayons{left:50%;top:-6%;width:260vmax;height:260vmax;margin:-130vmax 0 0 -130vmax;background:repeating-conic-gradient(rgba(255,255,255,.09) 0deg 5deg,rgba(255,255,255,0) 5deg 11deg);animation:fond-tourne 120s linear infinite}
.fond-points{inset:-28px;background:radial-gradient(rgba(0,0,0,.2) 2.2px,rgba(0,0,0,0) 2.6px) 0 0/14px 14px;animation:fond-glisse 3.5s linear infinite}
.fond-dessin{left:var(--x);top:105%;width:var(--t);height:var(--t);opacity:.16;animation:fond-monte var(--d) linear var(--r) infinite}
.fond-alerte{inset:0;opacity:0;background:radial-gradient(ellipse at 50% 50%,rgba(255,45,45,0) 45%,rgba(255,45,45,.5));transition:opacity .4s}
body.tension .fond-alerte{opacity:1;animation:fond-palpite .55s ease-in-out infinite alternate}
.fond-rayons2{left:50%;top:-6%;width:260vmax;height:260vmax;margin:-130vmax 0 0 -130vmax;opacity:0;transition:opacity .5s;background:repeating-conic-gradient(rgba(255,230,0,.13) 0deg 4deg,rgba(255,230,0,0) 4deg 12deg);animation:fond-tourne 14s linear infinite}
body.tension .fond-rayons2,body.fete .fond-rayons2{opacity:1}
.fond-confetti{top:-5%;left:var(--x);width:10px;height:16px;background:var(--c);border:2px solid #111;opacity:0;animation:fond-tombe var(--d) linear var(--r) infinite}
body.fete .fond-confetti{opacity:1}
@keyframes fond-tourne{to{transform:rotate(360deg)}}
@keyframes fond-glisse{to{transform:translate(14px,14px)}}
@keyframes fond-monte{from{transform:translateY(0) rotate(0)}to{transform:translateY(calc(-100vh - 140%)) rotate(var(--a))}}
@keyframes fond-palpite{from{opacity:.55}to{opacity:1}}
@keyframes fond-tombe{from{transform:translateY(0) rotate(0)}to{transform:translateY(112vh) rotate(720deg)}}
@media (prefers-reduced-motion:reduce){.fond *{animation:none!important}.fond-dessin,.fond-confetti{display:none}}`;
    document.head.append(css);
    const f = document.createElement("div"); f.className = "fond"; f.setAttribute("aria-hidden", "true");
    const DESSINS = [
      '<path d="M50 6l12 30 32 2-25 20 9 32-28-18-28 18 9-32L6 38l32-2z"/>', // étoile
      '<path d="M58 4 22 54h24l-8 42 40-56H54z"/>', // éclair
      '<path d="M50 10a40 30 0 1 1-22 55L10 88l8-26A40 30 0 0 1 50 10z"/>', // bulle
      '<circle cx="50" cy="50" r="34"/><circle cx="50" cy="50" r="14"/>', // cible
      '<path d="M50 88S10 62 10 36a20 20 0 0 1 40-6 20 20 0 0 1 40 6c0 26-40 52-40 52z"/>', // cœur
      '<path d="M14 50h72M50 14v72M24 24l52 52M76 24 24 76"/>', // éclat
      '<rect x="18" y="18" width="64" height="64" rx="10"/><circle cx="36" cy="36" r="6"/><circle cx="64" cy="64" r="6"/><circle cx="64" cy="36" r="6"/><circle cx="36" cy="64" r="6"/>' // dé
    ];
    let h = '<div class="fond-rayons"></div><div class="fond-rayons2"></div><div class="fond-points"></div>';
    DESSINS.forEach((d, i) => {
      const t = 50 + (i * 37) % 60, x = (i * 14 + 4) % 92, dur = 34 + (i * 13) % 26, ret = -(i * 9 % 40), ang = (i % 2 ? 1 : -1) * (120 + i * 40);
      h += `<svg class="fond-dessin" viewBox="0 0 100 100" style="--x:${x}%;--t:${t}px;--d:${dur}s;--r:${ret}s;--a:${ang}deg"><g fill="#fff" stroke="#111" stroke-width="7" stroke-linejoin="round">${d}</g></svg>`;
    });
    const C = ["#FF2D2D", "#FFE600", "#fff", "#00C46A", "#FF4FB0", "#111"];
    for (let i = 0; i < 18; i++) h += `<i class="fond-confetti" style="--x:${(i * 53) % 100}%;--c:${C[i % C.length]};--d:${3 + (i * 7) % 4}s;--r:${-(i * 0.37).toFixed(2)}s"></i>`;
    h += '<div class="fond-alerte"></div>';
    f.innerHTML = h; document.body.prepend(f);
  },
  tension(oui) { document.body.classList.toggle("tension", !!oui); },
  fete(oui) { document.body.classList.toggle("fete", !!oui); }
};
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => Fond.monter()); else Fond.monter();

// Selon l'écran affiché : quelle musique, et faut-il la fête en fond ?
// partie = écran de jeu ; fin = classement ; sinon on est au salon.
function ambianceEcran(partie, fin) {
  Fond.fete(fin); if (!partie) { Fond.tension(false); Musique.tendu = false; }
  Musique.selon(fin ? "recap" : partie ? "jeu" : "salon");
}

// Appli à installer sur l'écran d'accueil (fonctionne aussi sans internet pour le mode « sur cet appareil »).
(function installer() {
  if (!("serviceWorker" in navigator) || location.protocol !== "https:" && location.hostname !== "localhost") return;
  const racine = new URL("../", document.currentScript.src).href;
  addEventListener("load", () => { navigator.serviceWorker.register(racine + "sw.js").catch(() => {}); });
})();
