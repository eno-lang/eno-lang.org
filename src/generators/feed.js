const fs = require('fs');
const path = require('path');
const striptags = require('striptags');

const truncate = (str, len) =>
  str.length > len ? str.substring(0, len - 1) + "…" : str;

module.exports = blog => {
  const xml = `
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <atom:link href="https://eno-lang.org/feed.rss" rel="self" type="application/rss+xml"/>
    <description>Eno · A Data Language For Everyone</description>
  	<language>en</language>
  	<lastBuildDate>${(new Date).toUTCString()}</lastBuildDate>
    <link>https://eno-lang.org</link>
    <title>eno-lang.org</title>

    ${blog.map(entry => {
      const stripped = striptags(entry.html);

      return `
        <item>
          <description>${truncate(stripped, 160)}</description>
          <guid>https://eno-lang.org/blog/#${entry.permalink}</guid>
          <link>https://eno-lang.org/blog/#${entry.permalink}</link>
          <pubDate>${entry.date.toUTCString()}</pubDate>
          <title>${entry.date.toLocaleDateString('en-US', { year: 'numeric', day: 'numeric', month: 'long' })} - ${truncate(stripped, 60)}</title>
        </item>
      `;
    }).join('')}
	</channel>
</rss>
  `;

  fs.writeFileSync(
    path.join(__dirname, '../../public/feed.rss'),
    xml.trim()
  );
}
