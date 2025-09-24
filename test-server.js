/**
 * Local test server for GM Check-in Farcaster MiniApp
 * Run with: node test-server.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

// Mock user data for testing
const mockUsers = {
    '12345': {
        fid: 12345,
        username: 'testuser',
        displayName: 'Test User',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=12345',
        bio: 'Testing GM Check-in app',
        followerCount: 100,
        followingCount: 50,
        primaryAddress: '0x1234567890123456789012345678901234567890'
    }
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // API endpoints
    if (pathname === '/api/me') {
        handleMeEndpoint(req, res);
        return;
    }

    // Serve static files
    let filePath = pathname === '/' ? '/index-farcaster.html' : pathname;
    filePath = path.join(__dirname, filePath);

    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('File not found');
            return;
        }

        // Get file extension
        const ext = path.extname(filePath).toLowerCase();
        const contentType = mimeTypes[ext] || 'application/octet-stream';

        // Read and serve file
        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Server error');
                return;
            }

            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        });
    });
});

function handleMeEndpoint(req, res) {
    if (req.method !== 'GET') {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
    }

    // Get authorization header
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith('Bearer ')) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Missing or invalid authorization header' }));
        return;
    }

    // For testing, return mock user data
    const mockUser = mockUsers['12345'];
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(mockUser));
}

server.listen(PORT, () => {
    console.log(`🚀 GM Check-in test server running at http://localhost:${PORT}`);
    console.log(`📱 Test URL for Farcaster: http://localhost:${PORT}`);
    console.log(`🔧 API endpoint: http://localhost:${PORT}/api/me`);
    console.log('\n📋 Testing checklist:');
    console.log('1. Open http://localhost:3000 in browser');
    console.log('2. Test basic functionality');
    console.log('3. Use Farcaster developer tools');
    console.log('4. Test on mobile device');
    console.log('\n⏹️  Press Ctrl+C to stop server');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down test server...');
    server.close(() => {
        console.log('✅ Server stopped');
        process.exit(0);
    });
});