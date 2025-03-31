// Récupérer le numéro de commande depuis l'URL
const params = new URLSearchParams(window.location.search);
const commandeId = params.get("id");

// Afficher le numéro de commande
const commandeElement = document.getElementById("commandeId");
if (commandeId) {
  commandeElement.textContent = "Commande n°" + commandeId;
} else {
  commandeElement.textContent = "Aucune commande détectée";
}

// Fonction pour récupérer la géolocalisation du livreur
let watchId; // Pour stocker l'ID du watcher

function startTracking() {
  if (navigator.geolocation) {
    // Récupérer la position GPS en temps réel
    watchId = navigator.geolocation.watchPosition(function(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      // Référence de la base de données Firebase
      const ref = firebase.database().ref('commandes/' + commandeId);

      // Mettre à jour les coordonnées GPS du livreur dans Firebase
      ref.update({
        lat: latitude,
        lng: longitude,
        status: "en livraison" // Marquer la commande comme "en livraison"
      });
    }, function(error) {
      console.log("Erreur de géolocalisation: " + error.message);
    });
  }
}

// Fonction appelée lors du clic sur le bouton "Départ en livraison"
function departLivraison() {
  const phone = document.getElementById("phone").value.trim(); // Numéro de téléphone du client

  if (!phone) {
    alert("Merci d'entrer un numéro de téléphone.");
    return;
  }

  if (!commandeId) {
    alert("Aucune commande trouvée dans l'URL.");
    return;
  }

  // Lien pour envoyer un SMS avec le lien de suivi
  const suiviUrl = `https://suivi-cosmosushimougins.netlify.app/suivi.html?id=${commandeId}`;
  const message = encodeURIComponent(`Votre commande Cosmo Sushi est en route. Suivez-la ici : ${suiviUrl}`);

  // Ouvre l'application SMS du téléphone avec le message pré-rempli
  window.location.href = `sms:?body=${message}`;

  // Démarrer le suivi GPS
  startTracking();
}

// Fonction pour marquer la commande comme livrée
function marquerCommandeLivree() {
  if (!commandeId) {
    alert("Aucune commande trouvée.");
    return;
  }

  const ref = firebase.database().ref('commandes/' + commandeId);

  // Mettre à jour le statut de la commande pour marquer comme livrée
  ref.update({
    status: "livrée", // Changer le statut à "livrée"
    lat: null, // Supprimer les coordonnées GPS
    lng: null
  }).then(() => {
    alert("La commande a été livrée !");
    window.location.href = "suivi.html"; // Rediriger si nécessaire
  });
}

// Fonction pour arrêter de suivre les coordonnées GPS (arrêt de la géolocalisation)
function stopTracking() {
  if (watchId) {
    navigator.geolocation.clearWatch(watchId); // Arrêter la géolocalisation en temps réel
  }
}

// Ajouter l'événement pour marquer la commande livrée
document.getElementById("btnLivree").addEventListener("click", marquerCommandeLivree);

// Code pour le suivi GPS côté client : mise à jour de la carte
const suiviRef = firebase.database().ref('commandes/' + commandeId);

// Ecouter les changements de données de la commande en temps réel
suiviRef.on('value', (snapshot) => {
  const data = snapshot.val();

  if (data) {
    const status = data.status;
    if (status === "livrée") {
      document.body.innerHTML = "<h2>✅ Livraison terminée</h2>";
    } else if (data.lat && data.lng) {
      // Afficher la carte si la commande est en cours de livraison
      const position = [data.lat, data.lng];
      afficherCarte(position);
    } else {
      document.body.innerHTML = "<h2>Suivi indisponible</h2>";
    }
  }
});

// Fonction pour afficher la carte avec les coordonnées GPS du livreur
function afficherCarte(position) {
  const map = L.map("map").setView(position, 15);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap"
  }).addTo(map);

  const marker = L.marker(position).addTo(map);
  map.setView(position);
}
