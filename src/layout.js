const footer = require('./footer.js');
const header = require('./header.js');

module.exports = (data, content, title, breadcrumb, activeUrl = null) => {
  const html = `
    <!doctype html>
    <html>

      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="The eno notation language and libraries">

        <title>${title}</title>

        <link rel="stylesheet" href="/styles.css">
        <script src="/scripts.js"></script>
      </head>

      <body>
        ${header(data, breadcrumb, activeUrl)}

        <div class="boundary padding">
          ${content}
        </div>

        ${footer()}
      </body>
    </html>
  `;

  return html;
};
