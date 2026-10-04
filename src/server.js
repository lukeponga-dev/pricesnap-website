import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, '../public')));

// Start backend server and seed Firestore database if empty
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);

  // Auto-seed Firestore database if config exists
  const configPath = path.join(__dirname, '../firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      const { initializeApp } = await import('firebase/app');
      const { getFirestore, collection, getDocs, doc, setDoc } = await import('firebase/firestore');

      const firebaseApp = initializeApp(config);
      const databaseId = config.firestoreDatabaseId && config.firestoreDatabaseId !== '(default)'
        ? config.firestoreDatabaseId
        : undefined;
      const db = databaseId ? getFirestore(firebaseApp, databaseId) : getFirestore(firebaseApp);

      // Check if seeded
      const snapSnapshot = await getDocs(collection(db, 'publicSnaps'));
      if (snapSnapshot.empty) {
        console.log('Seeding initial Kiwi valuation snaps to Firestore...');
        const initialSnaps = [
          {
            id: 'snap_01',
            itemName: 'Nintendo Switch (OLED)',
            condition: 'Excellent condition · Blue/Red Joy-Cons',
            estimatedMin: 350,
            estimatedMax: 420,
            confidence: 92,
            createdAt: new Date().toISOString()
          },
          {
            id: 'snap_02',
            itemName: 'Vintage Leather Jacket (Auckland Op-Shop Find)',
            condition: 'Good condition · Genuine leather · Minor collar wear',
            estimatedMin: 80,
            estimatedMax: 120,
            confidence: 81,
            createdAt: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: 'snap_03',
            itemName: 'Apple MacBook Pro 14" (M1 Pro)',
            condition: 'Fair condition · Tiny bezel scratch · 87% battery health',
            estimatedMin: 1100,
            estimatedMax: 1350,
            confidence: 88,
            createdAt: new Date(Date.now() - 7200000).toISOString()
          }
        ];

        for (const item of initialSnaps) {
          const { id, ...data } = item;
          await setDoc(doc(db, 'publicSnaps', id), data);
        }
        console.log('Successfully seeded 3 local Aotearoa appraisal snaps.');
      } else {
        console.log('Firestore database has existing snaps, skipping seed.');
      }
    } catch (err) {
      console.error('Error seeding Firebase Firestore database:', err);
    }
  }
});
