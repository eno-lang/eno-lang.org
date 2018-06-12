// TODO: Consider menu.sections() API for getting a list of sections without specifying a name
//       assertAllTouched takes care to make sure there weren't other items as well that should
//       have been picked up sequentially.

// TODO: Sequential accessor for dictionaries (see below usecase for secondary header)

module.exports = (active = null, menu) => {
  const sections = menu.sequential();
  const currentSection = sections.find(section => {
    return section.section('pages').field(active) !== null;
  });

  return `
    <header>
      <div class="header__primary">
        <div class="boundary">
          <div class="menu">

            <a class="brand" href="/">eno</a>

            <div class="spacer"></div>

            ${sections.map(section => `
              <a class="menu__link ${section === currentSection ? 'active' : ''}" href="/${section.name}/">${section.field('label')}</a>
            `).join('')}

          </div>
        </div>
      </div>

      ${currentSection ? `
        <div class="header__secondary">
          <div class="boundary">
            <div class="menu">
              <span class="menu__text">${currentSection.field('tagline')}</span>

              <div class="spacer"></div>

              ${currentSection.section('pages').sequential().map(page => `
                <a class="menu__link" href="/${page.name}/">${page.value()}</a>
              `).join('')}
            </div>
          </div>
        </div>
      `:''}
    </header>
  `;
}
