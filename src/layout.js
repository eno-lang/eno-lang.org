module.exports = (data, content, title) => `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="description" content="Eno Notation">

      <title>${title}</title>

      <link rel="stylesheet" href="/styles.css">
    </head>

    <body>
      <div class="body_padding boundary padding">
        ${content}
      </div>
    </body>
  </html>
`;
