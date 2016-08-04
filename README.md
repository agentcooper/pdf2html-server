### pdf2html-server

Proof of concept: finding alternatives to [PDF.JS](https://mozilla.github.io/pdf.js/).

This repo contains:

- Server which provides PDF to HTML/CSS conversion (using [pdf2htmlex](https://github.com/coolwanglu/pdf2htmlEX))

- React components to communicate with the server and render the result

- Experimental selection rendering with React

#### Installation

```bash
brew install pdf2htmlex
npm install
```

#### Run

In different terminal tabs:

`npm start`

and

`npm run start-service`

#### Credits

- `src/external/base.min.css` comes from [coolwanglu/pdf2htmlEX](https://github.com/coolwanglu/pdf2htmlEX)
- `src/external/rangefix.js` comes from [edg2s/rangefix](https://github.com/edg2s/rangefix)
- Example PDF is taken from http://elm-lang.org/papers/concurrent-frp.pdf
