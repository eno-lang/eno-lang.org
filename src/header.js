module.exports = (data, breadcrumb, activeUrl = null) => {
  const currentSection = data.menu.find(section =>
    activeUrl.startsWith(section.url) || section.pages.includes(activeUrl) // possible drop second part here and in in menu.eno
  );

  let breadcrumbs = ' <a href="/final">home</a>';

  if(currentSection) {
    breadcrumbs += ` &gt; <a href="${currentSection.url}">${currentSection.name}</a>`;
  }

  if(breadcrumb) {
    breadcrumbs += ` &gt; ${breadcrumb}`;
  }

  return `
    <header>
      <div class="header__primary">
        <div class="boundary">
          <div class="menu">
            <span class="menu__breadcrumbs">${breadcrumbs}</span>

            <div class="menu__spacer"></div>

            ${data.menu.filter(section => section.url !== '/').map(section => `
              <a class="menu__link ${section === currentSection ? 'active' : ''}"
                 href="${section.url}">
                ${section.name}
              </a>
            `).join('')}
          </div>
        </div>
      </div>
    </header>
  `;
}
