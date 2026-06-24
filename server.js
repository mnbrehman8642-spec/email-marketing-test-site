const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  // Serve index.html for root path
  let filePath = './index.html';
  
  if (req.url === '/' || req.url === '') {
    filePath = './index.html';
  } else {
    // Try to serve the requested file
    filePath = '.' + req.url;
  }

  // Security: prevent directory traversal
  const normalizedPath = path.normalize(filePath);
  if (!normalizedPath.startsWith('.')) {
    filePath = './index.html';
  }

  // Check if file exists
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      // If file not found, serve index.html (for SPA compatibility)
      fs.readFile('./index.html', 'utf8', (err, data) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      });
    } else {
      // Determine content type
      let contentType = 'text/html';
      if (filePath.endsWith('.css')) contentType = 'text/css';
      else if (filePath.endsWith('.js')) contentType = 'text/javascript';
      else if (filePath.endsWith('.json')) contentType = 'application/json';

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to see your site`);
});
