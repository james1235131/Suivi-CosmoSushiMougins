import { database } from './firebase.js';
import {
  ref,
  set,
  remove
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const params = new URLSearchParams(window.location.search);
const commandeId = params.get('id');
document.getElementById('commandeId').textContent = commandeId || 'Inconnue';

let watchId;

window.departLivraison = () => {
  const phone = document.getElementById('phone').value.trim();
  if (!phone || !commandeId) {
    alert("Merci de renseigner le téléphone et le numéro de commande dans l'URL.");
    return;
  }

  // Envoi du SMS avec lien de suivi
  const suiviURL = `${window.location.origin}/suivi.html?id=${commandeId}`;
  const message = `Votre commande Cosmo Sushi est en route ! Suivez-la ici : ${suiviURL}`;
  window.location.href = `sms:${phone}?body=${encodeURIComponent(message)}`;

  // Partage de position GPS en temps réel
  if (navigator.geolocation) {
    watchId = navigator.geolocation.watchPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      set(ref(database, `commandes/${commandeId}`), {
        lat: latitude,
        lng: longitude
      });
    });
  } else {
    alert("La géolocalisation n'est pas supportée par ce navigateur.");
  }
};

window.commandeLivree = () => {
  if (watchId) navigator.geolocation.clearWatch(watchId);
  remove(ref(database, `commandes/${commandeId}`));
  alert("Commande livrée ! Suivi désactivé.");
};

