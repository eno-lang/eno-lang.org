const header = require('./header.js');

module.exports = (data, content, title, breadcrumb, activeUrl = null) => `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="description" content="The eno notation language and libraries">

      <title>${title}</title>

      <link rel="stylesheet" href="/styles.css">
    </head>

    <body>
      ${header(data, breadcrumb, activeUrl)}

      <div class="boundary header_offset padding">
        ${content}
      </div>

      <footer>
        <div class="boundary">
          2020 - The eno notation language and libraries.
          &nbsp;&nbsp;
          <a href="/">Home</a>
          &nbsp;&nbsp;
          <a href="/about/">About</a>
        </div>
      </footer>
    </body>
  </html>
`;
