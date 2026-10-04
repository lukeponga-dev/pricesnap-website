// Firebase Client Manager for PriceSnap Website
let db = null;
let databaseProvisioned = null;

// Check if the Firestore database exists before invoking the Firestore SDK
async function isFirestoreProvisioned(projectId, databaseId = '(default)') {
  if (databaseProvisioned !== null) return databaseProvisioned;
  try {
    const res = await fetch(`https://firestore.googleapis.com/v1/projects/${projectId}/databases/${databaseId}/documents`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    // If the database does not exist, Google Cloud returns 404
    databaseProvisioned = (res.status !== 404);
    return databaseProvisioned;
  } catch (e) {
    databaseProvisioned = false;
    return false;
  }
}

// Initialize Firebase dynamically by loading config
export async function initFirebase() {
  if (db) return db;

  try {
    const response = await fetch('/firebase-applet-config.json');
    if (!response.ok) {
      console.info('Firebase configuration not found. PriceSnap running in offline concept preview mode.');
      return null;
    }
    const firebaseConfig = await response.json();
    if (!firebaseConfig || !firebaseConfig.projectId) return null;

    const dbId = (firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)')
      ? firebaseConfig.firestoreDatabaseId
      : '(default)';

    // Verify database existence on Google Cloud before starting gRPC streams
    const isReady = await isFirestoreProvisioned(firebaseConfig.projectId, dbId);
    if (!isReady) {
      console.info(`Firestore database "${dbId}" is not yet provisioned on project "${firebaseConfig.projectId}". PriceSnap running in offline concept showcase mode.`);
      return null;
    }

    // Import from Firebase ESM CDNs only when database is ready
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js");
    const { getFirestore: firestoreInit } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");

    const app = initializeApp(firebaseConfig);
    const databaseId = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
      ? firebaseConfig.firestoreDatabaseId
      : undefined;
    db = databaseId ? firestoreInit(app, databaseId) : firestoreInit(app);
    console.log('PriceSnap Firebase client connected to live database.');

    return db;
  } catch (error) {
    console.info('PriceSnap Firebase initialization notice:', error instanceof Error ? error.message : error);
    return null;
  }
}

// Add a customer support message
export async function submitSupportRequest(email, message) {
  if (!db) db = await initFirebase();
  if (!db) {
    return {
      success: false,
      error: 'The live contact database is awaiting cloud activation. Please email developmentdesignsltd@gmail.com directly.'
    };
  }

  const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
  
  if (!email || email.length > 128) return { success: false, error: 'Invalid email address' };
  if (!message || message.length > 1024) return { success: false, error: 'Message exceeds limit' };

  const requestId = 'req_' + Math.random().toString(36).substr(2, 9);

  const payload = {
    email: email.trim(),
    message: message.trim(),
    createdAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, 'supportRequests', requestId), payload);
    return { success: true };
  } catch (error) {
    console.warn('Support request error:', error);
    return {
      success: false,
      error: 'Unable to send message to database right now. Please email developmentdesignsltd@gmail.com.'
    };
  }
}

// Retrieve recent public featured snapshots
export async function getRecentSnaps() {
  if (!db) db = await initFirebase();
  if (!db) return [];

  const { collection, getDocs, limit, query, orderBy } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
  const path = 'publicSnaps';

  try {
    const q = query(collection(db, path), orderBy('createdAt', 'desc'), limit(3));
    const querySnapshot = await getDocs(q);
    const snaps = [];
    querySnapshot.forEach((doc) => {
      snaps.push({ id: doc.id, ...doc.data() });
    });
    return snaps;
  } catch (error) {
    console.info("Live snaps query unavailable from database. Showing concept previews.");
    return [];
  }
}
