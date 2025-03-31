import { database } from './firebase.js';
import {
  ref,
  set,
  remove
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Récupère le numéro de commande depuis l’URL
const params = new URLSearchParams(window.location.search);
const commandeId = params.get("id");
const commandeEl = document.getElementById("commandeId");
const livreeBtn = document.getElementById("livreeBtn");

if (commandeId) {
  commandeEl.textContent = `Commande n°${commandeId}`;
  livreeBtn.style.display = "block"; // Affiche le bouton "commande livrée"
} else {
  commandeEl.textContent = "Aucune commande détectée";
}

let watchId;

window.departLivraison = () => {
  const phone = document.getElementById("phone").value.trim();
  if (!phone || !commandeId) {
    alert("Merci d'entrer un numéro de téléphone et d'avoir un lien valide.");
    return;
  }

  const trackingUrl = `${window.location.origin}/suivi.html?id=${commandeId}`;
  const message = `Votre commande Cosmo Sushi est en route. Suivez-la ici : ${trackingUrl}`;

  // Ouvre l'app SMS
  window.location.href = `sms:${phone}?body=${encodeURIComponent(message)}`;

  // Active la géolocalisation en direct
  if (navigator.geolocation) {
    watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        set(ref(database, "commandes/" + commandeId), {
          lat: latitude,
          lng: longitude
        });
      },
      (err) => {
        alert("Erreur GPS : " + err.message);
      },
      {
        enableHighAccuracy: true
      }
    );
  } else {
    alert("La géolocalisation n’est pas disponible.");
  }
};

window.commandeLivree = () => {
  if (watchId) navigator.geolocation.clearWatch(watchId);
  if (!commandeId) return;

  const suiviRef = ref(database, "commandes/" + commandeId);
  remove(suiviRef);
  alert("Commande livrée, suivi terminé.");
};
