const fs = require('fs');

const { basename } = require('path');

const { execFile } = require('child_process');

const splitBetween = (s, s1, s2) => s.split(s1)[1].split(s2)[0];

const pdf2HTMLCSS = (path, { width }, callback) => {
  const name = basename(path).replace('.pdf', '');

  const temp = `processed-pdf/${name}`;

  const args = [
    `--fit-width=${width}`,
    '--embed-javascript=0',
    '--embed-outline=0',
    '--process-outline=0',
    '--embed-css=0',
    '--embed-font=1',
    `--dest-dir=${temp}`,
    '--embed-image=1',
    '--heps=1',
    '--optimize-text=1',
    path
  ];

  execFile('pdf2htmlEX', args, (err, stdout, stderr) => {
    if (err) {
      throw err;
    }

    const html = splitBetween(
      String(
        fs.readFileSync(`${temp}/${name}.html`)
      ),
      '<div id="page-container">\n',
      '\n<div class="loading-indicator">'
    );

    const css = String(
      fs.readFileSync(`${temp}/${name}.css`)
    );

    callback(err, { html, css });
  });
}

module.exports = pdf2HTMLCSS;
