// Firebase Client Manager for PriceSnap Website
const OperationType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  LIST: 'list',
  GET: 'get',
  WRITE: 'write',
};

let db = null;

// Error handler specified by Firebase Integration Skill guidelines
function handleFirestoreError(error, operationType, path) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null, // Client-side public user
      email: null,
      emailVerified: null,
      isAnonymous: true,
      tenantId: null,
      providerInfo: []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Initialize Firebase dynamically by loading config
async function initFirebase() {
  try {
    const response = await fetch('/firebase-applet-config.json');
    if (!response.ok) throw new Error('Could not load Firebase configuration');
    const firebaseConfig = await response.json();

    // Import from Firebase ESM CDNs
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js");
    const { getFirestore: firestoreInit } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");

    const app = initializeApp(firebaseConfig);
    const databaseId = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
      ? firebaseConfig.firestoreDatabaseId
      : undefined;
    db = databaseId ? firestoreInit(app, databaseId) : firestoreInit(app);
    console.log('PriceSnap Firebase initialized successfully.');

    // Validate connection per skill instructions
    try {
      const { doc, getDocFromServer } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
      await getDocFromServer(doc(db, 'test', 'connection'));
    } catch (error) {
      if (error instanceof Error && error.message.includes('the client is offline')) {
        console.error("Please check your Firebase configuration.");
      }
    }

    return db;
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    return null;
  }
}

// Add a customer support message
export async function submitSupportRequest(email, message) {
  if (!db) db = await initFirebase();
  if (!db) return { success: false, error: 'Database offline' };

  const { collection, doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
  
  // Safe validation per blueprint constraints
  if (!email || email.length > 128) return { success: false, error: 'Invalid email' };
  if (!message || message.length > 1024) return { success: false, error: 'Message exceeds limit' };

  // Generate safe alphanumeric ID to prevent poisoning
  const requestId = 'req_' + Math.random().toString(36).substr(2, 9);
  const path = `supportRequests/${requestId}`;

  const payload = {
    email: email.trim(),
    message: message.trim(),
    createdAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, 'supportRequests', requestId), payload);
    return { success: true };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return { success: false, error: error.message };
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
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

// Seed mock snaps dynamically into the database if empty (requires admin auth / setup, so let's check or handle gracefully)
export async function seedMockSnapsIfEmpty() {
  if (!db) db = await initFirebase();
  if (!db) return;

  const snaps = await getRecentSnaps();
  if (snaps.length > 0) return; // Already populated

  // Fallback / seed items to keep the showcase looking beautiful
  console.log("No live featured snaps found in Firestore database. Displaying default mock showcase.");
}

// Trigger initial connection
initFirebase();
