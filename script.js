import { database } from './firebase.js';
import {
  ref,
  set,
  remove
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Récupère l'ID de la commande depuis l'URL
const params = new URLSearchParams(window.location.search);
const commandeId = params.get('id');
const commandeIdEl = document.getElementById('commandeId');

if (commandeId && commandeIdEl) {
  commandeIdEl.textContent = `Commande ${commandeId}`;
  document.getElementById('btnLivree').style.display = "inline-block";
}

// Suivi GPS temps réel
let watchId;

function departLivraison() {
  const phone = document.getElementById('phone').value.trim();
  if (!phone) return alert("Numéro de téléphone manquant");

  if (!commandeId) return alert("Aucune commande détectée");

  const suiviUrl = `https://suivi-cosmosushimougins.netlify.app/suivi.html?id=${commandeId}`;
  const message = encodeURIComponent(`Votre commande Cosmo Sushi est en route. Suivez-la ici : ${suiviUrl}`);

  window.location.href = `sms:${phone}?body=${message}`;

  // Active le GPS
  watchId = navigator.geolocation.watchPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      const suiviRef = ref(database, `commandes/${commandeId}`);
      set(suiviRef, {
        lat: latitude,
        lng: longitude
      });
    },
    (err) => {
      console.error("Erreur GPS", err);
    },
    { enableHighAccuracy: true }
  );
}

function commandeLivree() {
  if (!commandeId) return;

  const suiviRef = ref(database, `commandes/${commandeId}`);
  remove(suiviRef); // Supprime le suivi

  alert("Commande marquée comme livrée.");
  if (watchId) navigator.geolocation.clearWatch(watchId);
}
