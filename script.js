// Récupère le numéro de commande depuis l’URL
const urlParams = new URLSearchParams(window.location.search);
const commandeId = urlParams.get('id');

// Affiche le numéro de commande si dispo
const commandeElement = document.getElementById('commandeId');
if (commandeId && commandeElement) {
  commandeElement.textContent = `Commande n°${commandeId}`;
} else {
  commandeElement.textContent = 'Aucune commande détectée';
}

// Fonction appelée lors du clic sur le bouton
function departLivraison() {
  const phone = document.getElementById("phone").value;
  if (!phone) {
    alert("Merci d'entrer un numéro de téléphone.");
    return;
  }

  if (!commandeId) {
    alert("Numéro de commande introuvable dans l’URL.");
    return;
  }

  // Lien de suivi dynamique
  const trackingUrl = `https://suivi-cosmosushimougins.netlify.app/suivi.html?id=${commandeId}`;
  const message = encodeURIComponent(
    `Votre commande Cosmo Sushi est en route. Vous pouvez suivre la livraison ici : ${trackingUrl}`
  );

  // Ouvre l'app SMS avec message
  window.location.href = `sms:${phone}?&body=${message}`;
}
