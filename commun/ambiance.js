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

// Musique d'ambiance du salon grand écran : une petite boucle douce, fabriquée à la volée.
const Musique = {
  ctx: null, sortie: null, active: false, minuteur: null, pas: 0, prochain: 0,
  // suite d'accords (do, la mineur, fa, sol) et petite mélodie en arpège
  ACCORDS: [[261.63, 329.63, 392.0], [220.0, 261.63, 329.63], [174.61, 220.0, 261.63], [196.0, 246.94, 293.66]],
  voulue() { try { return localStorage.getItem("jeux-musique") !== "0"; } catch (e) { return true; } },
  memoriser(oui) { try { localStorage.setItem("jeux-musique", oui ? "1" : "0"); } catch (e) {} },
  demarrer() {
    if (this.active) return;
    try {
      this.ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (this.ctx.state === "suspended") this.ctx.resume();
      this.sortie = this.ctx.createGain(); this.sortie.gain.value = 0.0001;
      this.sortie.connect(this.ctx.destination);
      this.sortie.gain.exponentialRampToValueAtTime(0.5, this.ctx.currentTime + 2);
    } catch (e) { return; }
    this.active = true; this.pas = 0; this.prochain = this.ctx.currentTime + 0.1;
    this.minuteur = setInterval(() => this.programmer(), 200);
  },
  arreter() {
    if (!this.active) return;
    this.active = false; clearInterval(this.minuteur);
    const s = this.sortie; try { s.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8); setTimeout(() => s.disconnect(), 1000); } catch (e) {}
  },
  basculer() { this.active ? this.arreter() : this.demarrer(); this.memoriser(this.active); return this.active; },
  note(f, t, d, type, v) {
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + Math.min(0.08, d / 3)); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g); g.connect(this.sortie); o.start(t); o.stop(t + d + 0.05);
  },
  programmer() { // 8 croches par accord, à 92 battements par minute
    const croche = 60 / 92 / 2;
    while (this.prochain < this.ctx.currentTime + 0.6) {
      const a = this.ACCORDS[Math.floor(this.pas / 8) % 4], k = this.pas % 8, t = this.prochain;
      if (k === 0) { a.forEach(f => this.note(f / 2, t, croche * 8, "triangle", 0.025)); this.note(a[0] / 4, t, croche * 4, "sine", 0.05); }
      if (k === 4) this.note(a[0] / 4, t, croche * 4, "sine", 0.04);
      const arp = [0, 1, 2, 1, 2, 0, 1, 2][k];
      if (k !== 3 && k !== 7) this.note(a[arp] * 2, t, croche * 0.9, "sine", 0.018);
      this.pas++; this.prochain += croche;
    }
  }
};

// Appli à installer sur l'écran d'accueil (fonctionne aussi sans internet pour le mode « sur cet appareil »).
(function installer() {
  if (!("serviceWorker" in navigator) || location.protocol !== "https:" && location.hostname !== "localhost") return;
  const racine = new URL("../", document.currentScript.src).href;
  addEventListener("load", () => { navigator.serviceWorker.register(racine + "sw.js").catch(() => {}); });
})();
