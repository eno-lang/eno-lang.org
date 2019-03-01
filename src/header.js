// TODO: Consider menu.sections() API for getting a list of sections without specifying a name
//       assertAllTouched takes care to make sure there weren't other items as well that should
//       have been picked up sequentially.

module.exports = (data, breadcrumb, activeUrl = null) => {
  const currentSection = data.menu.find(section =>
    section.url === activeUrl || section.pages.includes(activeUrl)
  );

  let breadcrumbs = ' <a href="/">home</a>';

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
