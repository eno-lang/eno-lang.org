module.exports = (active = null) => `
  <header>
    <div class="header__primary">
      <div class="boundary">
        <div class="menu">

          <a class="brand" href="/">eno</a>

          <div class="spacer"></div>

          <a class="menu__link ${active === 'write' ? 'active' : ''}" href="/write/">Write</a>
          <a class="menu__link ${active === 'develop' ? 'active' : ''}" href="/develop/">Develop</a>

        </div>
      </div>
    </div>

    <div class="header__secondary">
      <div class="boundary">
        <div class="menu">

          ${active === 'write' ? `
            <span class="menu__text">Write your content with eno</span>

            <div class="spacer"></div>

            <a class="menu__link" href="/write/">Introduction</a>
            <a class="menu__link" href="/advanced/">Advanced</a>
            <a class="menu__link" href="/plugins/">Plugins</a>
          `:''}

          ${active === 'develop' ? `
            <span class="menu__text">Develop applications and websites with eno</span>

            <div class="spacer"></div>

            <a class="menu__link" href="/develop/">Overview</a>
            <a class="menu__link" href="/javascript/">JavaScript</a>
            <a class="menu__link" href="/ruby/">Ruby</a>
            <a class="menu__link" href="/python/">Python</a>
          `:''}

        </div>
      </div>
    </div>
  </header>
`;
