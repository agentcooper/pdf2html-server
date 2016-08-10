const http = require('http');

const fs = require('fs');

const pdf2HTMLCSS = require('./pdf2HTMLCSS');

const url = require('url');

const hostname = '127.0.0.1';
const port = 3003;

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/list')) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const documents =
      fs.readdirSync('pdf').filter(filename => filename.endsWith('.pdf'));

    res.end(
      JSON.stringify({ documents })
    );
  } else if (req.url.startsWith('/convert')) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const query = url.parse(req.url, true).query;

    const { width, src } = query;

    console.log('Converting', src);
    pdf2HTMLCSS(`pdf/${src}`, { width }, (err, HTMLCSS) => {
      const { html, css } = HTMLCSS;

      console.log('Done');
      res.end(
        JSON.stringify({ html, css })
      );
    });
  } else {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');

    res.end(
      JSON.stringify({
        error: 'Bad request',
      })
    );
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
