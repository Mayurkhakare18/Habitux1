import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

// Health check endpoint for Cloud Run container liveness & readiness probes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static build assets from dist
const distPath = path.join(__dirname, 'dist');

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// Client-side SPA routing fallback: send index.html for all non-asset requests
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(503).send('Building application... Please refresh in a moment.');
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`HABITUX production web server listening on 0.0.0.0:${port}`);
});
