import http from 'http';
import fs from 'fs';
import path from 'path';
import WebSocket, { WebSocketServer } from 'ws';
import open from 'open';
import { fileURLToPath } from 'url';

const hostname = '0.0.0.0'; // Corrected hostname

const HTTP_PORT = 3000;
const WS_PORT = 8080;

let browserOpened = false; // Flag to prevent opening multiple tabs

// Get __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = http.createServer((req, res) => {
    // open a file on the server and return its content:
    if (req.url === '/' || req.url === '/index.html') {
        const filePath = path.join(__dirname, 'index.html');
        fs.readFile(filePath, 'utf-8', (err, content) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                console.error(err);
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                // Inject the WebSocket script with the port
                const injectedScript = `
                <script>
                  (function() {
                    if (!window.webSocketInitialized) {
                      const ws = new WebSocket('ws://' + window.location.hostname + ':${WS_PORT}');
                      ws.onopen = () => console.log('WebSocket connected');
                      ws.onmessage = (message) => {
                        if (message.data === 'reload') {
                            console.log('Reloading the page');
                            location.reload(); // Reload the page when the message is received
                        }
                      };
                      ws.onerror = (err) => console.error('WebSocket error:', err);
                      ws.onclose = () => console.log('WebSocket disconnected');
                      window.webSocketInitialized = true; // Prevent duplicate connections
                    }
                  })();
                </script>
              `;
                const modifiedContent = content.replace('</body>', `${injectedScript}</body>`);

                // Send the modified HTML
                res.end(modifiedContent);
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 not found');
    }
});

// Create a WebSocket server
const wss = new WebSocketServer({ port: WS_PORT });

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
  });
  ws.send('Hello from server');
});

// WebSocket server for live reloading
// Notify clients of file changes
fs.watch(path.join(__dirname, 'index.html'), () => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send('reload');
    }
  });
});

server.listen(HTTP_PORT, () => {
  console.log(`Server running at http://${hostname}:${HTTP_PORT}/`);
  console.log(`Accessible on your local network at: http://<your-local-ip>:${HTTP_PORT}/`);
  console.log(`WebSocket server running on port ${WS_PORT}`);

  // Open browser only on the first server start
  if (!browserOpened) {
    open(`http://localhost:${HTTP_PORT}`, { app: { name: 'google chrome' } });
    browserOpened = true;
  }
});