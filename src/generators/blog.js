const fs = require('fs');
const path = require('path');

module.exports = async blog => {
  const html = `
<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="Eno Blog">

        <title>Eno Blog</title>

        <link rel="stylesheet" href="/common.css">
    </head>

    <body>
        <div class="body_padding boundary padding">
            <h1>Eno Blog</h1>

            You can subscribe to this blog via its <a href="/feed.rss">RSS feed</a>.

            ${blog.map(entry => `
                <p>
                    <a id="${entry.permalink}"></a>
                    <strong>
                      ${entry.date.toLocaleDateString('en-US', { year: 'numeric', day: 'numeric', month: 'long' })}
                    </strong>
                </p>

                ${entry.html}
            `).join('')}
        </div>
    </body>
</html>
  `.trim();

  await fs.promises.mkdir(path.join(__dirname, `../../public/blog`));
  await fs.promises.writeFile(path.join(__dirname, `../../public/blog/index.html`), html);
};
