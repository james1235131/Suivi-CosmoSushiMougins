// Importer Firebase
import { db } from "./firebase.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

// Récupération du numéro de commande dans l’URL
const urlParams = new URLSearchParams(window.location.search);
const commandeId = urlParams.get("id");

// Affichage du numéro de commande sur la page (si présent)
const commandeElement = document.getElementById("commandeId");
if (commandeId && commandeElement) {
  commandeElement.textContent = `Commande n°${commandeId}`;
} else if (commandeElement) {
  commandeElement.textContent = "Aucune commande détectée";
}

// Fonction exécutée quand le livreur clique sur "Départ en livraison"
function departLivraison() {
  const phone = document.getElementById("phone").value;

  if (!phone) {
    alert("Merci d’entrer un numéro de téléphone.");
    return;
  }

  if (!commandeId) {
    alert("Numéro de commande introuvable dans l’URL.");
    return;
  }

  // Géolocalisation + envoi dans Firebase
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Envoi de la position dans Firebase
        set(ref(db, "commandes/" + commandeId), {
          lat: latitude,
          lng: longitude
        });
      },
      (error) => {
        alert("Erreur GPS : " + error.message);
      },
