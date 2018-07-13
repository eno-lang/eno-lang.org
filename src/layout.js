const footer = require('./footer.js');
const header = require('./header.js');

module.exports = (content, title, active = null, menu) => {
  const html = `
    <!doctype html>
    <html>

      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="The eno notation language">

        <title>${title}</title>

        <link rel="stylesheet" href="/devicon.css">
        <link rel="stylesheet" href="/eno.css">
        <link rel="stylesheet" href="/styles.css">
        <link rel="stylesheet" href="/prism.css">
        <link rel="stylesheet" href="/prism-eno.css">

        <script src="/prism.js"></script>
        <script src="/prism-eno.js"></script>
      </head>

      <body>
        ${header(active, menu)}

        <div ${active !== 'demo' ? 'class="boundary padding"' : ''}>
          ${content}
        </div>

        ${footer()}
      </body>
    </html>
  `;

  return html;
};
