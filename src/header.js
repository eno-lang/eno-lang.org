// TODO: Consider menu.sections() API for getting a list of sections without specifying a name
//       assertAllTouched takes care to make sure there weren't other items as well that should
//       have been picked up sequentially.

// TODO: Sequential accessor for fieldsets (see below usecase for secondary header) (implemented but reevaluate in this context)

module.exports = (data, activeUrl = null) => {
  let currentPage, currentSection;
  for(let section of data.menu) {
    currentPage = section.pages.find(page => page.url === activeUrl);

    if(currentPage) {
      currentSection = section;
      break;
    }
  }

  return `
    <header>
      <div class="header__primary">
        <div class="boundary">
          <div class="menu">

            <a class="brand" href="/">eno</a>

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

      ${currentSection ? `
        <div class="header__secondary">
          <div class="boundary">
            <div class="menu compact">
              <a class="menu__link menu__toggle">
                ${currentPage.name} <span class="icon-dropdown"></span>
              </a>
            </div>

            <div class="menu__dropdown">
              ${currentSection.pages.map(page => `
                <a class="menu__link ${page.url === activeUrl ? 'active' : ''}"
                   href="${page.url}">
                  ${page.name}
                </a>
              `).join('')}
            </div>

            <script>
              document.querySelector('.menu__toggle').addEventListener('click', function(event) {
                event.preventDefault();
                document.querySelector('.menu__dropdown').classList.toggle('active');
              });
            </script>

            <div class="menu wide">
              <div class="menu__spacer"></div>

              ${currentSection.pages.map(page => `
                <a class="menu__link ${page.url === activeUrl ? 'active' : ''}"
                   href="${page.url}">
                  ${page.name}
                </a>
              `).join('')}
            </div>
          </div>
        </div>
      `:''}
    </header>
  `;
}
