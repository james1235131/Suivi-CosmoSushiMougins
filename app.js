import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Button, TextInput, Alert, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Location from 'expo-location';
import * as SMS from 'expo-sms';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, update } from 'firebase/database';

// 🔐 Config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCSmq6ZSYKt9GKGklWufjFHmlD2Jn43iQo",
  authDomain: "suivi-cosmosushimougins.firebaseapp.com",
  databaseURL: "https://suivi-cosmosushimougins-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "suivi-cosmosushimougins",
  storageBucket: "suivi-cosmosushimougins.firebasestorage.app",
  messagingSenderId: "912838657291",
  appId: "1:912838657291:web:374a4858bf83d0aad38e0e"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [commandeId, setCommandeId] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const locationTimer = useRef(null);

  // Demande permission caméra
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    setCommandeId(data);
    Alert.alert("Commande scannée", `Numéro de commande : ${data}`);
  };

  const sendSMSAndStartTracking = async () => {
    if (!commandeId || !phoneNumber) {
      alert("Scannez la commande et entrez le numéro du client !");
      return;
    }

    const smsBody = `Bonjour ! Votre commande n°${commandeId} part en livraison. Suivez votre livreur ici : https://suivi-cosmosushimougins.netlify.app/client.html?id=${commandeId}`;
    const isAvailable = await SMS.isAvailableAsync();

    if (isAvailable) {
      await SMS.sendSMSAsync([phoneNumber], smsBody);
    } else {
      alert("L'envoi de SMS n'est pas disponible.");
    }

    // Enregistre le téléphone et statut
    set(ref(db, `commandes/${commandeId}`), {
      tel: phoneNumber,
      statut: "en_livraison"
    });

    // Démarre le suivi GPS toutes les 10 secondes
    locationTimer.current = setInterval(async () => {
      let { coords } = await Location.getCurrentPositionAsync({});
      update(ref(db, `commandes/${commandeId}/position`), {
        latitude: coords.latitude,
        longitude: coords.longitude,
        timestamp: new Date().toISOString()
      });
    }, 10000);
  };

  const markAsDelivered = () => {
    if (!commandeId) {
      alert("Scannez une commande d'abord !");
      return;
    }

    // Stop le suivi GPS
    clearInterval(locationTimer.current);

    // Met à jour le statut
    update(ref(db, `commandes/${commandeId}`), {
      statut: "livree"
    });

    alert("Commande marquée comme livrée !");
  };

  if (hasPermission === null) {
    return <Text>Demande de permission caméra...</Text>;
  }
  if (hasPermission === false) {
    return <Text>Accès à la caméra refusé</Text>;
  }

  return (
    <View style={styles.container}>
      {!scanned ? (
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      ) : (
        <View style={styles.inner}>
          <Text style={styles.label}>Commande : {commandeId}</Text>
          <TextInput
            style={styles.input}
            keyboardType="phone-pad"
            placeholder="Numéro du client"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          <Button title="📦 En livraison" onPress={sendSMSAndStartTracking} />
          <View style={{ marginVertical: 10 }} />
          <Button title="✅ Commande livrée" onPress={markAsDelivered} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', backgroundColor: '#fff' },
  inner: { padding: 20 },
  label: { fontSize: 18, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 20, borderRadius: 5 }
});
