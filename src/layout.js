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
        <link rel="stylesheet" href="/prism-eno.css">

        <script src="/prism.js"></script>
        <script src="/prism-eno.js"></script>
      </head>

      <body>
        ${content}
      </body>
    </html>
  `;

  return html;
};
