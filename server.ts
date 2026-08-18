import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

// Global CORS Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});

// Enable large JSON and URL-encoded payloads for image transfers (up to 25MB)
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));

// Ensure public uploads directories exist
const uploadsBaseDir = path.join(process.cwd(), 'public', 'uploads');
const productsUploadDir = path.join(uploadsBaseDir, 'products');
const galleryUploadDir = path.join(uploadsBaseDir, 'gallery');

[uploadsBaseDir, productsUploadDir, galleryUploadDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Serve uploaded images statically with proper caching and CORS headers
app.use('/uploads', express.static(uploadsBaseDir, {
  maxAge: '7d',
  setHeaders: (res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  }
}));

// API: Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Favour Business Ventures API',
    storage: 'local-server-uploads'
  });
});

// API: Image Upload Handler (Zero external secrets required, 100% free, 0 CORS issues)
app.post('/api/images/upload', async (req: Request, res: Response): Promise<void> => {
  try {
    const { fileData, fileName, folder, mimeType } = req.body;

    if (!fileData || typeof fileData !== 'string') {
      res.status(400).json({ error: 'Missing or invalid fileData in request body' });
      return;
    }

    const targetFolder = folder === 'gallery' ? 'gallery' : 'products';
    const targetDir = targetFolder === 'gallery' ? galleryUploadDir : productsUploadDir;

    // Validate MIME type
    const declaredMime = mimeType || 'image/jpeg';
    if (!declaredMime.startsWith('image/')) {
      res.status(400).json({ error: `Unsupported MIME type: ${declaredMime}. Must be an image.` });
      return;
    }

    // Extract base64 content
    let base64String = fileData;
    if (fileData.includes(';base64,')) {
      base64String = fileData.split(';base64,')[1];
    }

    const buffer = Buffer.from(base64String, 'base64');

    // Max 15MB validation
    if (buffer.length > 15 * 1024 * 1024) {
      res.status(400).json({ error: 'File exceeds 15MB size limit.' });
      return;
    }

    // Determine extension
    let extension = 'jpg';
    if (declaredMime.includes('png')) extension = 'png';
    else if (declaredMime.includes('webp')) extension = 'webp';
    else if (declaredMime.includes('jpeg') || declaredMime.includes('jpg')) extension = 'jpg';
    else if (declaredMime.includes('svg')) extension = 'svg';

    // Sanitize file name
    const rawName = (fileName || 'image')
      .replace(/\.[^/.]+$/, '') // remove ext
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '_')
      .replace(/_+/g, '_');

    const timestamp = Date.now();
    const finalFileName = `${timestamp}_${rawName}.${extension}`;
    const finalFilePath = path.join(targetDir, finalFileName);

    // Write binary file to disk
    await fs.promises.writeFile(finalFilePath, buffer);

    const publicUrl = `/uploads/${targetFolder}/${finalFileName}`;
    console.log(`[Server Storage] Successfully saved image: ${publicUrl} (${buffer.length} bytes)`);

    res.json({
      success: true,
      url: publicUrl,
      fileName: finalFileName,
      size: buffer.length,
      mimeType: declaredMime,
      provider: 'local-server'
    });
  } catch (err: any) {
    console.error('[Server Storage] Upload Error:', err);
    res.status(500).json({
      error: err?.message || 'Internal server error while processing image upload'
    });
  }
});

// API: Image Deletion Handler
app.post('/api/images/delete', async (req: Request, res: Response): Promise<void> => {
  try {
    const { url } = req.body;

    if (!url || typeof url !== 'string') {
      res.status(400).json({ error: 'Missing image URL parameter' });
      return;
    }

    // Security: Only allow deleting files inside /uploads/ (prevent path traversal)
    if (!url.startsWith('/uploads/')) {
      // If external or bundled asset URL, acknowledge safely
      res.json({ success: true, message: 'External or preset image ignored' });
      return;
    }

    const relativePath = url.replace(/^\/uploads\//, '');
    if (relativePath.includes('..')) {
      res.status(400).json({ error: 'Invalid path' });
      return;
    }

    const fullPath = path.join(uploadsBaseDir, relativePath);
    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
      console.log(`[Server Storage] Deleted file: ${fullPath}`);
    }

    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (err: any) {
    console.error('[Server Storage] Delete Error:', err);
    res.status(500).json({ error: err?.message || 'Failed to delete image' });
  }
});

// Start Express Server with Vite middleware in Dev, Static in Prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Favour Business Ventures server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
