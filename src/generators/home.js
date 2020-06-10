const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');

module.exports = async home => {
  const html = `
<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="Eno · Notation For Users">

        <title>Eno · Notation For Users</title>

        <link rel="stylesheet" href="/common.css">
        <link rel="stylesheet" href="/home.css">
    </head>

    <body>
        <a name="language"></a>

        <div class="header">
            <div class="centering">
                <a href="/" style="font-weight: 600;">Eno ·</a>

                <nav>
                    <a href="#language">Language</a>
                    <a class="optional" href="#plugins">Plugins</a>
                    <a href="#libraries">Libraries</a>
                    <a class="optional" href="#about">About</a>
                    <a class="optional" href="/blog/" target="_blank">Blog</a>
                </nav>
            </div>
        </div>

        <div class="info_badge">
            Follow 2020 development of the new reference parser at the <a href="/blog/" target="_blank">blog</a>
        </div>

        <div class="home_boundary home_padding">
            ${home}
        </div>
    </body>
</html>
  `.trim();

  await fsExtra.ensureDir(path.join(__dirname, '../../public'));
  await fs.promises.writeFile(path.join(__dirname, '../../public/index.html'), html);
};
