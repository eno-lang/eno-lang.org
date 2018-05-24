module.exports = content => {
  const html = `
    <!doctype html>
    <html>

      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="The eno notation language">

        <title>enojs - The JavaScript eno library</title>

        <link rel="stylesheet" href="/eno.css">
        <link rel="stylesheet" href="/styles.css">
        <link rel="stylesheet" href="/prism.css">

        <script defer src="/prism.js"></script>
      </head>

      <body>
        ${content}
      </body>
    </html>
  `;

  return html;
};
