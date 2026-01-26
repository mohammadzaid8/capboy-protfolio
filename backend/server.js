const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const fs = require('fs-extra');
const { LRUCache } = require('lru-cache');

const app = express();
const PORT = process.env.PORT || 3000;
const R2_BASE_URL = "https://pub-22f00052526b4a6087e6351b8539a93d.r2.dev";
const CACHE_DIR = path.join(__dirname, 'cache');
const CACHE_CHUNK_SIZE = 5 * 1024 * 1024; // 5MB Header Cache

// Ensure cache directory exists
fs.ensureDirSync(CACHE_DIR);

// Metadata Cache (RAM)
const metaCache = new LRUCache({ max: 500 });

app.use(cors());

app.get('/assets/*', async (req, res) => {
    const rawPath = req.params[0];
    if (!rawPath) return res.status(400).send('Asset path missing');

    const assetPath = decodeURIComponent(rawPath);
    const ext = path.extname(assetPath).toLowerCase();

    // Chunk Cache Path (We only save the first 5MB)
    const chunkFilePath = path.join(CACHE_DIR, assetPath + '.chunk');
    const chunkFileDir = path.dirname(chunkFilePath);

    // Resolve R2 URL
    let r2Urls = [`${R2_BASE_URL}/assets/${assetPath}`, `${R2_BASE_URL}/${assetPath}`];
    let validUrl = null;
    let headResponse = null;

    if (metaCache.has(assetPath)) {
        const cachedMeta = metaCache.get(assetPath);
        validUrl = cachedMeta.url;
    } else {
        for (const url of r2Urls) {
            try {
                headResponse = await axios.head(url);
                if (headResponse.status === 200) {
                    validUrl = url;
                    metaCache.set(assetPath, {
                        url: validUrl,
                        size: headResponse.headers['content-length'],
                        type: headResponse.headers['content-type']
                    });
                    break;
                }
            } catch (e) { }
        }
    }

    if (!validUrl) {
        return res.status(404).send('Not Found');
    }

    try {
        // === VIDEO HANDLING WITH HYBRID CACHE ===
        if (['.mp4', '.mov', '.webm', '.mkv'].includes(ext)) {
            const videoHead = headResponse || await axios.head(validUrl);
            const fileSize = parseInt(videoHead.headers['content-length']);
            const range = req.headers.range;

            // Default range if none provided
            let start = 0;
            let end = fileSize - 1;
            if (range) {
                const parts = range.replace(/bytes=/, "").split("-");
                start = parseInt(parts[0], 10);
                end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            }

            // CRITICAL: First Chunk Optimization (0ms Start)
            // If request starts at 0 (approx), try to serve from Cache Chunk
            if (start === 0 && await fs.pathExists(chunkFilePath)) {
                console.log(`[INSTANT START] Serving start from Disk: ${assetPath}`);
                // Serve exactly the cached chunk size or requested end
                const chunkStat = await fs.stat(chunkFilePath);
                const actualChunkSize = chunkStat.size;

                // If user wants more than the chunk, they will re-request the rest anyway
                // But generally browsers request byte 0-first.
                // We send the cached chunk.
                const chunkStream = fs.createReadStream(chunkFilePath);

                res.writeHead(206, {
                    'Content-Range': `bytes 0-${actualChunkSize - 1}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': actualChunkSize,
                    'Content-Type': 'video/mp4',
                    'Cache-Control': 'public, max-age=31536000, immutable'
                });
                chunkStream.pipe(res);
                return;
            }

            // If MISS or later range: Proxy from R2
            // "Cache on Miss": If we are fetching the start (0), duplicate the first 5MB to disk.
            const chunksize = (end - start) + 1;
            const file = await axios({
                url: validUrl,
                method: 'GET',
                responseType: 'stream',
                headers: { 'Range': `bytes=${start}-${end}` }
            });

            res.writeHead(206, {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
                'Cache-Control': 'public, max-age=31536000, immutable'
            });
            file.data.pipe(res);

            // Background Cache Logic (Only if starting from 0 and not cached)
            if (start === 0 && !await fs.pathExists(chunkFilePath)) {
                await fs.ensureDir(chunkFileDir);
                console.log(`[CACHING START] Saving first 5MB of ${assetPath}`);

                // We need a separate stream because 'file.data' is consumed by pipe(res)
                // Using a separate request to ensure clean file writing without race conditions
                axios({
                    url: validUrl,
                    method: 'GET',
                    responseType: 'stream',
                    headers: { 'Range': `bytes=0-${CACHE_CHUNK_SIZE}` }
                }).then(resp => {
                    const writer = fs.createWriteStream(chunkFilePath);
                    resp.data.pipe(writer);
                    writer.on('finish', () => console.log(`[CACHE SAVED] Header cached for ${assetPath}`));
                }).catch(err => console.error("[CACHE FAIL]", err.message));
            }
        }

        // === IMAGE HANDLING (Simple Pass Through) ===
        else {
            const response = await axios({ url: validUrl, method: 'GET', responseType: 'stream' });
            res.set('Cache-Control', 'public, max-age=31536000');
            res.set('Content-Type', response.headers['content-type']);
            response.data.pipe(res);
        }

    } catch (error) {
        console.error(`[SERVER ERROR]`, error.message);
        if (!res.headersSent) res.status(500).send('Error');
    }
});

app.listen(PORT, () => {
    console.log(`Backend service running on http://localhost:${PORT}`);
    console.log(`- Hybrid Cache: Active (First 5MB Saved to Disk)`);
});
