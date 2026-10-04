import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

const publicDir = path.join(__dirname, '../public');

app.use(express.static(publicDir));

// Clean URL rewrites matching firebase.json
app.get('/privacy', (req, res) => {
  res.sendFile(path.join(publicDir, 'privacy.html'));
});

app.get('/data-deletion', (req, res) => {
  res.sendFile(path.join(publicDir, 'data-deletion.html'));
});

// Explicitly serve firebase-manager.js if requested
app.get('/firebase-manager.js', (req, res) => {
  res.sendFile(path.join(publicDir, 'firebase-manager.js'));
});

// Start backend server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`PriceSnap server running at http://0.0.0.0:${PORT}`);
});
